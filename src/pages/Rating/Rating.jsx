import React, { useContext, useEffect, useState } from "react";

// Third Party
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// MUI
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// Icons
import { HomeIcon } from "../../data/Icons";

// CONTEXT
import Context from "../../Context/context";

// Components
import RatingWeight from "./RatingWeight";
import { TopBarSearchInput } from "../../global";
import { SendReplayModal } from "../../components/Modal";
import { TablePagination } from "../../components/Tables/TablePagination";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
	ChangeCommentActivationThunk,
	RatingThunk,
} from "../../store/Thunk/RatingThunk";

const switchStyle = {
	"& .MuiSwitch-track": {
		width: 36,
		height: 22,
		opacity: 1,
		backgroundColor: "rgba(0,0,0,.25)",
		boxSizing: "border-box",
		borderRadius: 20,
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		backgroundColor: "#EBEBEB",
		width: 16,
		height: 16,
		borderRadius: 4,
		transform: "translate(6px,7px)",
	},
	"&:hover": {
		"& .MuiSwitch-thumb": {
			boxShadow: "none",
		},
	},

	"& .MuiSwitch-switchBase": {
		"&:hover": {
			boxShadow: "none",
			backgroundColor: "none",
		},
		padding: 1,
		"&.Mui-checked": {
			transform: "translateX(12px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#3AE374",
			},
			"&:hover": {
				boxShadow: "none",
				backgroundColor: "none",
			},
		},
	},
};

const Rating = () => {
	const dispatch = useDispatch();
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	// to get all  data from server
	const { RatingData, currentPage, pageCount, loading, reload } = useSelector(
		(state) => state.RatingSlice
	);

	// -----------------------------------------------------------

	/** get contact data */
	useEffect(() => {
		dispatch(RatingThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);

	// to get current comment status
	const commentActivation = RatingData?.commentActivation;
	const [commentDetails, setCommentDetails] = React.useState(null);

	// ---------------------------------------------------------------------------------------------

	// Delete items
	const changeCommentActivation = (id) => {
		dispatch(ChangeCommentActivationThunk())
			.unwrap()
			.then((data) => {
				if (!data?.success) {
					toast.error(data?.message?.ar, {
						theme: "light",
					});
				} else {
					setEndActionTitle(data?.message?.ar);
				}
				dispatch(RatingThunk({ page: pageTarget, number: rowsCount }));
			})
			.catch((error) => {
				// handle error here
				// toast.error(error, {
				// 	theme: "light",
				// });
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الأسئلة والتقييمات </title>
			</Helmet>
			<section className='rating-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									الأسئلة والتقييمات
								</li>
							</ol>
						</nav>
					</div>
				</div>
				<div className='row d-flex align-items-center title-page-row mb-md-5 mb-3'>
					<div className='col-md-5'>
						<h4 className='page-tile'>الأسئلة والتقييمات</h4>
					</div>
					<div className='col-md-6 col-12'>
						<div className='row rating-filter-box d-flex justify-content-md-end justify-content-between  align-items-center '>
							<div className='col-5 d-flex justify-content-md-end justify-content-start'>
								<div className='check-box'>
									{!RatingData?.comment_of_products?.length === 0 && (
										<FormControlLabel
											sx={{
												marginRight: 0,
												"& .MuiFormControlLabel-label ": {
													alignSelf: "end",
													fontSize: "20px",
													letterSpacing: "0.2px",
													color: " #011723",
													"@media(max-width:768px)": {
														fontSize: "16px",
														marginRight: "10px",
													},
												},
											}}
											control={
												<Switch
													onChange={() => changeCommentActivation()}
													checked={
														commentActivation === "active" ? true : false
													}
													sx={switchStyle}
												/>
											}
											label='تفعيل التقييمات'
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='rating-wrapper'>
					<div className='rating-bx mb-md-5 mb-3'>
						<RatingWeight
							setCommentDetails={setCommentDetails}
							RatingData={RatingData}
							loading={loading}
							reload={reload}
							pageTarget={pageTarget}
							rowsCount={rowsCount}
						/>
					</div>

					{/** Pagination */}
					{RatingData?.comment_of_products?.length !== 0 && !loading && (
						<TablePagination
							page={RatingData}
							pageCount={pageCount}
							currentPage={currentPage}
							pageTarget={pageTarget}
							rowsCount={rowsCount}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
						/>
					)}

					{/* send rating replay component */}
					<SendReplayModal
						fetchedData={RatingData}
						loading={loading}
						reload={reload}
						commentDetails={commentDetails}
					/>
				</div>
			</section>
		</>
	);
};

export default Rating;
