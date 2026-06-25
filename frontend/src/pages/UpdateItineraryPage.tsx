import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import {
	useGetItineraryByIdQuery,
	useUpdateItineraryMutation,
} from "../redux/itineraryApi";

type FormDataType = {
	tripTitle: string;
	files: FileList;
};

export default function UpdateItineraryPage() {
	const navigate = useNavigate();

	const { id } = useParams();

	const { data, isLoading: fetching } = useGetItineraryByIdQuery(id!);

	const [updateItinerary, { isLoading }] = useUpdateItineraryMutation();

	const [showModal, setShowModal] = useState(false);

	const [previewFiles, setPreviewFiles] = useState<File[]>([]);

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<FormDataType>();

	useEffect(() => {
		if (data?.data) {
			reset({
				tripTitle: data.data.tripTitle,
			});
		}
	}, [data, reset]);

	const validateFiles = (files: FileList) => {
		const allowed = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/webp",
			"image/gif",
			"image/heic",
			"image/heif",
			"application/pdf",
		];

		for (let i = 0; i < files.length; i++) {
			if (!allowed.includes(files[i].type)) {
				return false;
			}
		}

		return true;
	};

	const removeFile = (index: number) => {
		setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const onSubmit = async (data: FormDataType) => {
		try {
			if (previewFiles.length === 0) {
				setError("files", {
					message: "Files are required",
				});

				return;
			}

			if (!validateFiles(data.files)) {
				setError("files", {
					message: "Only images and PDF files are allowed",
				});

				return;
			}

			setShowModal(true);

			const formData = new FormData();

			formData.append(
				"tripTitle",

				data.tripTitle || "",
			);

			previewFiles.forEach((file) => {
				formData.append("files", file);
			});

			await updateItinerary({
				id: id!,

				formData,
			}).unwrap();

			toast.success("Itinerary updated successfully");

			navigate("/dashboard");
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to update itinerary");
		} finally {
			setShowModal(false);
		}
	};

	if (fetching) {
		return (
			<div className="min-h-screen flex justify-center items-center text-white">
				Loading...
			</div>
		);
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center bg-[#0b0f19] px-4">
			<button
				onClick={() => navigate("/dashboard")}
				className="absolute top-4 right-4 px-3 py-2 text-xs bg-[#111827] border border-gray-700 rounded hover:bg-gray-800 text-white"
			>
				← Back to Dashboard
			</button>

			<div className="w-full max-w-xl bg-[#111827] border border-gray-700 rounded-xl p-6">
				<div className="text-center mb-6">
					<h2 className="text-xl font-semibold text-white">Update Itinerary</h2>

					<p className="text-sm text-gray-400 mt-1">
						Upload documents to regenerate AI trip plan
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div className="flex flex-col gap-2">
						<label className="text-sm text-gray-400">Trip Title</label>

						<input
							{...register("tripTitle")}
							className="w-full px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm text-gray-400">
							Upload Documents (Images / PDF)
						</label>

						<input
							type="file"
							multiple
							accept="image/*,application/pdf"
							{...register("files", {
								required: "Files are required",
							})}
							onChange={(e) => {
								if (e.target.files) {
									setPreviewFiles(Array.from(e.target.files));
								}
							}}
							className="w-full text-white bg-[#0b0f19] border border-gray-700 p-2 rounded-md"
						/>

						{errors.files && (
							<p className="text-xs text-red-400">
								{errors.files.message as string}
							</p>
						)}
					</div>

					{previewFiles.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							{previewFiles.map((file, index) => {
								const isImage = file.type.startsWith("image/");

								const url = URL.createObjectURL(file);

								return (
									<div
										key={index}
										className="relative bg-[#0b0f19] border border-gray-700 rounded-md p-2"
									>
										<button
											type="button"
											onClick={() => removeFile(index)}
											className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
										>
											×
										</button>

										{isImage ? (
											<img
												src={url}
												className="w-full h-24 object-cover rounded"
											/>
										) : (
											<div className="w-full h-24 flex items-center justify-center text-gray-300 text-xs">
												PDF
											</div>
										)}

										<p className="text-[10px] text-gray-400 mt-1 truncate">
											{file.name}
										</p>
									</div>
								);
							})}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-white disabled:opacity-60"
					>
						{isLoading ? "Updating..." : "Update Itinerary"}
					</button>
				</form>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">
					<div className="bg-[#111827] border border-gray-700 rounded-xl p-6 text-center max-w-sm w-full">
						<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-4" />

						<h3 className="text-white font-semibold">Processing Your Trip</h3>

						<p className="text-gray-400 text-sm mt-2">
							AI is analyzing your documents and rebuilding your itinerary...
						</p>

						<p className="text-xs text-gray-500 mt-4">
							This may take a few seconds ....
						</p>

						<p className="text-xs text-gray-500 mt-4">
							Thank you for your patience.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
