import React, { useState, useContext, useEffect } from "react";

// Third Party
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

// Icons
import { BiSearch } from "react-icons/bi";

// Components
import Explain from "./Explains/Explain";
import CoursesTraining from "./Courses/CoursesTraining";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

// Context
import Context from "../../Context/context";

// RTK Query
import { useShowVerificationQuery } from "../../store/apiSlices/verifyStoreApi";

const Academy = () => {
	const navigate = useNavigate();
	// to handle CoursesTraining and Explain in Academy Section
	const academyToggleContext = useContext(Context);
	const { togglePage, setTogglePag } = academyToggleContext;

	// Set function to change between pages
	const togglePagesHandle = (index) => {
		setTogglePag(index);
		setSearchCourses("");
		setSearchExplain("");
	};
	const [searchCourses, setSearchCourses] = useState("");
	const [searchExplain, setSearchExplain] = useState("");

	// to Handle if the user is not verify  her account
	const { data: showVerification } = useShowVerificationQuery();
	useEffect(() => {
		if (showVerification?.verification_status !== "تم التوثيق") {
			navigate("/");
		}
	}, [showVerification?.verification_status, navigate]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الأكاديمية</title>
			</Helmet>
			<section className='academy-page p-lg-3'>
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
								) : (
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
