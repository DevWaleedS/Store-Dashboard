import axios from "axios";

// this is the base url that is available into any component in the dashboard
axios.defaults.baseURL = "https://backend.atlbha.com/api/Store/";

axios.interceptors.request.use(
	(req) => {
		if (!req.url.includes("login")) {
			let store_token =
				document.cookie
					?.split("; ")
					?.find((cookie) => cookie.startsWith("store_token="))
					?.split("=")[1] || null;

			if (store_token !== null) {
				req.headers.Authorization = `Bearer ${store_token}`;
			}
		}

		return req;
	},
	(error) => {
		// Do something with request error
		return Promise.reject(error);
	}
);
