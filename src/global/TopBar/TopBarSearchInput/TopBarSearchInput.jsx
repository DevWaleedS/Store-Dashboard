import React from "react";

// ICons
import { AiOutlineSearch } from "react-icons/ai";

const TopBarSearchInput = () => {
	return (
		<li className='nav-item search-box d-md-flex d-none'>
			<input
				type='text'
				name='search'
				id='search'
				className='input'
				placeholder='أدخل كلمة البحث'
			/>
			<AiOutlineSearch />
		</li>
	);
};

export default TopBarSearchInput;
