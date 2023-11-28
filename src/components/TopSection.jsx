import * as React from "react";

// Icons
import { HomeIcon } from "../data/Icons";

// Search Components
import { TopBarSearchInput } from "../global";

const TopSection = () => {
	return (
		<div className='row'>
			<div className='col-12 d-md-none d-flex'>
				<div className='search-header-box'>
					<TopBarSearchInput />
				</div>
			</div>
			<div className='col-lg-6 col-12 mb-md-0 mb-2'>
				<div className='page-title d-flex justify-content-start align-items-baseline'>
					<HomeIcon className='home-icon' />
					<h5 className='d-flex align-self-end mb-0 me-2 h5'>الرئيسية</h5>
				</div>
			</div>
		</div>
	);
};

export default TopSection;
