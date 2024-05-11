import React from "react";
import { HomeIcon } from "../../data/Icons";
import { Link } from "react-router-dom";

const Breadcrumb = ({ currentPage, parentPage, route }) => {
	return (
		<div className='head-category'>
			<div className='row'>
				<nav aria-label='breadcrumb'>
					<ol className='breadcrumb'>
						<li className='breadcrumb-item'>
							<HomeIcon />
							<Link to='/' className='me-2'>
								الرئيسية
							</Link>
						</li>
						<li className='breadcrumb-item' aria-current='page'>
							<Link to={route} className='me-2'>
								{parentPage}
							</Link>
						</li>
						<li className='breadcrumb-item active' aria-current='page'>
							{currentPage}
						</li>
					</ol>
				</nav>
			</div>
		</div>
	);
};

export default Breadcrumb;
