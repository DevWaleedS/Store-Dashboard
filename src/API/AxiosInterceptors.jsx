import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";
import Context from "../Context/context";

const HTTP_UNAUTHORIZED = 401,
	HTTP_FORBIDDEN = 403;

const AxiosInterceptors = ({ children }) => {
	const navigate = useNavigate();
	const pageUrl = useLocation();
	const pathname = pageUrl?.pathname?.slice(1);
	const pathnameRef = useRef(pathname);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// ====== axios_interceptors ===============
	useEffect(() => {
		const responseInterceptors = axios.interceptors.response.use(
			(success) => {
				if (
					success?.status === 200 &&
					["delete", "patch", "post", "pull"].includes(success?.config?.method)
				) {
					setEndActionTitle(success?.data?.message?.ar);
				}

				return success;
			},
			(error) => {
				if (!error?.request?.responseURL.includes("login")) {
					if (JSON.parse(error?.response?.request?.response)?.message) {
						toast.error(
							JSON.parse(error?.response?.request?.response)?.message?.ar,
							{
								theme: "light",
							}
						);
					}

					// if the user is not logged in
					if (error.response.status === HTTP_UNAUTHORIZED) {
						// Clear all cookies
						for (const cookie of document.cookie.split(";")) {
							const [name, value] = cookie.trim().split("=");

							// Set the cookie's expiration to a past date to delete it
							document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
						}
						localStorage.clear();
						navigate("/auth/login");

						// if the user is not allowed to join any page
					} else if (error.response.status === HTTP_FORBIDDEN) {
						navigate("/");
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			// Eject the response interceptor
			axios.interceptors.request.eject(responseInterceptors);
		};
	}, [navigate]);

	/** ------------------------------------------------------------ */
	// Update the ref value whenever pathname changes
	useEffect(() => {
		pathnameRef.current = pathname;
	}, [pathname]);

	useEffect(() => {
		let verificationStoreStatusInterceptor; // Define the interceptor variable

		// Define the interceptor only for the specified pathnames

		// Create the interceptor
		verificationStoreStatusInterceptor = axios.interceptors.response.use(
			(response) => {
				if (
					[
						"Products",
						"PaymentGetways",
						"ShippingCompanies",
						"Carts",
						"Coupon",
						"PlatformServices",
						"PostalSubscriptions",
						"SEOStore",
						"Academy",
						"Delegate",
						"wallet",
						"EvaluationThePlatform",
					].includes(pathnameRef.current) &&
					response?.status === 200 &&
					response?.config?.url?.includes("verification_show") &&
					response?.data?.data?.stores[0]?.verification_status !== "تم التوثيق"
				) {
					navigate("/"); // Navigate to home page if verification fails
				}
				return response;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Clean up the interceptor when component unmounts
		return () => {
			// Eject the interceptor only if it's defined
			if (verificationStoreStatusInterceptor) {
				axios.interceptors.response.eject(verificationStoreStatusInterceptor);
			}
		};
	}, [pathnameRef.current]); // No dependencies needed for this useEffect hook

	return <>{children}</>;
};

export default AxiosInterceptors;
