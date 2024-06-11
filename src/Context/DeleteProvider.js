import React, { useState } from "react";

export const DeleteContext = React.createContext({});

const DeleteProvider = (props) => {
	const [itemId, setItemId] = useState(null);
	const [actionDelete, setActionDelete] = useState(null);
	const [handleDeleteSingleItem, setHandleDeleteSingleItem] = useState(null);

	// SET THIS TO HANDLE DELETE CATEGORIES THAT IS USED IN SOME PRODUCTS
	const [possibilityOfDelete, setPossibilityOfDelete] = useState(false);
	const DeleteModal = {
		itemId,
		setItemId,
		actionDelete,
		setActionDelete,
		possibilityOfDelete,
		setPossibilityOfDelete,
		handleDeleteSingleItem,
		setHandleDeleteSingleItem,
	};

	return (
		<DeleteContext.Provider value={DeleteModal}>
			{props.children}
		</DeleteContext.Provider>
	);
};

export default DeleteProvider;
