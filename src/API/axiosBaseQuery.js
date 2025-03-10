import axios from "axios";

const axiosBaseQuery =
	({ baseUrl } = { baseUrl: "" }) =>
	async ({ url, method, data, params, headers = {} }) => {
		const storeToken = localStorage.getItem("storeToken");

		try {
			const result = await axios({
				url: baseUrl + url,
				method,
				data,
				params,
				headers: {
					...headers,
					Authorization: `Bearer ${storeToken}`,
				},
			});
			return { data: result.data };
		} catch (axiosError) {
			let err = axiosError;
			return {
				error: {
					status: err.response?.status,
					data: err.response?.data || err.message,
				},
			};
		}
	};

export default axiosBaseQuery;
