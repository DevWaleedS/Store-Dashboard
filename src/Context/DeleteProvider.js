import React, { useState } from "react";

export const DeleteContext = React.createContext({});

const DeleteProvider = (props) => {
	const [actionDelete, setActionDelete] = useState(null);
	const [url, setUrl] = useState(null);
	const [deleteMethod, setDeleteMethod] = useState(null);
	const [deleteReload, setDeleteReload] = useState(false);
	// SET THIS TO HANDLE DELETE CATEGORIES THAT IS USED IN SOME PRODUCTS
	const [possibilityOfDelete, setPossibilityOfDelete] = useState(false);
	const DeleteModal = {
		setUrl,
		url,
		actionDelete,
		setActionDelete,
		setDeleteReload,
		deleteReload,
		setDeleteMethod,
		deleteMethod,
		possibilityOfDelete,
		setPossibilityOfDelete,
	};

	return (
		<DeleteContext.Provider value={DeleteModal}>
			{props.children}
		</DeleteContext.Provider>
	);
};

export default DeleteProvider;
