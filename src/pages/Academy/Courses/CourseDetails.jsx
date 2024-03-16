import React from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { openModal } from "../../../store/slices/VideoModal-slice";

// Icons
import { BiPlayCircle } from "react-icons/bi";
import { ArrowBack, ArrowDown, PDFIcon } from "../../../data/Icons";

// Components
import useFetch from "../../../Hooks/UseFetch";
import { CourseVideoModal } from "../../../components/Modal";
import CircularLoading from "../../../HelperComponents/CircularLoading";
import VideoOfCourseDuration from "../VideoOfCourseDuration/VideoOfCourseDuration";

const CourseDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// to open video modal
	const dispatch = useDispatch(false);

	// to get all  data from server
	const { fetchedData, loading } = useFetch(`course/${id}`);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | محتوى الكورس</title>
			</Helmet>
			<section className='course-details-page academy-page p-md-3'>
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
										محتوى الكورس
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				{loading ? (
					<div
						className='d-flex justify-content-center align-items-center'
						style={{ height: "200px" }}>
						<CircularLoading />
					</div>
				) : (
					<>
						{/* Course image */}
						<section className='course-image mb-5'>
							<img
								src={fetchedData?.data?.course?.image}
								className='img-fluid'
								loading='lazy'
								alt={""}
							/>
						</section>
						{/* Course details info */}
						<section className='row mb-5'>
							<div className='course-actions'>
								<div className='course-name mb-1'>
									<h4>{fetchedData?.data?.course?.name} </h4>
								</div>

								{fetchedData?.data?.course?.unit?.map((unit) => (
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
													<div className='action-title w-100 d-flex flex-wrap'>
														<span className='unite-name'>
															{" "}
															{unit?.title} :{" "}
														</span>
														<span className='course-count'>
															(
															{unit?.unitvideo === 0 ||
															unit?.unitvideo === "null"
																? `لا يوجد دروس`
																: unit?.unitvideo === 1
																? `درس واحد`
																: unit?.unitvideo === 2
																? `درسين`
																: `${unit?.unitvideo} درس`}
															)
														</span>
														<span className='course-time'>
															(
															<VideoOfCourseDuration
																duration={unit.durationUnit}
															/>
															)
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
																unit?.videos?.map((video, idx) => (
																	<li
																		className='d-flex justify-content-between align-items-center'
																		key={idx}>
																		<div
																			onClick={() => {
																				dispatch(openModal(video));
																			}}
																			className='unit-name text-overflow'>
																			<BiPlayCircle
																				style={{ cursor: "pointer" }}
																			/>
																			<span
																				className='me-2 video-name'
																				style={{ cursor: "pointer" }}>
																				{video?.name}
																			</span>
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
						</section>
					</>
				)}
			</section>

			{/*This is video modal */}
			<CourseVideoModal />
		</>
	);
};

export default CourseDetails;
