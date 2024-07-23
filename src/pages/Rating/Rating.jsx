import React, { useState } from "react";

// Third Party
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

// MUI
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// Components
import RatingWeight from "./RatingWeight";
import { Breadcrumb } from "../../components";
import { TopBarSearchInput } from "../../global/TopBar";
import { SendReplayModal } from "../../components/Modal";
import { TablePagination } from "../../components/Tables/TablePagination";

// RTK Query
import {
	useGetRatingQuery,
	useChangeCommentActivationMutation,
} from "../../store/apiSlices/ratingApi";

// switch style
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
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	const { data: ratingData, isLoading } = useGetRatingQuery({
		page: pageTarget,
		number: rowsCount,
	});

	// --------------------------------------------------------------------------------------

	// to get current comment status
	const commentActivation = ratingData?.data?.commentActivation;
	const [commentDetails, setCommentDetails] = React.useState(null);

	// ---------------------------------------------------------------------------------------------

	//Change Comment Activation
	const [changeCommentActivation] = useChangeCommentActivationMutation();
	const changeCommentActiveStatus = async () => {
		try {
			await changeCommentActivation()
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					}
				});
		} catch (err) {
			console.error("Failed to delete the changeCommentActivation", err);
		}
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

				<Breadcrumb mb={"mb-md-4"} currentPage={"الأسئلة والتقييمات"} />

				<div className='row d-flex align-items-center title-page-row mb-md-5 mb-3'>
					<div className='col-md-5'>
						<h4 className='page-tile'>الأسئلة والتقييمات</h4>
					</div>
					<div className='col-md-6 col-12'>
						<div className='row rating-filter-box d-flex justify-content-md-end justify-content-between  align-items-center '>
							<div className='col-5 d-flex justify-content-md-end justify-content-start'>
								<div className='check-box'>
									{ratingData?.data?.comment_of_products?.length !== 0 && (
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
													onChange={() => changeCommentActiveStatus()}
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
				{ratingData?.data?.comment_of_products?.length === 0 ? (
					<div className='rating-wrapper'>
						<h4
							style={{ height: "70vh" }}
							className='d-flex justify-content-center align-items-center'>
							لا يوجد تقييمات حتى هذه اللحظة!
						</h4>
					</div>
				) : (
					<div className='rating-wrapper'>
						<div className='rating-bx mb-md-5 mb-3'>
							<RatingWeight
								setCommentDetails={setCommentDetails}
								RatingData={ratingData?.data?.comment_of_products}
								loading={isLoading}
								pageTarget={pageTarget}
								rowsCount={rowsCount}
							/>
						</div>

						{/** Pagination */}
						{ratingData?.data?.comment_of_products?.length !== 0 &&
							!isLoading && (
								<TablePagination
									page={ratingData?.data?.comment_of_products}
									pageCount={ratingData?.data?.page_count}
									currentPage={ratingData?.data?.current_page}
									pageTarget={pageTarget}
									rowsCount={rowsCount}
									setRowsCount={setRowsCount}
									setPageTarget={setPageTarget}
								/>
							)}
						{console.log(ratingData?.data?.comment_of_products)}
						{/* send rating replay component */}
						<SendReplayModal
							fetchedData={ratingData?.data?.comment_of_products || []}
							loading={isLoading}
							commentDetails={commentDetails}
						/>
					</div>
				)}
			</section>
		</>
	);
};

export default Rating;
