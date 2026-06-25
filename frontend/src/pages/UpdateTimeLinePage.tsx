import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	useGetItineraryByIdQuery,
	useUpdateTimelineMutation,
} from "../redux/itineraryApi";
import TimelineRow, { type TimelineItem } from "../components/TimeLineRow";
import { toast } from "react-toastify";

export default function UpdateTimeLinePage() {
	const { id } = useParams();

	const { data, isLoading } = useGetItineraryByIdQuery(id!);
	const [updateTimeline] = useUpdateTimelineMutation();

	const [timeline, setTimeline] = useState<TimelineItem[]>([]);

	const [title, setTitle] = useState("");

	const navigate = useNavigate();

	const itinerary = data?.data;

	useEffect(() => {
		if (itinerary?.cleanTimeLine) {
			setTimeline(itinerary.cleanTimeLine);
		}
		if (itinerary?.tripTitle) {
			setTitle(itinerary.tripTitle);
		}
	}, [itinerary]);

	const handleSave = useCallback(async () => {
		try {
			await updateTimeline({
				id: id!,
				body: {
					cleanTimeLine: timeline,
					tripTitle: title,
				},
			}).unwrap();

			toast.success("Timeline updated successfully");
		} catch (err) {
			toast.error("Failed to update timeline");
		}
	}, [timeline, id, itinerary, updateTimeline, title]);

	if (isLoading) return <p className="text-white p-4">Loading...</p>;

	return (
		<div className="relative min-h-screen bg-[#0b0f19] text-white px-6 py-6">
			<button
				onClick={() => navigate("/dashboard")}
				className="absolute top-4 right-4 px-3 py-2 text-xs bg-[#111827] border border-gray-700 rounded hover:bg-gray-800"
			>
				← Back to Dashboard
			</button>
			{/* SAVE BUTTON */}
			<button
				onClick={handleSave}
				className="mb-4 px-3 py-1 text-xs bg-green-600 rounded"
			>
				Save Timeline
			</button>

			{/* Title */}
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="mb-4 w-full px-3 py-2 bg-[#111827] border border-gray-700 rounded"
				placeholder="Trip Title"
			/>
			{/* TABLE */}
			<table className="w-full border border-gray-700 text-sm">
				<thead className="bg-[#111827]">
					<tr>
						<th className="p-2">Day</th>
						<th className="p-2">Date</th>
						<th className="p-2">Time</th>
						<th className="p-2">Event</th>
					</tr>
				</thead>

				<tbody>
					{timeline.map((item, index) => (
						<TimelineRow
							key={index}
							item={item}
							index={index}
							setTimeline={setTimeline}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
