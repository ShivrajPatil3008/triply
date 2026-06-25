import { redirect } from "react-router-dom";
import { store } from "../redux/store/store";
import { userApi } from "../redux/userApi";
export const userLoader = async () => {
	const token = localStorage.getItem("token");

	if (!token) {
		return redirect("/");
	}

	try {
		const result = await store.dispatch(userApi.endpoints.userAuth.initiate());

		if (result.data?.userAuthentication) {
			return null;
		}

		return redirect("/");
	} catch {
		return redirect("/");
	}
};
