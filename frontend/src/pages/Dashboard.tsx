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

	/* debounce search */
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
		<div className="min-h-screen bg-[#0b0f19] text-white px-4 py-6">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
				<h1 className="text-xl font-semibold">Your Itineraries</h1>

				<button
					onClick={() => navigate("/create-itinerary")}
					className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600"
				>
					<Plus size={16} /> Add Itinerary
				</button>
			</div>

			{/* SEARCH */}
			<div className="flex flex-col md:flex-row gap-3 mb-6">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search trip by trip Code or Trip Title..."
					className="flex-1 px-3 py-2 rounded-md bg-[#111827] border border-gray-700 outline-none"
				/>
			</div>

			{/* LIST */}
			{isLoading ? (
				<p className="text-gray-400">Loading itineraries...</p>
			) : (
				<div className="flex flex-col gap-3">
					{itineraries.map((item) => (
						<div
							key={item._id}
							className="flex items-center justify-between p-4 rounded-xl 
							bg-gradient-to-r from-[#111827] to-[#0b0f19] 
							border border-gray-700 shadow-lg hover:shadow-purple-900/20 transition"
						>
							{/* LEFT */}
							<div>
								<h2 className="text-sm font-medium">{item.tripTitle}</h2>
								<p className="text-xs text-gray-400 text-left">
									{/* {new Date(item.createdAt!).toLocaleDateString()} */}
									{item.tripCode}
								</p>
							</div>

							{/* ACTIONS */}
							<div className="flex items-center gap-3">
								<button onClick={() => navigate(`/view-itinerary/${item._id}`)}>
									<Eye size={18} />
								</button>

								<button onClick={() => setUpdateId(item._id ?? null)}>
									<Pencil size={18} />
								</button>

								<button onClick={() => setDeleteId(item._id ?? null)}>
									<Trash2 size={18} />
								</button>

								<button onClick={() => setShareCode(item.tripCode ?? null)}>
									<Share2 size={18} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* FLOATING HISTORY BUTTON */}

			<button
				onClick={() => setViewHistory(true)}
				className="
	fixed bottom-6 right-6
	w-16 h-16
	rounded-full
	bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600
	flex items-center justify-center
	shadow-lg
	animate-bounce
	hover:scale-110
	transition
	"
			>
				<Plane size={28} />
			</button>

			{/* delete modal */}

			{deleteId && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center">
					<div className="bg-[#111827] p-5 rounded-lg border border-gray-700 w-[300px]">
						<p className="text-sm mb-4">
							Are you sure you want to delete this itinerary?
						</p>

						<div className="flex justify-end gap-3">
							<button
								className="px-3 py-1 text-sm border border-gray-600 rounded"
								onClick={() => setDeleteId(null)}
							>
								No
							</button>

							<button
								className="px-3 py-1 text-sm bg-red-600 rounded"
								onClick={async () => {
									if (!deleteId) return;

									try {
										await deleteItinerary(deleteId).unwrap();
										toast.success("Deleted successfully");
									} catch (err) {
										toast.error("Delete failed");
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

			{/* update modal */}

			{updateId && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
					<div className="relative w-[50%] min-h-[50%] bg-[#111827] border border-gray-700 rounded-xl p-8 flex flex-col justify-center">
						{/* close button */}
						<button
							onClick={() => setUpdateId(null)}
							className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
						>
							×
						</button>

						<div className="text-center mb-8">
							<h2 className="text-white text-2xl font-semibold">
								Update Itinerary
							</h2>

							<p className="text-gray-400 mt-2">
								Choose what you want to update
							</p>
						</div>

						<div className="flex gap-5 justify-center">
							<button
								onClick={() => navigate(`/update-itinerary/${updateId}`)}
								className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 text-white"
							>
								Re-upload Documents
							</button>

							<button
								onClick={() => navigate(`/update-time-line/${updateId}`)}
								className="flex-1 py-3 rounded-lg border border-gray-600 text-white hover:bg-gray-800"
							>
								Update Timeline
							</button>
						</div>
					</div>
				</div>
			)}

			{/* shareCode */}

			{shareCode && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
					<div className="relative w-full max-w-md bg-[#111827] border border-gray-700 rounded-xl p-6">
						<button
							onClick={() => setShareCode(null)}
							className="absolute right-4 top-4 text-gray-400 hover:text-white"
						>
							<X size={20} />
						</button>

						<h2 className="text-white text-xl font-semibold mb-2">
							Share Trip
						</h2>

						<p className="text-gray-400 text-sm mb-5">
							Share this trip code with your loved ones
						</p>

						<div className="flex gap-2">
							<input
								readOnly
								value={shareCode}
								className="flex-1 bg-[#0b0f19] border border-gray-700 rounded px-3 py-2 text-white"
							/>

							<button
								onClick={() => {
									navigator.clipboard.writeText(shareCode);

									toast.success("Trip code copied");
								}}
								className="px-4 bg-purple-600 rounded"
							>
								<Copy size={18} />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* VIEW HISTORY MODAL */}

			{viewHistory && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
					<div className="relative w-full max-w-md bg-[#111827] border border-gray-700 rounded-xl p-6">
						<button
							onClick={() => setViewHistory(false)}
							className="absolute right-4 top-4 text-gray-400 hover:text-white"
						>
							<X size={20} />
						</button>

						<h2 className="text-white text-xl font-semibold">
							View Travel History
						</h2>

						<p className="text-gray-400 text-sm mt-2 mb-5">
							Paste your loved one's trip code
						</p>

						<input
							value={historyCode}
							onChange={(e) => setHistoryCode(e.target.value)}
							placeholder="Enter trip code..."
							className="
			w-full
			bg-[#0b0f19]
			border border-gray-700
			rounded-md
			px-3 py-2
			text-white
			"
						/>

						<button
							onClick={() => {
								if (!historyCode) return;

								navigate(`/trip-code/${historyCode}`);
							}}
							className="
			mt-5
			w-full
			py-2
			rounded-lg
			bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600
			text-white
			"
						>
							View Trip
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
