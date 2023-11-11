import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch";

// MUI
import { useDispatch } from "react-redux";
// import { openModal } from "../../store/slices/VideoModal-slice";
// import CourseVideoModal from "../../components/CourseVideoModal";
// ICONS
import arrowBack from "../../data/Icons/icon-30-arrwos back.svg";
import CircularLoading from "../../HelperComponents/CircularLoading";
// import { ReactComponent as ArrowDown } from "../../data/Icons/icon-24-chevron_down.svg";
// import { ReactComponent as PDFIcon } from "../../data/Icons/pfd.svg";
// import { BiPlayCircle } from "react-icons/bi";

const ExplainDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// to open video modal
	// const dispatch = useDispatch(false);

	// to get all  data from server
	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.com/api/Store/explainVideos/${id} `
	);

	//to store all details on state
	const [explainDetails, setExplainDetails] = useState();
	useEffect(() => {
		if (fetchedData) {
			setExplainDetails(fetchedData?.data?.explainvideos);
		}
	}, [fetchedData]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | محتوى الكورس</title>
			</Helmet>
			<section className='course-details-page explain-details-page academy-page p-md-3'>
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
										محتوى الدرس
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				<div className='row mb-5'>
					{loading ? (
						<div
							className='d-flex justify-content-center align-items-center'
							style={{ height: "200px" }}>
							<CircularLoading />
						</div>
					) : (
						<div className='course-actions'>
							<div className='course-name explain-title mb-4'>
								<h4>{explainDetails?.title}</h4>
							</div>

							<div className='col-12 mb-4 d-flex justify-content-center align-items-center'>
								<div className='explain-video'>
									<video
										controls
										poster={explainDetails?.thumbnail}
										src={explainDetails?.video}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default ExplainDetails;
