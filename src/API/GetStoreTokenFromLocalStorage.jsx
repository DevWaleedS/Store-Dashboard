import { useEffect, useState } from "react";
import { useStoreTokenQuery } from "../store/apiSlices/getStoreTokenApi";

const GetStoreTokenFromLocalStorage = () => {
	const { data } = useStoreTokenQuery();

	const [storeToken, setStoreToken] = useState(null);

	useEffect(() => {
		if (data) {
			localStorage.setItem("storeToken", data);

			localStorage.setItem(
				"name",
				data?.user?.lastname
					? `${data?.user?.name} ${data?.user?.lastname}`
					: `${data?.user?.name}`
			);
			localStorage.setItem("userName", data?.user?.user_name);
			localStorage.setItem("userImage", data?.user?.image);
			localStorage.setItem("logo", data?.user?.store_logo);
			localStorage.setItem("domain", data?.user?.store_domain);
		}
		setStoreToken(localStorage.getItem("storeToken"));
	}, [data]);

	console.log(storeToken);
	return storeToken ? storeToken : null;
};

export default GetStoreTokenFromLocalStorage;
