import React, { useState, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";

// Components
import useFetch from "../../../Hooks/UseFetch";
import CircularLoading from "../../../HelperComponents/CircularLoading";
import { ArrowBack } from "../../../data/Icons";

// Icons

const ExplainDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// to get all  data from server
	const { fetchedData, loading } = useFetch(
		`https://backend.atlbha.com/api/Store/explainVideos/${id} `
	);

	// This code to handle get the src from youtube iframe src
	const [videoUrl, setVideoUrl] = useState(null);
	useEffect(() => {
		const parser = new DOMParser();
		const doc = parser?.parseFromString(
			fetchedData?.data?.explainvideos?.video,
			"text/html"
		);
		const iframeSrc = doc?.querySelector("iframe")?.getAttribute("src");
		setVideoUrl(iframeSrc);
	}, [fetchedData?.data?.explainvideos?.video]);

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
								<h4>{fetchedData?.data?.explainvideos?.title}</h4>
							</div>

							<section className='explain-video'>
								<iframe
									width='100%'
									height='100%'
									src={videoUrl}
									allowFullScreen
									title={fetchedData?.data?.explainvideos?.title}
								/>
							</section>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default ExplainDetails;
