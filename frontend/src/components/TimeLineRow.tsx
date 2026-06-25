import { memo, useCallback } from "react";

export type TimelineItem = {
	day?: string;
	date?: string;
	time?: string;
	event?: string;
};

type Props = {
	item: TimelineItem;
	index: number;
	setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
};

const TimelineRow = memo(({ item, index, setTimeline }: Props) => {
	const updateField = useCallback(
		(field: keyof TimelineItem, value: string) => {
			setTimeline((prev) => {
				const updated = [...prev];
				updated[index] = {
					...updated[index],
					[field]: value,
				};
				return updated;
			});
		},
		[index, setTimeline],
	);

	return (
		<tr className="border-t border-gray-700">
			<td className="p-2">
				<input
					value={item.day || ""}
					onChange={(e) => updateField("day", e.target.value)}
					className="w-full bg-transparent border border-gray-700 px-2 py-1"
				/>
			</td>

			<td className="p-2">
				<input
					value={item.date || ""}
					onChange={(e) => updateField("date", e.target.value)}
					className="w-full bg-transparent border border-gray-700 px-2 py-1"
				/>
			</td>

			<td className="p-2">
				<input
					value={item.time || ""}
					onChange={(e) => updateField("time", e.target.value)}
					className="w-full bg-transparent border border-gray-700 px-2 py-1"
				/>
			</td>

			<td className="p-2">
				<input
					value={item.event || ""}
					onChange={(e) => updateField("event", e.target.value)}
					className="w-full bg-transparent border border-gray-700 px-2 py-1"
				/>
			</td>
		</tr>
	);
});

export default TimelineRow;
