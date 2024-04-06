import React, { useContext, useEffect, useState } from "react";

// Third Party
import axios from "axios";
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
import useFetch from "../../Hooks/UseFetch";
import { SendReplayModal } from "../../components/Modal";
import { TopBarSearchInput } from "../../global";
import { useDispatch, useSelector } from "react-redux";
import { RatingThunk } from "../../store/Thunk/RatingThunk";
import { TablePagination } from "../../components/Tables/TablePagination";

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
	const { setEndActionTitle, access_token } = contextStore;

	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	// to get all  data from server
	const { RatingData, currentPage, pageCount } = useSelector(
		(state) => state.RatingSlice
	);
	const { fetchedData, loading, reload, setReload } = useFetch(
		`comment?page=${pageTarget}&number=${rowsCount}`
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
	// change Comment Status
	const changeCommentActivation = (id) => {
		axios
			.get(`commentActivation`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				}
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
							setReload={setReload}
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
						fetchedData={fetchedData}
						loading={loading}
						reload={reload}
						setReload={setReload}
						commentDetails={commentDetails}
					/>
				</div>
			</section>
		</>
	);
};

export default Rating;
