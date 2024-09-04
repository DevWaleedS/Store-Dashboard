import React from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";

// Icons
import { ArrowBack } from "../../../data/Icons";
import { MdOutlineTitle } from "react-icons/md";

// Components
import CircularLoading from "../../../HelperComponents/CircularLoading";

// RTK Query
import { useGetLiveCourseByIdQuery } from "../../../store/apiSlices/academyApi";

import "./LiveCourse.css";

const LiveCourseDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// to fetch explain Video Details
	const { data: liveCourses, isLoading } = useGetLiveCourseByIdQuery({
		id,
	});

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | محتوى الدورة المباشرة</title>
			</Helmet>
			<section className='live-course-details academy-page p-md-3'>
				<div className='head-category mb-md-5 mb-3 pt-md-4'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<Link to='/' className='me-2'>
											<ArrowBack />
											<span className='me-2'> الرئيسية</span>
										</Link>
									</li>
									<li
										className='breadcrumb-item '
										aria-current='page'
										onClick={() => navigate("/Academy")}
										style={{ cursor: "pointer" }}>
										الأكاديمية
									</li>
									<li className='breadcrumb-item active' aria-current='page'>
										محتوى الدورة المباشرة
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				{isLoading ? (
					<div
						className='d-flex justify-content-center align-items-center'
						style={{ height: "200px" }}>
						<CircularLoading />
					</div>
				) : (
					<section className='live-course-content'>
						<div className=' mb-3'>
							<h4 className='live-course-name me-1 pb-0 mb-0'>
								{liveCourses?.data?.course?.name}{" "}
							</h4>
						</div>

						{/* Course image */}
						<section className='live-course-image mb-4'>
							<img
								className='img-fluid'
								loading='lazy'
								src={liveCourses?.data?.course?.image}
								alt={liveCourses?.data?.course?.name}
							/>
						</section>

						{/* Course details info */}
						<section className='mb-5'>
							<div
								className='live-course-description'
								dangerouslySetInnerHTML={{
									__html: liveCourses?.data?.course?.description,
								}}
							/>
						</section>
					</section>
				)}
			</section>
		</>
	);
};

export default LiveCourseDetails;
