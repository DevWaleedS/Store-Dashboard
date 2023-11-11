import React, { useState } from "react";

// Third Party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// Icons
import { BiSearch } from "react-icons/bi";
import arrowBack from "../data/Icons/icon-30-arrwos back.svg";

// Components
import Explain from "./Explain";
import CoursesTraining from "./CoursesTraining";

const Academy = () => {
	// Use state to the next button
	const [togglePage, setTogglePag] = useState(1);

	// Set function to change between pages
	const togglePagesHandle = (index) => {
		setTogglePag(index);
	};
	const [searchCourses, setSearchCourses] = useState("");
	const [searchExplain, setSearchExplain] = useState("");

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الأكاديمية</title>
			</Helmet>
			<section className='academy-page p-lg-3'>
				<div className='head-category mb-md-5 mb-3'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<img src={arrowBack} alt='' loading='lazy' />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>
									<li className='breadcrumb-item active' aria-current='page'>
										الأكاديمية
									</li>
								</ol>
							</nav>
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
											placeholder='ابحث عن دورة معينة'
										/>
									</div>
								) : (
									<div className='pages-search-bx'>
										<BiSearch className='search-icon' />
										<input
											value={searchExplain}
											onChange={(e) => setSearchExplain(e.target.value)}
											type='text'
											name='search'
											id='search'
											placeholder='ابحث عن شرح معينة'
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className='row mb-md-5 mb-3'>
					<div className='btns-group-container d-flex justify-content-md-start justify-content-center align-items-center'>
						<button
							onClick={() => togglePagesHandle(1)}
							className={togglePage === 1 ? "active" : ""}>
							الدورات التدريبية
						</button>

						<button
							onClick={() => togglePagesHandle(2)}
							className={
								togglePage === 2 ? "me-md-5 me-3 active" : "me-md-5 me-3"
							}>
							شروحات
						</button>
					</div>
				</div>

				<div className='row'>
					<div className='academy-widgets-wrapper'>
						{/** CoursesTraining and Explain Pages */}
						{togglePage === 1 ? (
							<CoursesTraining searchCourses={searchCourses} />
						) : (
							<Explain searchExplain={searchExplain} />
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default Academy;
