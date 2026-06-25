import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { handleToken } from "../redux/slices/tokenSlice";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useLoginUserMutation, type LoginData } from "../redux/userApi";

export default function UserLoginPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [loginUser, { isLoading }] = useLoginUserMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginData>();

	const onSubmit = async (data: LoginData) => {
		try {
			const res = await loginUser(data).unwrap();

			dispatch(handleToken(res.token));
			localStorage.setItem("token", res.token);

			toast.success("Login successful");
			navigate("/dashboard");
		} catch (err: any) {
			toast.error(err?.data?.message || "Login failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4">
			{/* CARD */}
			<div className="w-full max-w-md bg-[#111827] border border-gray-700 rounded-xl p-6 text-left">
				{/* HEADER */}
				<div className="text-center mb-6">
					<h2 className="text-base font-semibold text-white">Login</h2>
					<p className="text-base text-gray-400 mt-1">Enter your credentials</p>
				</div>

				{/* FORM */}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* EMAIL */}
					<div className="flex flex-col gap-3">
						<label className="text-base text-gray-400">Email</label>
						<input
							{...register("email", {
								required: "Email is required",
							})}
							className="w-full mt-1 px-3 py-2 rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
							placeholder="you@example.com"
						/>
						{errors.email && (
							<p className="text-xs text-red-400 mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					{/* PASSWORD */}
					<div className="flex flex-col gap-3">
						<label className="text-base text-gray-400">Password</label>

						<div className="relative mt-1">
							<input
								{...register("password", {
									required: "Password is required",
								})}
								type={showPassword ? "text" : "password"}
								className="w-full px-3 py-2 pr-10 rounded-md bg-[#0b0f19] border border-gray-700 text-white outline-none"
								placeholder="••••••••"
							/>

							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-4 top-4 text-gray-400 cursor-pointer"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>

						{errors.password && (
							<p className="text-xs text-red-400 mt-1">
								{errors.password.message}
							</p>
						)}
					</div>

					{/* BUTTON */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600
hover:from-purple-500 hover:via-purple-400 hover:to-fuchsia-500
transition  text-white disabled:opacity-60 mb-6 cursor-pointer"
					>
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>

				{/* FOOTER */}
				<p className="text-center text-base mt-5 text-gray-400">
					Don’t have an account?{" "}
					<Link to="/register" className="text-blue-400">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
