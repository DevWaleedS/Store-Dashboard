import React, { Fragment, useEffect, useContext } from "react";

// Redux
import { useDispatch } from "react-redux";
import { openReplyModal } from "../../store/slices/ReplyModal-slice";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";

// Third party
import axios from "axios";

// MUI
import Switch from "@mui/material/Switch";
import { Avatar, Button } from "@mui/material";

// Icons
import { BiHide } from "react-icons/bi";
import { FcCheckmark } from "react-icons/fc";
import { MdOutlineTimer } from "react-icons/md";
import {
	DeleteIcon,
	HalfStarIcon,
	ReplayIcon,
	StarIcon,
	StoreIcon,
} from "../../data/Icons";

// Components
import CircularLoading from "../../HelperComponents/CircularLoading";

// IMPORT IMAGES
const RatingWeight = ({
	setCommentDetails,
	fetchedData,
	loading,
	reload,
	setReload,
	page,
	rowsPerPage,
}) => {
	const dispatch = useDispatch(true);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const DeleteStore = useContext(DeleteContext);
	const {
		setUrl,
		setActionDelete,
		deleteReload,
		setDeleteReload,
		setDeleteMethod,
	} = DeleteStore;

	// to add rating icon to jsx
	const MAX_RATING = 5;
	const renderStars = (rating) => {
		const fullStars = Math?.floor(rating);

		const hasHalfStar = rating - fullStars >= 0.5;
		const stars = [];

		for (let i = 1; i <= MAX_RATING; i++) {
			if (i <= fullStars) {
				stars.push(<StarIcon key={i} />);
			} else if (hasHalfStar && i === fullStars + 1) {
				stars.push(<HalfStarIcon key={i} />);
			} else {
				stars.push(<StarIcon key={i} style={{ opacity: 0.2 }} />);
			}
		}

		return stars;
	};
	// --------------------------------

	// Delete single item
	useEffect(() => {
		if (deleteReload === true) {
			setReload(!reload);
		}
		setDeleteReload(false);
	}, [deleteReload]);

	// change Comment Status
	const changeCommentStatus = (id) => {
		axios
			.get(`https://backend.atlbha.com/api/Store/changeCommentStatus/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("store_token")}`,
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
		<Fragment>
			{loading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : (
				<>
					{fetchedData?.data?.comment_of_products?.length === 0 ? (
						<p className='text-center'>لايوجد تقييمات</p>
					) : (
						fetchedData?.data?.comment_of_products
							?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							?.map((rate) => (
								<div className='rating-widget mb-md-5 mb-3' key={rate?.id}>
									<div className='row'>
										{/** user info */}
										<div className='col-md-3 col-5'>
											<div className='user-info'>
												<div className='row mb-md-4 mb-3'>
													<div className='user-data d-flex flex-md-row flex-column justify-content-start align-content-center align-items-center'>
														<Avatar
															alt='avatar'
															src={rate?.user?.image}
															sx={{
																width: 44,
																height: 44,
																border: "2px solid #ddd",
															}}
														/>
														<span className='user-name me-2 align-self-center text-overflow'>
															{" "}
															{rate?.user?.name}
														</span>
													</div>
												</div>
												<div className='row mb-2  date-of-rating'>
													<div className='user-data  d-flex justify-content-center align-content-center '>
														<MdOutlineTimer />
														<span className='text me-2 align-self-center'>
															{" "}
															{rate?.created_at}
														</span>
													</div>
												</div>
												<div className='row date-of-rating'>
													<div className='user-data  d-flex justify-content-center align-content-center '>
														<StoreIcon className='store' />
														<span className='text me-2 align-self-center text-overflow'>
															{" "}
															{rate?.user?.user_type}
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='col-md-9 col-7'>
											{/**Rating action */}
											<div className='row h-100 py-md-0 py-2'>
												<div className='col-md-9 col-12 ratin-bx'>
													<div className='row rates-starts d-flex justify-content-start align-items-start'>
														<h6 className='text-overflow mt-0 mt-md-2 mb-2 mb-md-0'>
															{rate?.comment_text}
														</h6>
														<span className='start mb-2 mb-md-0'>
															{renderStars(rate?.rateing)}
														</span>
													</div>

													<div className='col-12 product-name d-flex align-items-center ps-4 ps-md-0'>
														<span className='product-name-title'>
															اسم المنتج:
														</span>
														<span className='me-2 text-overflow'>
															{rate?.product?.name}
														</span>
													</div>
													<div className='row rate-act-btn mb-2'>
														<div className=' col-3 col-md-4'>
															{rate?.status === "نشط" ? (
																<Button
																	variant='outlined'
																	className='publish-btn'>
																	<FcCheckmark />
																	<span className='user-name me-2 align-self-center'>
																		منشور
																	</span>
																</Button>
															) : (
																<Button
																	variant='outlined'
																	className='publish-btn'
																	style={{ border: "1px solid #99a2a7" }}>
																	<BiHide
																		style={{
																			color: "#99a2a7",
																			strokeWidth: "1",
																		}}
																	/>
																	<span
																		style={{ color: "#99a2a7" }}
																		className='user-name me-2 align-self-center'>
																		معطل
																	</span>
																</Button>
															)}
														</div>
														<div className=' col-3'>
															<Button
																variant='outlined'
																className='delete-btn '
																onClick={() => {
																	setActionDelete(
																		"سيتم حذف التعليق وهذة الخطوة غير قابلة للرجوع"
																	);
																	setDeleteMethod("delete");
																	setUrl(
																		`https://backend.atlbha.com/api/Store/comment/${rate?.id}`
																	);
																}}>
																<DeleteIcon title='حذف التعليق' />
																<span className='user-name me-2 align-self-center'>
																	حذف{" "}
																</span>
															</Button>
														</div>
														<div className=' col-3 margin-right-lg'>
															<Button
																variant='outlined'
																className='replay-btn'
																onClick={() => {
																	dispatch(openReplyModal());
																	setCommentDetails(rate);
																}}>
																<ReplayIcon title='ارسال رد علي التعليق' />
																<span className='user-name me-2 align-self-center'>
																	رد{" "}
																</span>
															</Button>
														</div>
													</div>
												</div>

												<div className='col-md-3 col-12 order-md-last order-first mb-md-0 mb-2'>
													<div className='row order-rate-number d-flex justify-content-end align-items-start'>
														<div className='d-flex ps-md-0 ps-4 justify-content-end p-0'>
															<Switch
																onChange={() => changeCommentStatus(rate?.id)}
																checked={rate?.status === "نشط" ? true : false}
																sx={{
																	width: "50px",
																	"& .MuiSwitch-track": {
																		width: 26,
																		height: 14,
																		opacity: 1,
																		backgroundColor: "rgba(0,0,0,.25)",
																		boxSizing: "border-box",
																	},
																	"& .MuiSwitch-thumb": {
																		boxShadow: "none",
																		width: 10,
																		height: 10,
																		borderRadius: 5,
																		transform: "translate(6px,6px)",
																		color: "#fff",
																	},

																	"&:hover": {
																		"& .MuiSwitch-thumb": {
																			boxShadow: "none",
																		},
																	},

																	"& .MuiSwitch-switchBase": {
																		padding: 1,
																		"&.Mui-checked": {
																			transform: "translateX(11px)",
																			color: "#fff",
																			"& + .MuiSwitch-track": {
																				opacity: 1,
																				backgroundColor: "#3AE374",
																			},
																		},
																	},
																}}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
					)}
				</>
			)}
		</Fragment>
	);
};

export default RatingWeight;
