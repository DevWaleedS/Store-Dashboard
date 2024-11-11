import React, { useEffect, useState } from "react";

// Icons
import { AiOutlineSearch } from "react-icons/ai";

// dashboardSections Array
import { dashboardSections } from "./DashboardSections";
import SearchSuggestionsResult from "./SearchSuggestionsResult/SearchSuggestionsResult";

const TopBarSearchInput = () => {
	const [search, setSearch] = useState("");
	const [searchSuggestions, setSearchSuggestions] = useState(null);

	const [timeoutId, setTimeoutId] = useState(null);

	useEffect(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		const newTimeoutId = setTimeout(() => {
			if (search !== "") {
				const filteredResults = dashboardSections?.filter((suggestion) =>
					suggestion?.sectionName?.toLowerCase().includes(search.toLowerCase())
				);
				// Remove duplicates using Set
				const uniqueResults = [...new Set(filteredResults)];
				setSearchSuggestions(uniqueResults);
			} else {
				setSearchSuggestions(null);
			}
		}, 100);

		setTimeoutId(newTimeoutId);

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [search]);

	return (
		<>
			<>
				<input
					type='text'
					id='search'
					name='search'
					className='input'
					autoComplete='false'
					placeholder='ابحث في أقسام المنصة'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<AiOutlineSearch className='search_icon' />
			</>

			{/* Search Suggestions Result */}
			{searchSuggestions?.length !== 0 && searchSuggestions !== null && (
				<SearchSuggestionsResult
					suggestionsResult={searchSuggestions}
					setSearchSuggestions={setSearchSuggestions}
					setSearch={setSearch}
				/>
			)}
		</>
	);
};

export default TopBarSearchInput;
