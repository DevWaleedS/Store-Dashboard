import React from "react";

// icons
import { BsPlayCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { openModal } from "../store/slices/VideoModal-slice";
import CourseVideoModal from "../components/CourseVideoModal";
import useFetch from "../Hooks/UseFetch";
import CircularLoading from "../HelperComponents/CircularLoading";

const Explain = ({ searchExplain }) => {
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

	const dispatch = useDispatch(false);

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
				explainvideos?.map((course) => (
					<div className='col-lg-4 col-6 mb-md-4 mb-3' key={course?.id}>
						<figure className='course-figure'>
							<div className='course-prev-image'>
								<img
									src={course?.thumbnail}
									className='figure-img img-fluid rounded'
									alt={course?.title}
								/>
							</div>

							<div className='play-video-icon'>
								<BsPlayCircle
									onClick={() => {
										dispatch(openModal(course?.video));
									}}
								/>
							</div>
							<figcaption className='figure-caption'>
								{course?.title}{" "}
							</figcaption>
						</figure>
						{/** to play video  */}
						<CourseVideoModal />
					</div>
				))
			)}
		</div>
	);
};

export default Explain;
