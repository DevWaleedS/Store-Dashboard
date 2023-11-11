import React from "react";

//Third party
import { useNavigate } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch";

// Components
import CircularLoading from "../../HelperComponents/CircularLoading";

// icons
import { BsPlayCircle } from "react-icons/bs";

const Explain = ({ searchExplain }) => {
	const navigate = useNavigate();
	// to get all  data from server
	const { fetchedData, loading } = useFetch(
		"https://backend.atlbha.com/api/Store/explainVideos"
	);
	let explainvideos = fetchedData?.data?.explainvideos;

	if (searchExplain !== "") {
		explainvideos = fetchedData?.data?.explainvideos?.filter((item) =>
			item?.title?.includes(searchExplain)
		);
	} else {
		explainvideos = fetchedData?.data?.explainvideos;
	}

	return (
		<div className='row'>
			{loading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : explainvideos?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				explainvideos?.map((lesson) => (
					<div
						className='col-lg-4 col-md-6 col-xm-12  mb-md-4 mb-3'
						key={lesson?.id}>
						<figure className='course-figure'>
							<div className='course-prev-image'>
								<img
									src={lesson?.thumbnail}
									className=' img-fluid rounded'
									alt={lesson?.title}
								/>
							</div>

							<div className='play-video-icon'>
								<BsPlayCircle
									onClick={() => {
										navigate(`ExplainDetails/${lesson?.id}`);
									}}
								/>
							</div>
							<figcaption className='figure-caption'>
								{lesson?.title}{" "}
							</figcaption>
						</figure>
						{/** to play video  */}
					</div>
				))
			)}
		</div>
	);
};

export default Explain;
