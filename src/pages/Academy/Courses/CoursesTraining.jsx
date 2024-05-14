import React, { Fragment, useEffect, useState } from "react";

// Components
import AcademyWidget from "../AcademyWidget";
import CircularLoading from "../../../HelperComponents/CircularLoading";
import { TablePagination } from "../../../components/Tables/TablePagination";

// RTK Query
import {
	useGetAcademyCoursesQuery,
	useSearchInAcademyCoursesMutation,
} from "../../../store/apiSlices/academyApi";

const CoursesTraining = ({ searchCourses }) => {
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [courseData, setCoursesData] = useState([]);
	const { data: courses, isLoading } = useGetAcademyCoursesQuery({
		page: pageTarget,
		number: rowsCount,
	});

	/** get courses data */
	useEffect(() => {
		if (courses?.data?.courses?.length !== 0) {
			setCoursesData(courses?.data);
		}
	}, [courses?.data?.courses?.length]);

	// -----------------------------------------------------------

	// handle search in courses
	const [searchInAcademyCourses] = useSearchInAcademyCoursesMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (searchCourses !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInAcademyCourses({
							query: searchCourses,
						});

						setCoursesData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching searchInAcademyCourses:", error);
					}
				};

				fetchData();
			} else {
				setCoursesData(courses?.data);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [searchCourses, pageTarget, rowsCount]);
	// ---------------------------------------------------------------------------------------------

	return (
		<Fragment>
			{isLoading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : courseData?.courses?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				courseData?.courses?.map((course) => (
					<div className='widget-bx mb-md-4 mb-3' key={course?.id}>
						<AcademyWidget
							id={course?.id}
							url={course?.url}
							name={course?.name}
							image={course?.image}
							count={course?.count}
							duration={course?.durationCourse}
						/>
					</div>
				))
			)}

			{/** Pagination */}
			{courseData?.courses?.length !== 0 && !isLoading && (
				<TablePagination
					page={courseData?.courses}
					pageCount={courseData?.page_count}
					currentPage={courseData?.current_page}
					pageTarget={pageTarget}
					rowsCount={rowsCount}
					setRowsCount={setRowsCount}
					setPageTarget={setPageTarget}
				/>
			)}
		</Fragment>
	);
};

export default CoursesTraining;
