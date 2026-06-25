import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	useDeleteItineraryMutation,
	useGetAllItinerariesQuery,
} from "../redux/itineraryApi";

import {
	Eye,
	Pencil,
	Trash2,
	Share2,
	Plus,
	Copy,
	X,
	Plane,
} from "lucide-react";

export default function Dashboard() {
	const navigate = useNavigate();

	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleteItinerary] = useDeleteItineraryMutation();
	const [updateId, setUpdateId] = useState<string | null>(null);
	const [shareCode, setShareCode] = useState<string | null>(null);

	const [viewHistory, setViewHistory] = useState(false);

	const [historyCode, setHistoryCode] = useState("");

	const { data, isLoading, refetch } = useGetAllItinerariesQuery({
		search: debouncedSearch,
	});

	useEffect(() => {
		const t = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => clearTimeout(t);
	}, [search]);

	useEffect(() => {
		refetch();
	}, []);

	const itineraries = data?.data || [];

	return (
		<div className="min-h-screen bg-[#0b0f19] text-white px-3 md:px-6 py-4 md:py-6">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 mb-4 md:mb-5">
				<h1 className="text-lg md:text-xl font-semibold">Your Itineraries</h1>

				<button
					onClick={() => navigate("/create-itinerary")}
					className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-sm md:text-base"
				>
					<Plus size={16} /> Add Trip
				</button>
			</div>

			{/* SEARCH */}
			<div className="flex flex-col md:flex-row gap-2 mb-4 md:mb-5">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search trip by name or by trip code..."
					className="flex-1 px-3 py-2 rounded-md bg-[#111827] border border-gray-700 outline-none text-sm"
				/>
			</div>

			{/* LIST */}
			{isLoading ? (
				<p className="text-gray-400 text-sm">Loading...</p>
			) : itineraries.length === 0 ? (
				<div className="flex items-center justify-center min-h-[50vh]">
					<p className="text-gray-400 text-base md:text-lg text-center">
						Add your first trip by clicking on "+ Add Trip" button
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-2 md:gap-2.5">
					{itineraries.map((item) => (
						<div
							key={item._id}
							className="flex items-center justify-between p-3 rounded-lg 
							bg-gradient-to-r from-[#111827] to-[#0b0f19] 
							border border-gray-700 shadow-sm hover:shadow-purple-900/20 transition"
						>
							{/* LEFT */}
							<div className="min-w-0">
								<h2 className="text-sm text-left font-medium truncate">
									{item.tripTitle}
								</h2>
								<p className="text-xs text-left text-gray-400 truncate">
									{item.tripCode}
								</p>
							</div>

							{/* ACTIONS */}
							<div className="flex items-center gap-2">
								<button onClick={() => navigate(`/view-itinerary/${item._id}`)}>
									<Eye size={20} />
								</button>

								<button onClick={() => setUpdateId(item._id ?? null)}>
									<Pencil size={20} />
								</button>

								<button onClick={() => setDeleteId(item._id ?? null)}>
									<Trash2 size={20} />
								</button>

								<button onClick={() => setShareCode(item.tripCode ?? null)}>
									<Share2 size={20} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* FLOATING BUTTON */}
			<button
				onClick={() => setViewHistory(true)}
				className="
					fixed bottom-5 right-5
					w-12 h-12 md:w-14 md:h-14
					rounded-full
					bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600
					flex items-center justify-center
					shadow-md
					hover:scale-105 transition
				"
			>
				<Plane size={22} />
			</button>

			{/* DELETE MODAL */}
			{deleteId && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">
					<div className="w-full max-w-sm md:max-w-md bg-[#111827] border border-gray-700 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
						{/* TEXT */}
						<p className="text-sm md:text-base text-gray-300 text-center mb-5">
							Delete this itinerary?
						</p>

						{/* BUTTONS */}
						<div className="flex items-center justify-center gap-3">
							<button
								className="px-4 py-2 text-sm border border-gray-600 rounded-md hover:bg-gray-800 transition"
								onClick={() => setDeleteId(null)}
							>
								No
							</button>

							<button
								className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition"
								onClick={async () => {
									if (!deleteId) return;

									try {
										await deleteItinerary(deleteId).unwrap();
										toast.success("Deleted");
									} catch {
										toast.error("Failed");
									} finally {
										setDeleteId(null);
									}
								}}
							>
								Yes
							</button>
						</div>
					</div>
				</div>
			)}

			{/* UPDATE MODAL */}
			{updateId && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
					<div className="relative w-full max-w-md bg-[#111827] border border-gray-700 rounded-xl p-5 md:p-6">
						<button
							onClick={() => setUpdateId(null)}
							className="absolute top-1 right-1 text-gray-400 text-xl bg-gray-800 rounded-full p-2"
						>
							<X size={15} />
						</button>

						<h2 className="text-center text-lg font-semibold mb-4">Update</h2>

						<div className="flex flex-col md:flex-row gap-2">
							<button
								onClick={() => navigate(`/update-itinerary/${updateId}`)}
								className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-sm"
							>
								Re-Upload Docs
							</button>

							<button
								onClick={() => navigate(`/update-time-line/${updateId}`)}
								className="flex-1 py-2 rounded-lg border border-gray-600 text-sm"
							>
								Update Timeline
							</button>
						</div>
					</div>
				</div>
			)}

			{/* SHARE MODAL */}
			{shareCode && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
					<div className="relative w-full max-w-lg min-h-[180px] bg-[#0f172a] border border-gray-600 rounded-xl p-6 shadow-2xl flex flex-col gap-5">
						{/* CLOSE BUTTON */}
						<button
							onClick={() => setShareCode(null)}
							className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
						>
							<X size={18} />
						</button>

						{/* TITLE */}
						<h2 className="text-lg font-semibold mb-2">Share Trip Code</h2>

						<p className="text-xs text-gray-400 mb-3">
							Share this code with others so they can view your itinerary.
						</p>
						{/* INPUT + COPY */}
						<div className="flex gap-2">
							<input
								readOnly
								value={shareCode}
								className="flex-1 bg-[#0b0f19] border border-gray-700 rounded-md px-3 py-2 text-sm text-white"
							/>

							<button
								onClick={() => {
									navigator.clipboard.writeText(shareCode);
									toast.success("Copied");
								}}
								className="px-3 bg-gray-700 hover:bg-gray-600 rounded-md transition"
							>
								<Copy size={18} />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* HISTORY MODAL */}
			{viewHistory && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
					<div className="relative w-full max-w-md bg-[#111827] border border-gray-700 rounded-xl p-5">
						<button
							onClick={() => setViewHistory(false)}
							className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
						>
							<X size={18} />
						</button>
						<h2 className="text-lg font-semibold">Past Trip Code</h2>

						<p className="text-xs text-gray-400 mt-1 mb-3">
							Enter a valid trip code to view travel history details.
						</p>

						<input
							value={historyCode}
							onChange={(e) => setHistoryCode(e.target.value)}
							className="w-full mt-3 bg-[#0b0f19] border border-gray-700 rounded px-3 py-2 text-sm"
						/>

						<button
							onClick={() => {
								if (!historyCode) return;
								navigate(`/trip-code/${historyCode}`);
							}}
							className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-sm"
						>
							View
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
