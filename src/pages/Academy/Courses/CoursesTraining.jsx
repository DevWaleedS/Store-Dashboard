import React, { Fragment, useEffect, useState } from "react";

// Components
import AcademyWidget from "../AcademyWidget";
import CircularLoading from "../../../HelperComponents/CircularLoading";

// Icons
import { CoursesThunk } from "../../../store/Thunk/AcademyThunk";
import { useDispatch, useSelector } from "react-redux";
import { TablePagination } from "../../../components/Tables/TablePagination";

const CoursesTraining = ({ searchCourses }) => {
	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	const { CoursesData, currentPage, pageCount, loading } = useSelector(
		(state) => state.AcademySlice
	);
	// -----------------------------------------------------------

	/** get contact data */
	useEffect(() => {
		dispatch(CoursesThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget]);

	// -----------------------------------------------------------

	let courses = CoursesData?.courses;

	if (searchCourses !== "") {
		courses = CoursesData?.courses?.filter((item) =>
			item?.name?.toLowerCase()?.includes(searchCourses?.toLowerCase())
		);
	} else {
		courses = CoursesData?.courses;
	}
	console.log(CoursesData);
	// ---------------------------------------------------------------------------------------------

	return (
		<Fragment>
			{loading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : courses?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				courses?.map((course) => (
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
			{courses?.length !== 0 && !loading && (
				<TablePagination
					page={courses}
					pageCount={pageCount}
					currentPage={currentPage}
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
