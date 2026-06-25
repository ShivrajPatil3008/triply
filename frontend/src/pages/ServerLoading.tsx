// const ServerLoading = () => {
// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
// 			<div className="flex flex-col items-center gap-4">

// 				{/* Spinner */}
// 				<div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>

// 				{/* Text (unchanged content, only color theme updated) */}
// 				<p className="text-sm text-gray-400 leading-6 text-center min-h-[3.5em]">
// 					Almost there... <br />
// 					Starting server... this usually takes up to 1 minute.
// 					<br />
// 					Thanks for your patience.
// 				</p>

// 			</div>
// 		</div>
// 	);
// };

// export default ServerLoading;

const ServerLoading = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
			<div className="flex flex-col items-center gap-4">
				{/* Spinner */}
				<div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>

				{/* Text (unchanged content, only color theme updated) */}
				<p className="text-sm text-gray-400 leading-6 text-center min-h-[3.5em]">
					Almost there... <br />
					Starting server... this usually takes up to 1 minute.
					<br />
					Thanks for your patience.
				</p>
			</div>
		</div>
	);
};

export default ServerLoading;
