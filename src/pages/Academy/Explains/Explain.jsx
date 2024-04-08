import React, { useEffect, useState } from "react";

//Third party
import { useNavigate } from "react-router-dom";

// Components
import CircularLoading from "../../../HelperComponents/CircularLoading";

//Icons
import { BsPlayCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
	ExplainVideosThunk,
	explainVideoNameThunk,
} from "../../../store/Thunk/AcademyThunk";
import { TablePagination } from "../../../components/Tables/TablePagination";

const Explain = ({ searchExplain }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(9);

	const { ExplainVideosData, currentPage, pageCount, loading } = useSelector(
		(state) => state.AcademySlice
	);
	// -----------------------------------------------------------

	/** get contact data */
	useEffect(() => {
		dispatch(ExplainVideosThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget]);

	// -----------------------------------------------------------

	// search in Orders
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (searchExplain !== "") {
				dispatch(
					explainVideoNameThunk({
						query: searchExplain,
						page: pageTarget,
						number: rowsCount,
					})
				);
			}
		}, 500);

		return () => {
			clearTimeout(debounce);
		};
	}, [searchExplain, dispatch]);

	// ---------------------------------------------------------------------------------------------

	return (
		<div className='row'>
			{loading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : ExplainVideosData?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				<div className='explain-boxes'>
					{ExplainVideosData?.map((lesson) => (
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
			{ExplainVideosData?.length !== 0 && !loading && (
				<TablePagination
					page={ExplainVideosData}
					pageCount={pageCount}
					currentPage={currentPage}
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
