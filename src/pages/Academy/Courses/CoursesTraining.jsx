import React, { Fragment, useEffect, useState } from "react";

// Components
import AcademyWidget from "../AcademyWidget";
import CircularLoading from "../../../HelperComponents/CircularLoading";

// Icons
import {
	CoursesThunk,
	searchCourseNameThunk,
} from "../../../store/Thunk/AcademyThunk";
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

	// search
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (searchCourses !== "") {
				dispatch(
					searchCourseNameThunk({
						query: searchCourses,
						page: pageTarget,
						number: rowsCount,
					})
				);
			}
		}, 500);

		return () => {
			clearTimeout(debounce);
		};
	}, [searchCourses, dispatch]);
	// ---------------------------------------------------------------------------------------------

	return (
		<Fragment>
			{loading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : CoursesData?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				CoursesData?.map((course) => (
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
			{CoursesData?.length !== 0 && !loading && (
				<TablePagination
					page={CoursesData}
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
