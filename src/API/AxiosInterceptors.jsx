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
				// im using this condition to hide success message that coming from api
				if (
					response.status === 200 &&
					response?.data?.success &&
					![
						"https://backend.atlbha.com/api/Store/checkoutImport",
						"https://backend.atlbha.com/api/madfu/login",
						"https://backend.atlbha.com/api/madfu/create-order",
						"https://backend.atlbha.com/api/Store/verification_update",
						"https://backend.atlbha.com/api/Store/createSupplier",
						"https://backend.atlbha.com/api/Store/updateSupplier",
					].includes(response.config.url) &&
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
