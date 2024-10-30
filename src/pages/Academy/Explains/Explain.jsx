import React, { useEffect, useState } from "react";

//Third party
import { useNavigate } from "react-router-dom";

// Components
import { CircularLoading } from "../../../HelperComponents";
import { TablePagination } from "../../../components/Tables/TablePagination";

//Icons
import { BsPlayCircle } from "react-icons/bs";

// RTK Query
import {
	useGetAcademyExplainVideosQuery,
	useSearchInAcademyExplainVideosMutation,
} from "../../../store/apiSlices/academyApi";

const Explain = ({ searchExplain }) => {
	const navigate = useNavigate();

	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(9);
	const [explainVideosData, setExplainVideosData] = useState([]);

	const { data: explainVideos, isLoading } = useGetAcademyExplainVideosQuery({
		page: pageTarget,
		number: rowsCount,
	});

	/** get courses data */
	useEffect(() => {
		if (explainVideos?.data?.explainvideos?.length !== 0) {
			setExplainVideosData(explainVideos?.data);
		}
	}, [explainVideos?.data?.explainvideos?.length]);

	// -----------------------------------------------------------

	// handle search in courses
	const [searchInAcademyExplainVideos] =
		useSearchInAcademyExplainVideosMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (searchExplain !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInAcademyExplainVideos({
							query: searchExplain,
						});

						setExplainVideosData(response?.data?.data);
					} catch (error) {
						console.error(
							"Error fetching searchInAcademyExplainVideos:",
							error
						);
					}
				};

				fetchData();
			} else {
				setExplainVideosData(explainVideos?.data);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [searchExplain, pageTarget, rowsCount]);
	// ---------------------------------------------------------------------------------------------

	return (
		<div className='row'>
			{isLoading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : explainVideosData?.explainvideos?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				<div className='explain-boxes'>
					{explainVideosData?.explainvideos?.map((lesson) => (
						<div className='box' key={lesson?.id}>
							<figure className='course-figure'>
								<div className='course-prev-image'>
									<img
										src={lesson?.thumbnail}
										className='img-fluid'
										alt={lesson?.title}
									/>
									<div className='play-video-icon'>
										<BsPlayCircle
											onClick={() => {
												navigate(`ExplainDetails/${lesson?.id}`);
											}}
										/>
									</div>
								</div>
								<figcaption className='figure-caption'>
									{lesson?.title}{" "}
								</figcaption>
							</figure>
							{/** to play video  */}
						</div>
					))}
				</div>
			)}

			{/** Pagination */}
			{explainVideosData?.explainvideos?.length !== 0 && !isLoading && (
				<TablePagination
					page={explainVideosData?.explainvideos}
					pageCount={explainVideosData?.page_count}
					currentPage={explainVideosData?.current_page}
					pageTarget={pageTarget}
					rowsCount={rowsCount}
					setRowsCount={setRowsCount}
					setPageTarget={setPageTarget}
				/>
			)}
		</div>
	);
};

export default Explain;
