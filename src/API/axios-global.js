import axios from "axios";

const baseURL = "https://backend.atlbha.com/api/Store/";
axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(
	(req) => {
		if (!req.url.includes("login")) {
			const storeToken =
				document.cookie
					?.split("; ")
					?.find((cookie) => cookie.startsWith("store_token="))
					?.split("=")[1] || null;

			if (storeToken !== null) {
				req.headers.Authorization = `Bearer ${storeToken}`;
			}
		}

		return req;
	},
	(error) => {
		// Handle request error
		return Promise.reject(error);
	}
);

export default axios;
