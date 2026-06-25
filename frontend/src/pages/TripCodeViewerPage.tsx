import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useGetItineraryByCodeQuery } from "../redux/itineraryApi";

export default function TripCodeViewerPage() {
	const { tripCode } = useParams();

	const { data, isLoading } = useGetItineraryByCodeQuery(tripCode!);

	const [openExtracted, setOpenExtracted] = useState(false);
	const [openDocs, setOpenDocs] = useState(false);

	const navigate = useNavigate();

	if (isLoading) return <p className="text-white p-4">Loading...</p>;

	const itinerary = data?.data;

	const getMediaName = (media: any) => {
		if (!media || typeof media !== "object") return "N/A";
		return media.originalname || "N/A";
	};

	const getMediaLink = (media: any) => {
		if (!media || typeof media !== "object") return undefined;
		return media.fileLocation;
	};

	return (
		<div className="relative min-h-screen bg-[#0b0f19] text-white px-6 py-6">
			{/* BACK */}
			<button
				onClick={() => navigate("/dashboard")}
				className="absolute top-4 right-4 px-3 py-2 text-xs bg-[#111827] border border-gray-700 rounded hover:bg-gray-800"
			>
				← Back to Dashboard
			</button>

			{/* TITLE */}
			<h1 className="text-2xl font-semibold mb-6">
				Trip Code: {itinerary?.tripCode}
			</h1>

			<h2 className="text-md text-gray-400 mb-6">
				Trip Name: {itinerary?.tripTitle}
			</h2>

			{/* TIMELINE */}
			<div className="mb-6">
				<h2 className="text-lg mb-2">Timeline</h2>

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
						{itinerary?.cleanTimeLine?.map((t: any, i: number) => (
							<tr key={i} className="border-t border-gray-700">
								<td className="p-2">{t.day}</td>
								<td className="p-2">{t.date}</td>
								<td className="p-2">{t.time}</td>
								<td className="p-2">{t.event}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* ACCORDION 1 */}
			<div className="mb-4 border border-gray-700 rounded-md">
				<button
					className="w-full flex items-center justify-between p-3 bg-[#111827]"
					onClick={() => setOpenExtracted((p) => !p)}
				>
					<span>Extracted Data</span>

					<ChevronDown
						className={`transition-transform ${
							openExtracted ? "rotate-180" : ""
						}`}
						size={18}
					/>
				</button>

				{openExtracted && (
					<div className="p-3 text-sm space-y-4">
						{itinerary?.extractedData?.map((doc: any, i: number) => (
							<div key={i} className="border-b border-gray-700 pb-3">
								<p className="text-gray-400">
									Document: {getMediaName(doc.mediaId)}
								</p>

								<pre className="text-xs text-gray-300 whitespace-pre-wrap">
									{JSON.stringify(doc, null, 2)}
								</pre>
							</div>
						))}
					</div>
				)}
			</div>

			{/* ACCORDION 2 */}
			<div className="border border-gray-700 rounded-md">
				<button
					className="w-full flex items-center justify-between p-3 bg-[#111827]"
					onClick={() => setOpenDocs((p) => !p)}
				>
					<span>Documents</span>

					<ChevronDown
						className={`transition-transform ${openDocs ? "rotate-180" : ""}`}
						size={18}
					/>
				</button>

				{openDocs && (
					<div className="p-3 space-y-3">
						{itinerary?.extractedData?.map((doc: any, i: number) => (
							<div
								key={i}
								className="flex justify-between items-center border-b border-gray-700 pb-2"
							>
								<p className="text-sm">{getMediaName(doc.mediaId)}</p>

								<a
									href={getMediaLink(doc.mediaId)}
									target="_blank"
									rel="noreferrer"
									className="px-3 py-1 text-xs bg-purple-600 rounded"
								>
									Download
								</a>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
