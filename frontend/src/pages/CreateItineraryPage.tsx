import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGenerateItineraryMutation } from "../redux/itineraryApi";

type FormDataType = {
	tripTitle: string;
	files: FileList;
};

export default function CreateItineraryPage() {
	const navigate = useNavigate();
	const [generateItinerary, { isLoading }] = useGenerateItineraryMutation();

	const [showModal, setShowModal] = useState(false);
	const [previewFiles, setPreviewFiles] = useState<File[]>([]);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormDataType>();

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
			if (!validateFiles(data.files)) {
				setError("files", {
					message: "Only images and PDF files are allowed",
				});
				return;
			}

			setShowModal(true);

			const formData = new FormData();
			formData.append("tripTitle", data.tripTitle);

			const filesArray = previewFiles;

			filesArray.forEach((file) => {
				formData.append("files", file);
			});

			await generateItinerary(formData).unwrap();

			toast.success("Itinerary created successfully");
			navigate("/dashboard");
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to generate itinerary");
		} finally {
			setShowModal(false);
		}
	};

	return (
		<div className="relative min-h-screen flex items-start md:items-center justify-center bg-[#0b0f19] px-4 py-6 md:py-10 overflow-x-hidden">
			<button
				onClick={() => navigate("/dashboard")}
				className="absolute top-3 right-3 md:top-4 md:right-4 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-[#111827] border border-gray-700 rounded-md hover:bg-gray-800 transition"
			>
				← Back to Dashboard
			</button>

			<div className="w-full max-w-xl bg-[#111827] border border-gray-700 rounded-xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">
				<div className="text-left md:text-center mb-4 md:mb-6">
					<h2 className="text-lg md:text-xl font-semibold text-white">
						Create Itinerary
					</h2>
					<p className="text-xs md:text-sm text-gray-400 mt-1">
						Upload documents to generate AI trip plan
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div className="flex flex-col gap-2">
						<label className="text-xs md:text-sm text-gray-400 text-left">
							Trip Title
						</label>
						<input
							{...register("tripTitle", {
								required: "Trip title is required",
							})}
							className="w-full px-3 py-2 text-sm rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
							placeholder="Summer Trip"
						/>
						{errors.tripTitle && (
							<p className="text-xs text-red-400">{errors.tripTitle.message}</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-xs md:text-sm text-gray-400 text-left">
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
							className="w-full text-sm text-white bg-[#0b0f19] border border-gray-700 p-2 rounded-md"
						/>

						{errors.files && (
							<p className="text-xs text-red-400">
								{errors.files.message as string}
							</p>
						)}
					</div>

					{previewFiles.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 overflow-x-hidden">
							{previewFiles.map((file, index) => {
								const isImage = file.type.startsWith("image/");
								const url = URL.createObjectURL(file);

								return (
									<div
										key={index}
										className="relative bg-[#0b0f19] border border-gray-700 rounded-md p-2 overflow-hidden"
									>
										<button
											type="button"
											onClick={() => removeFile(index)}
											className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
										>
											×
										</button>

										{isImage ? (
											<img
												src={url}
												alt="preview"
												className="w-full h-20 md:h-24 object-cover rounded"
											/>
										) : (
											<div className="w-full h-20 md:h-24 flex items-center justify-center text-gray-300 text-xs">
												PDF
											</div>
										)}

										<p className="text-[10px] md:text-xs text-gray-400 mt-1 truncate text-left">
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
						className="w-full py-2 md:py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 hover:from-purple-500 hover:via-purple-400 hover:to-fuchsia-500 transition text-white text-sm md:text-base disabled:opacity-60"
					>
						{isLoading ? "Generating..." : "Generate Itinerary"}
					</button>
				</form>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">
					<div className="bg-[#111827] border border-gray-700 rounded-xl p-5 md:p-6 text-center max-w-sm w-full">
						<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-4" />

						<h3 className="text-white font-semibold">Processing Your Trip</h3>

						<p className="text-gray-400 text-sm mt-2">
							AI is analyzing your documents and building your itinerary...
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
