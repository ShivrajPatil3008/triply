//
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
	const location = useLocation();

	useEffect(() => {
		console.error(
			"404 Error: User attempted to access non-existent route:",
			location.pathname,
		);
	}, [location.pathname]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
			<div className="text-center max-w-md">
				{/* 404 Title */}
				<h1 className="mb-4 text-6xl font-bold text-primary">404</h1>

				{/* Message */}
				<p className="mb-2 text-xl ">Oops! Page not found</p>

				<p className="mb-6 text-sm ">
					The page you are looking for doesn’t exist or has been moved.
				</p>

				{/* Home link */}
				<Link
					to="/"
					className="inline-block mt-5 px-5 py-2 rounded-lg  text-foreground hover:bg-secondary transition-colors bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600
hover:from-purple-500 hover:via-purple-400 hover:to-fuchsia-500
transition text-white"
				>
					Return to Home
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
