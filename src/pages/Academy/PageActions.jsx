import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { BiSearch } from "react-icons/bi";

const PageActions = ({
	togglePage,
	searchExplain,
	searchCourses,
	setSearchCourses,
	setSearchExplain,
	searchLiveCourses,
	setSearchLiveCourses,
}) => {
	return (
		<div className='head-category mb-md-5 mb-3'>
			<div className='row'>
				<div className='col-md-6 col-12'>
					<Breadcrumb currentPage={"الأكاديمية"} />
				</div>
				<div className='col-md-6 col-12 d-flex justify-content-end'>
					<div className='pages-search-bx w-100'>
						{togglePage === 1 ? (
							<div className='pages-search-bx'>
								<BiSearch className='search-icon' />
								<input
									value={searchCourses}
									onChange={(e) => setSearchCourses(e.target.value)}
									type='text'
									name='search'
									id='search'
									placeholder='البحث عن دورة معينة'
								/>
							</div>
						) : togglePage === 2 ? (
							<div className='pages-search-bx'>
								<BiSearch className='search-icon' />
								<input
									value={searchLiveCourses}
									onChange={(e) => setSearchLiveCourses(e.target.value)}
									type='text'
									name='search'
									id='search'
									placeholder='البحث عن دورة مباشرة'
								/>
							</div>
						) : togglePage === 3 ? (
							<div className='pages-search-bx'>
								<BiSearch className='search-icon' />
								<input
									value={searchExplain}
									onChange={(e) => setSearchExplain(e.target.value)}
									type='text'
									name='search'
									id='search'
									placeholder='البحث عن شرح معين'
								/>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PageActions;
