import React, { Fragment, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import Switch from "@mui/material/Switch";
import { openReplyModal } from "../store/slices/ReplyModal-slice";
import { Avatar, Button } from "@mui/material";

// IMPORT ICONS
import { MdOutlineTimer } from "react-icons/md";
import { FcCheckmark } from "react-icons/fc";
import { ReactComponent as StoreIcon } from "../data/Icons/icon-24-store.svg";
import { ReactComponent as StarIcon } from "../data/Icons/icon-20-star.svg";
import { ReactComponent as DeleteIcon } from "../data/Icons/icon-24-delete.svg";
import { ReactComponent as ReplayIcon } from "../data/Icons/icon-24-repley.svg";

import CircularLoading from "../HelperComponents/CircularLoading";
import axios from "axios";
import { useCookies } from "react-cookie";
import Context from "../Context/context";
import { DeleteContext } from "../Context/DeleteProvider";
import { UserAuth } from "../Context/UserAuthorProvider";

// IMPORT IMAGES
const RatingWeight = ({
	setCommentDetails,
	fetchedData,
	loading,
	reload,
	setReload,
}) => {
	const [cookies] = useCookies(["access_token"]);
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
	const dispatch = useDispatch(true);

	// to add rating icon to jsx
	const rateingCount = fetchedData?.data?.comment_of_store?.map(
		(rate) => rate?.rateing
	);
	const rateing = [];
	for (let i = 0; i < rateingCount; i++) {
		rateing.push(<StarIcon key={i} />);
	}

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
					Authorization: `Bearer ${cookies?.access_token}`,
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
						<p className='text-center'>لاتوجد تقييمات</p>
					) : (
						fetchedData?.data?.comment_of_products.map((rate) => (
							<div className='rating-widget mb-md-5 mb-3' key={rate?.id}>
								<div className='row'>
									{/** user info */}
									<div className='col-md-4 col-5'>
										<div className='user-info'>
											<div className='row mb-md-4 mb-3'>
												<div className='user-data d-flex flex-md-row flex-column justify-content-start align-content-center align-items-center'>
													<Avatar
														alt='avatar'
														src={rate?.user?.image}
														sx={{ width: 44, height: 44 }}
													/>
													<span className='user-name me-2 align-self-center'>
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
													<span className='text me-2 align-self-center'>
														{" "}
														{rate?.user?.user_type}
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className='col-md-8 col-7'>
										{/**Rating action */}
										<div className='row h-100 py-md-0 py-2'>
											<div className='col-md-9 col-12 ratin-bx'>
												<div className='row rates-starts d-flex justify-content-start align-items-start'>
													<span className='start mb-2'>{rateing}</span>
													<h6> {rate?.comment_text}</h6>
												</div>
												<div className='row rate-act-btn '>
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
															<DeleteIcon />
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
															<ReplayIcon />
															<span className='user-name me-2 align-self-center'>
																رد{" "}
															</span>
														</Button>
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12 order-md-last order-first mb-md-0 mb-2'>
												<div className='row order-rate-number d-flex justify-content-end align-items-start'>
													<div className='col-12 d-flex justify-content-md-end justify-content-center'>
														<span>طلب رقم</span>
														<span className='me-2'>{rate?.user?.user_id}</span>
													</div>
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
