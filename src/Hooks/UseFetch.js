import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserAuth } from "../Context/UserAuthorProvider";

export default function useFetch(url) {
	// const [cookies] = useCookies(["access_token"]);
	const userAuthored = useContext(UserAuth);
	const { userAuthor } = userAuthored;
	const [fetchedData, setFetchedData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);
	useEffect(() => {
		(async function () {
			try {
				setLoading(true);
				const response = await axios.get(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userAuthor}`,
					},
				});
				setFetchedData(response.data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		})();
	}, [url, reload]);

	return { fetchedData, error, loading, reload, setReload };
}
