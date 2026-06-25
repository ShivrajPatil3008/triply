import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "../redux/userApi";
import { useNavigate } from "react-router-dom";

type RegisterForm = {
	userName: string;
	email: string;
	phone: string;
	address: string;
	age: string;
	gender: string;
	password: string;
	confirmPassword: string;
};

export default function UserRegistrationPage() {
	const navigate = useNavigate();
	const fileRef = useRef<HTMLInputElement | null>(null);

	const [registerUser, { isLoading }] = useRegisterUserMutation();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterForm>();

	const password = watch("password");

	// Avatar change (NO document API)
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

	const onSubmit = async (data: RegisterForm) => {
		if (data.password !== data.confirmPassword) {
			toast.error("Password mismatch");
			return;
		}

		try {
			const formData = new FormData();

			formData.append("userName", data.userName);
			formData.append("email", data.email);
			formData.append("phone", data.phone);
			formData.append("address", data.address);
			formData.append("age", data.age);
			formData.append("gender", data.gender);
			formData.append("password", data.password);

			if (avatarFile) {
				formData.append("avatar", avatarFile);
			}

			await registerUser(formData).unwrap();

			toast.success("User registered successfully");
			navigate("/");
		} catch (err: any) {
			toast.error(err?.data?.message || "Registration failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4">
			<div className="w-full max-w-md bg-[#111827] border border-gray-700 rounded-xl p-6 text-left">
				{/* HEADER */}
				<div className="text-center mb-6">
					<h2 className="text-xl font-semibold text-white">Register</h2>
					<p className="text-sm text-gray-400 mt-1">Create your account</p>
				</div>

				{/* AVATAR */}
				<div className="flex justify-center mb-6 relative">
					<div className="relative w-24 h-24">
						<img
							src={
								avatarPreview ||
								"https://cdn-icons-png.flaticon.com/512/847/847969.png"
							}
							alt="avatar"
							className="w-24 h-24 rounded-full object-cover border border-gray-600"
						/>

						{/* Pencil */}
						<button
							type="button"
							onClick={() => fileRef.current?.click()}
							className="absolute bottom-0 right-0 bg-purple-600 p-1.5 rounded-full"
						>
							<Pencil size={14} className="text-white" />
						</button>

						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							onChange={handleAvatarChange}
							className="hidden"
						/>
					</div>
				</div>

				{/* FORM */}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* USERNAME */}
					<div>
						<label className="text-sm text-gray-400">Username</label>
						<input
							{...register("userName", { required: "Required" })}
							className="w-full mt-1 px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
							placeholder="John Doe"
						/>
						{errors.userName && (
							<p className="text-xs text-red-400 mt-1">
								{errors.userName.message}
							</p>
						)}
					</div>

					{/* EMAIL */}
					<div>
						<label className="text-sm text-gray-400">Email</label>
						<input
							{...register("email", { required: "Required" })}
							className="w-full mt-1 px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
							placeholder="you@example.com"
						/>
					</div>

					{/* PHONE */}
					<div>
						<label className="text-sm text-gray-400">Phone</label>
						<input
							{...register("phone", { required: "Required" })}
							className="w-full mt-1 px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
						/>
					</div>

					{/* ADDRESS */}
					<div>
						<label className="text-sm text-gray-400">Address</label>
						<input
							{...register("address", { required: "Required" })}
							className="w-full mt-1 px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
						/>
					</div>

					{/* AGE + GENDER */}
					<div className="flex gap-2">
						<input
							{...register("age")}
							placeholder="Age"
							className="w-1/2 px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white"
						/>
						<input
							{...register("gender")}
							placeholder="Gender"
							className="w-1/2 px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white"
						/>
					</div>

					{/* PASSWORD */}
					<div>
						<label className="text-sm text-gray-400">Password</label>
						<div className="relative">
							<input
								{...register("password", { required: "Required" })}
								type={showPassword ? "text" : "password"}
								className="w-full mt-1 px-3 py-2 pr-10 rounded-md bg-[#0b0f19] border border-gray-700 text-white"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-4 top-4 text-gray-400"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					{/* CONFIRM PASSWORD */}
					<div>
						<label className="text-sm text-gray-400">Confirm Password</label>
						<div className="relative">
							<input
								{...register("confirmPassword", {
									validate: (value) =>
										value === password || "Password mismatch",
								})}
								type={showConfirmPassword ? "text" : "password"}
								className="w-full mt-1 px-3 py-2 pr-10 rounded-md bg-[#0b0f19] border border-gray-700 text-white"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-4 top-4 text-gray-400"
							>
								{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					{/* SUBMIT */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-white"
					>
						{isLoading ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</div>
	);
}
