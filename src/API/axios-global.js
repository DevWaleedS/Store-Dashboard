import axios from "axios";

// Set the base URL for all Axios requests
const AUTH_TOKEN = localStorage.getItem("storeToken");
const baseURL = "https://backend.atlbha.com/api/Store/";
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common["Authorization"] = `Bearer ${AUTH_TOKEN}`;

/**
 * Axios request interceptor to append authorization headers when needed.
 */
axios.interceptors.request.use(
	(req) => {
		// Do not add authorization header for login requests
		if (!req.url.includes("login")) {
			if (AUTH_TOKEN) {
				req.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
			}
		}
		return req;
	},
	(error) => {
		// Log and handle request preparation errors
		console.error("Error in request config:", error);
		return Promise.reject(error);
	}
);

export default axios;
