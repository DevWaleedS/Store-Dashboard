import React, { useEffect, useState } from 'react';

import Context from './context';

const ContextProvider = (props) => {
	const [title, setEndActionTitle] = useState(null);
	const [subCategories, setSubCategories] = useState([]);
	const [productsData, setProductsData] = React.useState();
	const [actionWarning, setActionWarning] = useState(false);

	useEffect(() => {
		if (title) {
			setTimeout(() => {
				setEndActionTitle(null);
				setActionWarning(false);
			}, 3000);
		}
	}, [title]);

	const context = {
		title,
		setEndActionTitle,
		actionWarning,
		setActionWarning,
		setSubCategories,
		subCategories,
		setProductsData,
		productsData,
	};

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default ContextProvider;
