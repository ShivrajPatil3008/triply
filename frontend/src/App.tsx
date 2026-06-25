import { lazy, Suspense, useMemo } from "react";

import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGetServerStatusQuery } from "./redux/serverStatusApi";
import ServerLoading from "./pages/ServerLoading";
import NotFound from "./pages/NotFound";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { userLoader } from "./auth/authLoaders";
import Loading from "./pages/Loading";
import UserLoginPage from "./pages/UserLoginPage";

import AppLayout from "./layout/AppLayout";
const UpdateItineraryPage = lazy(() => import("./pages/UpdateItineraryPage"));
const TripCodeViewerPage = lazy(() => import("./pages/TripCodeViewerPage"));

const UpdateTimeLinePage = lazy(() => import("./pages/UpdateTimeLinePage"));
const ItineraryView = lazy(() => import("./pages/ItineraryView"));

const CreateItineraryPage = lazy(() => import("./pages/CreateItineraryPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserRegistrationPage = lazy(() => import("./pages/UserRegistrationPage"));

function ServerGate({ children }: { children: React.ReactNode }) {
	const { isLoading, isError } = useGetServerStatusQuery();

	if (isLoading) return <ServerLoading />;
	if (isError) return <NotFound />;

	return <>{children}</>;
}

function App() {
	const router = useMemo(() => {
		return createBrowserRouter(
			createRoutesFromElements(
				<>
					<Route path="/" element={<UserLoginPage />} />
					<Route path="/register" element={<UserRegistrationPage />} />

					<Route element={<AppLayout />} loader={userLoader}>
						<Route path="/create-itinerary" element={<CreateItineraryPage />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/view-itinerary/:id" element={<ItineraryView />} />
						<Route
							path="/update-time-line/:id"
							element={<UpdateTimeLinePage />}
						/>
						<Route
							path="/update-itinerary/:id"
							element={<UpdateItineraryPage />}
						/>
						<Route
							path="/trip-code/:tripCode"
							element={<TripCodeViewerPage />}
						/>
					</Route>

					<Route path="*" element={<NotFound />} />
				</>,
			),
		);
	}, []);

	return (
		<>
			<div className="">
				<ToastContainer
					position="top-right"
					autoClose={3000} // 3 seconds
					hideProgressBar={false} // show progress bar
					closeOnClick={true} // click to close
					pauseOnHover={true}
					draggable={true}
					theme="dark"
					className="toast-container-custom toast-small"
				/>
				<ServerGate>
					<Suspense fallback={<Loading />}>
						<RouterProvider router={router} />
					</Suspense>
				</ServerGate>
			</div>
		</>
	);
}

export default App;
