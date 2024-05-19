import axios from "axios";

// Set the base URL for all Axios requests
const TOKEN_AUTH = localStorage.getItem("store_token");
const baseURL = "https://backend.atlbha.com/api/Store/";
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN_AUTH}`;

function getStoreTokenFromCookies() {
	const store_token = localStorage.getItem("store_token");
	return store_token ? store_token : null;
}

/**
 * Axios request interceptor to append authorization headers when needed.
 */
axios.interceptors.request.use(
	(req) => {
		// Do not add authorization header for login requests
		if (!req.url.includes("login")) {
			const storeToken = getStoreTokenFromCookies();
			if (storeToken) {
				req.headers.Authorization = `Bearer ${storeToken}`;
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
