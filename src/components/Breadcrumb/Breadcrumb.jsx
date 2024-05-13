import React from "react";
import { Link } from "react-router-dom";

// Icons
import { ArrowBack, HomeIcon } from "../../data/Icons";

const Breadcrumb = ({
	currentPage,
	parentPage,
	route,
	mb,
	pt,
	icon,
	pageTile,
}) => {
	return (
		<div className={`head-category ${mb} ${pt}`}>
			<div className='row'>
				<h3>{pageTile}</h3>
				<nav aria-label='breadcrumb'>
					<ol className='breadcrumb'>
						<li className='breadcrumb-item'>
							{icon === "arrowRight" ? (
								<ArrowBack className='arrow-back-icon' />
							) : (
								<HomeIcon />
							)}

							<Link to='/' className='me-2'>
								الرئيسية
							</Link>
						</li>
						{parentPage && (
							<li className='breadcrumb-item' aria-current='page'>
								<Link to={route} className='me-2'>
									{parentPage}
								</Link>
							</li>
						)}

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
