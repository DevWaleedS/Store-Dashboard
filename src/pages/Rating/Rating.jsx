import React, { useContext, useState } from "react";

// Third Party
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// MUI
import Switch from "@mui/material/Switch";
import { Menu, MenuItem } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

// Icons
import { HomeIcon } from "../../data/Icons";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
	MdOutlineArrowBackIosNew,
	MdOutlineArrowForwardIos,
} from "react-icons/md";

// CONTEXT
import Context from "../../Context/context";

// Components
import RatingWeight from "./RatingWeight";
import useFetch from "../../Hooks/UseFetch";
import { SendReplayModal } from "../../components/Modal";

const Rating = () => {
	const contextStore = useContext(Context);
	const { setEndActionTitle, access_token } = contextStore;
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/comment`
	);
	// to get current comment status
	const commentActivation = fetchedData?.data?.commentActivation;
	const [commentDetails, setCommentDetails] = React.useState(null);

	/**
	 * -------------------------------------------------------------
	 * TO CREATE PAGINATION
	 * -------------------------------------------------------------
	 */

	const [page, setPage] = useState(0);
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const allRows = () => {
		const num = Math.ceil(
			fetchedData?.data?.comment_of_products?.length / rowsPerPage
		);
		const arr = [];
		for (let index = 0; index < num; index++) {
			arr.push(index + 1);
		}
		return arr;
	};
	// ---------------------------------------------------------------------------------------------

	// change Comment Status
	const changeCommentActivation = (id) => {
		axios
			.get(`https://backend.atlbha.com/api/Store/commentActivation`, {
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
				<title>لوحة تحكم أطلبها | الأسئلة والتقييمات </title>
			</Helmet>
			<section className='rating-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
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
									{!fetchedData?.data?.comment_of_products?.length === 0 && (
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
													sx={{
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
													}}
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
							fetchedData={fetchedData}
							loading={loading}
							reload={reload}
							setReload={setReload}
							page={page}
							rowsPerPage={rowsPerPage}
						/>
					</div>

					{/** Pagination */}
					{fetchedData?.data?.comment_of_products?.length !== 0 && !loading && (
						<div className='pagination-box d-flex flex-md-row flex-column justify-content-center align-items-center'>
							<div
								className='d-flex align-items-center justify-content-center  my-3 m-md-auto'
								style={{ gap: "1rem" }}>
								<MdOutlineArrowForwardIos
									style={{
										visibility: page + 1 === allRows()?.length && "hidden",
										cursor: "pointer",
									}}
									onClick={() => {
										setPage(page + 1);
									}}
								/>
								<div className='d-flex flex-row-reverse gap-2'>
									{allRows().map((item, itemIdx) => {
										if (
											(itemIdx < 1 ||
												(itemIdx >= page - 1 && itemIdx <= page + 1)) &&
											(Math.ceil(
												fetchedData?.data?.comment_of_products?.length
											) <= 3 ||
												(Math.ceil(
													fetchedData?.data?.comment_of_products?.length
												) > 3 &&
													itemIdx < allRows()?.length - 1))
										) {
											return (
												<div
													key={itemIdx}
													className='d-flex justify-content-center align-items-center'
													style={{
														width: "1.7rem",
														height: "1.9rem",
														cursor: "pointer",
														fontWight: "500",
														lineHeight: "1.7rem",
														borderRadius: "10px",
														backgroundColor: item === page + 1 && "#508FF4",
														color: item === page + 1 && "#fff",
													}}
													onClick={() => {
														setPage(itemIdx);
													}}>
													{item}
												</div>
											);
										}
										return null;
									})}
									{Math.ceil(
										fetchedData?.data?.comment_of_products?.length / rowsPerPage
									) > 3 && <div>...</div>}
									{Math.ceil(
										fetchedData?.data?.comment_of_products?.length / rowsPerPage
									) > 1 && (
										<div
											className='d-flex justify-content-center align-items-center'
											style={{
												width: "1.7rem",
												height: "1.9rem",
												cursor: "pointer",
												fontWight: "500",
												lineHeight: "1.7rem",
												borderRadius: "10px",
												backgroundColor:
													Math.ceil(
														fetchedData?.data?.comment_of_products?.length /
															rowsPerPage
													) ===
														page + 1 && "#508FF4",
												color:
													Math.ceil(
														fetchedData?.data?.comment_of_products?.length /
															rowsPerPage
													) ===
														page + 1 && "#fff",
											}}
											onClick={() => {
												setPage(
													Math.ceil(
														fetchedData?.data?.comment_of_products?.length /
															rowsPerPage
													) - 1
												);
											}}>
											{Math.ceil(
												fetchedData?.data?.comment_of_products?.length /
													rowsPerPage
											)}
										</div>
									)}
								</div>
								<MdOutlineArrowBackIosNew
									style={{
										visibility: page === 0 && "hidden",
										cursor: "pointer",
									}}
									onClick={() => {
										setPage(page - 1);
									}}
								/>
							</div>

							<div
								className='d-flex align-items-center gap-2  px-3 py-1'
								style={{
									border: "1px solid #2D62ED",
									borderRadius: "0.375rem",
								}}>
								<Menu
									id='basic-menu'
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}>
									{rowsPerPagesCount.map((rowsPer, rowsIdx) => {
										return (
											<MenuItem
												value={rowsPer}
												onClick={(e) => {
													handleChangeRowsPerPage(e);
													handleClose();
												}}
												key={rowsIdx}
												sx={{
													width: "2.8rem",
													pr: "9px",
													pl: "9px",
													backgroundColor: "#FFFFF",
													"ul:has(&)": {
														p: 0,
													},
													"ul:has(&) li:hover": {
														backgroundColor: "#C6E1F0",
													},
												}}>
												{rowsPer}
											</MenuItem>
										);
									})}
								</Menu>
								<h2
									style={{
										color: "#0077FF",
										fontSize: "20px",
										fontWeight: "500",
									}}>
									عدد الصفوف
								</h2>

								<div
									id='basic-button'
									aria-controls={open ? "basic-menu" : undefined}
									aria-haspopup='true'
									aria-expanded={open ? "true" : undefined}
									onClick={handleRowsClick}
									className='d-flex justify-content-center align-items-center '
									style={{
										backgroundColor: " #c6e1f0",
										cursor: "pointer",
										borderRadius: "0.125rem",
										width: "2.8rem",
										height: "2.8rem",
									}}>
									<MdOutlineKeyboardArrowDown
										color='#0099FB'
										fontSize={"1.5rem"}></MdOutlineKeyboardArrowDown>
								</div>
							</div>
						</div>
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
