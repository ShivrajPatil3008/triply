import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ScrollToTop from "../components/ScrollToTop";

export default function AppLayout() {
	return (
		<div className="min-h-screen bg-[#0b0f19]">
			<Navbar />

			<main className="p-4">
				<ScrollToTop />

				<Outlet />
			</main>
		</div>
	);
}
