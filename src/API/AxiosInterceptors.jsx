import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";
import Context from "../Context/context";
import { useSelector } from "react-redux";

const HTTP_UNAUTHORIZED = 401,
	HTTP_FORBIDDEN = 403;

const AxiosInterceptors = ({ children }) => {
	const navigate = useNavigate();
	const pageUrl = useLocation();
	const pathname = pageUrl?.pathname?.slice(1);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const { verificationStoreStatus } = useSelector((state) => state.VerifyModal);

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

	// ======  to handle navigate user to home page if it not verify his account ===============
	useEffect(() => {
		let verificationStoreStatusInterceptors; // Define the interceptor variable
		// Check if the pathname matches any of the specified values
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
			].includes(pathname)
		) {
			// Define the interceptor only for the specified pathnames
			verificationStoreStatusInterceptors = axios.interceptors.response.use(
				(success) => {
					if (
						success?.status === 200 &&
						success?.config?.url?.includes("verification_show") &&
						success?.data?.data?.stores[0]?.verification_status !== "تم التوثيق"
					) {
						navigate("/");
					}

					return success;
				}
			);
		}

		return () => {
			// Eject the verification interceptor only if it's defined
			if (verificationStoreStatusInterceptors) {
				axios.interceptors.request.eject(verificationStoreStatusInterceptors);
			}
		};
	}, [pathname]);

	return <>{children}</>;
};

export default AxiosInterceptors;
