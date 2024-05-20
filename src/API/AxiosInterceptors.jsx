import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Context from "../Context/context";

const HTTP_UNAUTHORIZED = 401,
	HTTP_FORBIDDEN = 403;

const AxiosInterceptors = ({ children }) => {
	const navigate = useNavigate();

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	useEffect(() => {
		const responseInterceptors = axios.interceptors.response.use(
			(response) => {
				// Handle successful responses globally
				if (
					response.status === 200 &&
					["delete", "patch", "post", "put"].includes(response.config.method)
				) {
					setEndActionTitle(response.data.message?.ar);
				}
				return response;
			},
			(error) => {
				// Handle errors globally except for the login endpoint
				if (!error.request?.responseURL.includes("login")) {
					const responseMessage = JSON.parse(
						error.response?.request?.response
					)?.message;
					if (responseMessage) {
						toast.error(responseMessage.ar, { theme: "light" });
					}

					switch (error.response.status) {
						case HTTP_UNAUTHORIZED:
							// Log out the user
							document.cookie.split(";").forEach((cookie) => {
								const eqPos = cookie.indexOf("=");
								const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
								document.cookie =
									name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
							});
							localStorage.clear();
							navigate("/auth/login");
							break;
						case HTTP_FORBIDDEN:
							// Redirect to home page
							navigate("/");
							break;
						default:
							// Handle other types of errors
							console.error("Unhandled error:", error);
					}
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.response.eject(responseInterceptors);
		};
	}, [navigate, setEndActionTitle]);

	return <>{children}</>;
};

export default AxiosInterceptors;
