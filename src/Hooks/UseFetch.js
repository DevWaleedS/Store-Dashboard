import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function useFetch(url) {
	const [cookies] = useCookies(["access_token"]);

	const [fetchedData, setFetchedData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await axios.get(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				});

				if (isMounted) {
					setFetchedData(response.data);
				}
			} catch (err) {
				if (isMounted) {
					setError(err);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchData();

		// Cleanup function
		return () => {
			isMounted = false;
		};
	}, [url, reload, cookies]);

	// استخدام useMemo لتجنب إعادة حساب القيم بشكل غير ضروري
	const memoizedValues = useMemo(
		() => ({
			fetchedData,
			error,
			loading,
			reload,
			setReload,
		}),
		[fetchedData, error, loading, reload, setReload]
	);

	return memoizedValues;
}

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";

// export default function useFetch(url) {
// 	const [cookies] = useCookies(["access_token"]);

// 	const [fetchedData, setFetchedData] = useState(null);
// 	const [error, setError] = useState(null);
// 	const [loading, setLoading] = useState(false);
// 	const [reload, setReload] = useState(false);
// 	useEffect(() => {
// 		(async function () {
// 			try {
// 				setLoading(true);
// 				const response = await axios.get(url, {
// 					headers: {
// 						"Content-Type": "application/json",
// 						Authorization: `Bearer ${cookies?.access_token}`,
// 					},
// 				});
// 				setFetchedData(response.data);
// 			} catch (err) {
// 				setError(err);
// 			} finally {
// 				setLoading(false);
// 			}
// 		})();
// 	}, [url, reload]);

// 	return { fetchedData, error, loading, reload, setReload };
// }
