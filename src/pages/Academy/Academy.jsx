import React, { useState, useContext } from "react";

// Third Party
import { Helmet } from "react-helmet";

// Components
import PageActions from "./PageActions";
import Explain from "./Explains/Explain";
import AcademyToggle from "./AcademyToggle";
import LiveCourses from "./LiveCourses/LiveCourses";
import CoursesTraining from "./Courses/CoursesTraining";

// Context
import Context from "../../Context/context";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";

/**
 * The main Academy component that renders the Academy page.
 * It handles the toggling between the Courses/Training and Explain pages,
 * as well as the search functionality for each page.
 * It also checks if the user's account is verified before rendering the page.
 */
const Academy = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();
	// to handle CoursesTraining and Explain in Academy Section
	const academyToggleContext = useContext(Context);
	const { togglePage, setTogglePag } = academyToggleContext;

	const [searchCourses, setSearchCourses] = useState("");
	const [searchExplain, setSearchExplain] = useState("");
	const [searchLiveCourses, setSearchLiveCourses] = useState("");

	// Set function to change between pages
	const togglePagesHandle = (index) => {
		setTogglePag(index);
		setSearchCourses("");
		setSearchExplain("");
		setSearchLiveCourses("");
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الأكاديمية</title>
			</Helmet>
			<section className='academy-page p-lg-3'>
				<PageActions
					togglePage={togglePage}
					searchExplain={searchExplain}
					searchCourses={searchCourses}
					setSearchExplain={setSearchExplain}
					setSearchCourses={setSearchCourses}
					searchLiveCourses={searchLiveCourses}
					setSearchLiveCourses={setSearchLiveCourses}
				/>

				<AcademyToggle
					togglePage={togglePage}
					togglePagesHandle={togglePagesHandle}
				/>

				<div className='row'>
					<div className='academy-widgets-wrapper'>
						{/** CoursesTraining and Explain Pages */}
						{togglePage === 1 ? (
							<CoursesTraining searchCourses={searchCourses} />
						) : togglePage === 2 ? (
							<LiveCourses searchLiveCourses={searchLiveCourses} />
						) : togglePage === 3 ? (
							<Explain searchExplain={searchExplain} />
						) : null}
					</div>
				</div>
			</section>
		</>
	);
};

export default Academy;
