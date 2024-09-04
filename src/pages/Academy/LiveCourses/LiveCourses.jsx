import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import CircularLoading from "../../../HelperComponents/CircularLoading";
import { TablePagination } from "../../../components/Tables/TablePagination";

// RTK Query
import {
	useGetLiveCoursesQuery,
	useSearchInLiveCoursesMutation,
} from "../../../store/apiSlices/academyApi";

// Icons
import { FaEye } from "react-icons/fa";

function LiveCourses({ searchLiveCourses }) {
	const navigate = useNavigate();

	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(9);
	const [liveCoursesData, setLiveCoursesData] = useState([]);

	const { data: liveCourses, isLoading } = useGetLiveCoursesQuery({
		page: pageTarget,
		number: rowsCount,
	});

	/** get courses data */
	useEffect(() => {
		if (liveCourses?.data?.courses?.length !== 0) {
			setLiveCoursesData(liveCourses?.data);
		}
	}, [liveCourses?.data?.courses?.length]);

	// -----------------------------------------------------------

	// handle search in courses
	const [searchInLiveCourses] = useSearchInLiveCoursesMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (searchLiveCourses !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInLiveCourses({
							query: searchLiveCourses,
						});

						setLiveCoursesData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching search in live Courses:", error);
					}
				};

				fetchData();
			} else {
				setLiveCoursesData(liveCourses?.data);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [searchLiveCourses, pageTarget, rowsCount]);

	// ---------------------------------------------------------------------------------------------

	return (
		<div className='row'>
			{isLoading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : liveCoursesData?.courses?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				<div className='explain-boxes live-courses-boxes mb-md-0 mb-5'>
					{liveCoursesData?.courses?.map((course) => (
						<div className='box ' key={course?.id}>
							<figure className='course-figure'>
								<div className='course-prev-image'>
									<img
										src={course?.image}
										className='img-fluid'
										alt={course?.name}
									/>
									<div className='play-video-icon '>
										<FaEye
											onClick={() => {
												navigate(`live-course-details/${course?.id}`);
											}}
										/>
									</div>
								</div>
								<figcaption className='figure-caption'>
									{course?.name}
								</figcaption>
							</figure>
						</div>
					))}
				</div>
			)}

			{/** Pagination */}
			{liveCoursesData?.courses?.length !== 0 && !isLoading && (
				<TablePagination
					page={liveCoursesData?.courses}
					pageCount={liveCoursesData?.page_count}
					currentPage={liveCoursesData?.current_page}
					pageTarget={pageTarget}
					rowsCount={rowsCount}
					setRowsCount={setRowsCount}
					setPageTarget={setPageTarget}
				/>
			)}
		</div>
	);
}

export default LiveCourses;
