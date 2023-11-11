import React, { useState, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import useFetch from "../../Hooks/UseFetch";
import { Link, useParams, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { openModal } from "../../store/slices/VideoModal-slice";

// ICONS
import { BiPlayCircle } from "react-icons/bi";
import arrowBack from "../../data/Icons/icon-30-arrwos back.svg";
import { ReactComponent as PDFIcon } from "../../data/Icons/pfd.svg";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { ReactComponent as ArrowDown } from "../../data/Icons/icon-24-chevron_down.svg";

// Components
import { CourseVideoModal } from "../../components/Modal";

const CourseDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// to open video modal
	const dispatch = useDispatch(false);

	// to get all  data from server
	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.com/api/Store/course/${id}`
	);

	//
	const [courseDetails, setCourseDetails] = useState();
	useEffect(() => {
		if (fetchedData) {
			setCourseDetails(fetchedData?.data?.course);
		}
	}, [fetchedData]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | محتوى الكورس</title>
			</Helmet>
			<section className='course-details-page academy-page p-md-3'>
				<div className='head-category mb-md-5 mb-3 pt-md-4'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<Link to='/' className='me-2'>
											<img src={arrowBack} alt='' loading='lazy' />
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
										محتوى الكورس
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				{/* Course image */}
				<div className='row mb-md-5 mb-3'>
					<div className='col-12'>
						<div className='course-image'>
							<img
								className='img-fluid'
								src={courseDetails?.image}
								alt={courseDetails?.name}
							/>
						</div>
					</div>
				</div>

				{/* Course details info */}
				<div className='row mb-5'>
					{loading ? (
						<div
							className='d-flex justify-content-center align-items-center'
							style={{ height: "200px" }}>
							<CircularLoading />
						</div>
					) : (
						<div className='course-actions'>
							<div className='course-name mb-4'>
								<h4>{courseDetails?.name} </h4>
							</div>

							{courseDetails?.unit?.map((unit) => (
								<div className='col-12' key={unit?.id}>
									<div
										className='accordion-item course-unites d-flex justify-content-between order-action-box accordion-box '
										id={`unit${unit?.id}`}>
										<div className='accordion-item w-100'>
											<button
												className='accordion-button  text-end '
												type='button'
												data-bs-toggle='collapse'
												data-bs-target={`#collapse${unit?.id}`}
												aria-expanded='true'
												aria-controls={`collapse${unit?.id}`}>
												<div className='action-title w-100'>
													<span className='unite-name'> {unit?.title}</span>
													<span className='course-count'>
														({unit?.unitvideo})
													</span>
													<span className='course-time'>
														({unit.durationUnit} دقيقة)
													</span>
												</div>
												<div className='action-icon'>
													<ArrowDown />
												</div>
											</button>

											<div
												id={`collapse${unit?.id}`}
												className='accordion-collapse collapse '
												aria-labelledby='headingOne'
												data-bs-parent={`#unit${unit?.id}`}>
												<div className='accordion-body'>
													<ul className='select-status p-0'>
														{unit?.videos?.length !== 0 &&
															unit?.videos?.map((video) => (
																<li
																	className='d-flex justify-content-between align-items-center'
																	key={video?.id}>
																	<div className='unit-name text-overflow'>
																		<BiPlayCircle
																			style={{ cursor: "pointer" }}
																			onClick={() => {
																				dispatch(openModal(video));
																			}}
																		/>
																		<span className='me-2'> {video?.name}</span>
																		<CourseVideoModal />
																	</div>
																	<div className='unit-time'>
																		<span>{video?.duration}</span>
																	</div>
																</li>
															))}

														{unit?.file?.length !== 0 &&
															unit?.file?.map((file) => (
																<li
																	className='d-flex justify-content-between align-items-center'
																	key={file?.id}>
																	<div className='unit-files text-overflow '>
																		<PDFIcon />
																		<span className='m2-2'> {file} </span>
																	</div>
																	<div className='unit-download'>
																		<a
																			style={{ cursor: "pointer" }}
																			href={file}
																			download={file}
																			target='_blank'
																			rel='noreferrer'>
																			<span>تحميل</span>
																		</a>
																	</div>
																</li>
															))}
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default CourseDetails;
