import axios from "axios";

// Set the base URL for all Axios requests
const baseURL = "https://backend.atlbha.com/api/Store/";
axios.defaults.baseURL = baseURL;

/**
 * Extracts the store token from the browser's cookies.
 * @returns {string|null} The token if found, otherwise null.
 */
function getStoreTokenFromCookies() {
	const cookieValue = document.cookie
		.split("; ")
		.find((row) => row.startsWith("store_token="));
	return cookieValue ? cookieValue.split("=")[1] : null;
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
