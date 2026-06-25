import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken } from "../redux/slices/tokenSlice";
import {
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} from "../redux/userApi";
import { LogOut, Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

type FormValues = {
	userName: string;
	email: string;
	phone: string;
	address: string;
	age: string;
	gender: string;
	password: string;
};

export default function Navbar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const fileRef = useRef<HTMLInputElement | null>(null);

	const { data, refetch } = useGetUserDetailsQuery();
	const [updateUser] = useUpdateUserMutation();

	const user = data?.data;

	const [open, setOpen] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const { register, handleSubmit, reset, watch } = useForm<FormValues>();

	// fill form
	useEffect(() => {
		if (!user) return;

		reset({
			userName: user.userName || "",
			email: user.email || "",
			phone: user.phone || "",
			address: user.address || "",
			age: user.age || "",
			gender: user.gender || "",
			password: "",
		});

		setAvatarPreview(
			user.avatar && "fileLocation" in user.avatar
				? user.avatar.fileLocation
				: "/favicon.png",
		);
	}, [user, reset]);

	// logout
	const handleLogout = () => {
		dispatch(clearToken());
		localStorage.removeItem("token");
		navigate("/");
	};

	// avatar upload
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setAvatarFile(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	// update submit
	const onSubmit = async (data: FormValues) => {
		try {
			if (confirmPassword && confirmPassword !== data.password) {
				toast.error("Password mismatch");
				return;
			}

			const formData = new FormData();

			Object.entries(data).forEach(([key, value]) => {
				formData.append(key, value as string);
			});

			if (avatarFile) {
				formData.append("avatar", avatarFile);
			}

			await updateUser(formData).unwrap();

			toast.success("Profile updated");
			setOpen(false);
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Update failed");
		}
	};

	return (
		<>
			{/* NAVBAR */}
			<div className="w-full bg-[#111827] border-b border-gray-700 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between h-16 md:h-20">
				<h1 className="text-white font-semibold text-lg md:text-xl tracking-wide">
					TripLy
				</h1>

				<div className="flex items-center gap-2 md:gap-4">
					{/* AVATAR (smaller) */}
					<img
						src={
							user?.avatar && "fileLocation" in user.avatar
								? user.avatar.fileLocation
								: "/favicon.png"
						}
						onClick={() => setOpen(true)}
						className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-600 cursor-pointer hover:scale-105 transition"
					/>

					{/* LOGOUT */}
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-md bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 text-sm transition cursor-pointer"
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			</div>

			{/* MODAL */}
			{open && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-200">
					<div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-[#111827] border border-gray-700 rounded-xl p-5 text-left max-h-[90vh] overflow-y-auto">
						<h2 className="text-white text-lg mb-4">Update Profile</h2>

						{/* AVATAR (pencil TOP only) */}
						<div className="flex justify-center mb-4 relative">
							<button
								type="button"
								onClick={() => fileRef.current?.click()}
								className="absolute bottom-2 right-[calc(50%-80px)] bg-purple-600 p-2 rounded-full"
							>
								<Pencil size={18} className="text-white" />
							</button>

							<img
								src={avatarPreview || "/favicon.png"}
								className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border"
							/>

							<input
								ref={fileRef}
								type="file"
								accept="image/*"
								onChange={handleAvatarChange}
								className="hidden"
							/>
						</div>

						{/* FORM */}
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
							<input
								{...register("userName")}
								className="w-full px-3 py-2 bg-[#0b0f19] border border-gray-700 text-white rounded-md"
								placeholder="Username"
							/>

							<input
								{...register("email")}
								readOnly
								className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-400 rounded-md"
							/>

							<input
								{...register("phone")}
								className="w-full px-3 py-2 bg-[#0b0f19] border border-gray-700 text-white rounded-md"
							/>

							<input
								{...register("address")}
								className="w-full px-3 py-2 bg-[#0b0f19] border border-gray-700 text-white rounded-md"
							/>

							<div className="flex gap-2">
								<input
									{...register("age")}
									className="w-1/2 px-3 py-2 bg-[#0b0f19] border border-gray-700 text-white rounded-md"
								/>

								<input
									{...register("gender")}
									className="w-1/2 px-3 py-2 bg-[#0b0f19] border border-gray-700 text-white rounded-md"
								/>
							</div>

							{/* PASSWORD */}
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									{...register("password")}
									className="w-full px-3 py-2 bg-[#0b0f19] border border-gray-700 text-white rounded-md pr-10"
									placeholder="New Password"
								/>

								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-4 top-3 text-gray-400"
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>

							{/* CONFIRM PASSWORD */}
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setPasswordError(
											e.target.value !== watch("password")
												? "Passwords do not match"
												: "",
										);
									}}
									className="w-full px-3 py-2 bg-[#0b0f19] border border-gray-700 text-white rounded-md pr-10"
									placeholder="Confirm Password"
								/>

								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-4 top-3 text-gray-400"
								>
									{showConfirmPassword ? (
										<EyeOff size={18} />
									) : (
										<Eye size={18} />
									)}
								</button>

								{passwordError && (
									<p className="text-red-400 text-xs mt-1">{passwordError}</p>
								)}
							</div>

							{/* ACTIONS */}
							<div className="flex flex-col md:flex-row gap-3 pt-4">
								<button
									type="button"
									onClick={() => setOpen(false)}
									className="w-full md:w-1/2 py-3 bg-gray-700 text-white rounded-md cursor-pointer"
								>
									Cancel
								</button>

								<button
									type="submit"
									className="w-full md:w-1/2 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-white rounded-md cursor-pointer"
								>
									Update
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
