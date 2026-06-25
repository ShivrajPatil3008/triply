const Loading = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#16171d]">
			<div className="flex flex-col items-center gap-4">
				<div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
				<p className="text-sm text-gray-300">Loading...</p>
			</div>
		</div>
	);
};

export default Loading;
