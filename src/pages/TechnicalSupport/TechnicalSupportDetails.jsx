import React from "react";

// Third Party
import moment from "moment";
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { openReplyModal } from "../../store/slices/ReplyModal-slice";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";

// Components
import { SendSupportReplayModal } from "../../components/Modal";
// Helpers
import { CircularLoading } from "../../HelperComponents";

// Icons
import {
	Customer,
	DateIcon,
	Phone,
	ReplayIcon,
	StatusIcon,
	User,
} from "../../data/Icons";
import { TextEditor } from "../../components/TextEditor";

// RTK query
import { useShowTechnicalSupportByIdQuery } from "../../store/apiSlices/technicalSupportApi";

// Modal Style
const style = {
	position: "fixed",
	top: "80px",
	left: "0%",
	transform: "translate(0%, 0%)",
	width: "80%",
	height: "100%",
	overflow: "auto",
	bgcolor: "#f8f9fa",
	paddingBottom: "60px",

	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		backgroundColor: "#F6F6F6",
	},
};

const TechnicalSupportDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch(true);

	// to get all  data from server
	const { data: technicalSupportData, isFetching } =
		useShowTechnicalSupportByIdQuery(id);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تفاصيل الدعم الفني</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Support")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style} className='nested-pages-modal'>
						<section className='SupportDetails-page'>
							<div className='head-category mb-md-5 mb-3'>
								<div className='row'>
									<div className='page-title mb-3'>
										<h3>تفاصيل الدعم الفني</h3>
									</div>
								</div>

								<div className='row'>
									<nav aria-label='breadcrumb'>
										<ol className='breadcrumb'>
											<li className='breadcrumb-item'>
												<Link to='/Support' className='me-2'>
													الدعم الفني
												</Link>
											</li>
											<li className='breadcrumb-item ' aria-current='page'>
												<Link to='/Support' className='me-2'>
													جدول الرسائل
												</Link>
											</li>

											<li
												className='breadcrumb-item active'
												aria-current='page'>
												تفاصيل الرسالة
											</li>
										</ol>
									</nav>
								</div>
							</div>

							<div className='mb-md-5 mb-3'>
								{isFetching ? (
									<div
										className='d-flex justify-content-center align-items-center'
										style={{ height: "200px" }}>
										<CircularLoading />
									</div>
								) : (
									<div className='issue-wrapper'>
										<div className='row mb-md-5 mb-3'>
											<div className='col-12 mb-4'>
												<div className='issue-number'>
													<h5>رقم الرسالة</h5>
													<div>{technicalSupportData?.id}</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='issue-details-box'>
													<div className='row justify-content-between'>
														<div className='col-lg-6 col-12'>
															<div className='row mb-md-4 mb-3'>
																<div className='data-row d-flex flex-md-row flex-column'>
																	<div className='box label-box'>
																		<User className='client-icon' />
																		<span className='me-2'>اسم العميل</span>
																	</div>

																	<div className='box success-box d-flex justify-content-center'>
																		<span className='text-center text-overflow'>
																			{technicalSupportData?.name}
																		</span>
																	</div>
																</div>
															</div>

															<div className='row mb-md-4 mb-3'>
																<div className='data-row d-flex flex-md-row flex-column'>
																	<div className='box label-box'>
																		<Phone className='phone-icon' />
																		<span className='me-2'> الهاتف</span>
																	</div>

																	<div className='box success-box d-flex justify-content-center'>
																		<span style={{ direction: "ltr" }}>
																			{technicalSupportData?.phonenumber}
																		</span>
																	</div>
																</div>
															</div>

															<div className='row mb-md-4 mb-3'>
																<div className='data-row d-flex flex-md-row flex-column'>
																	<div className='box label-box'>
																		<StatusIcon className='status' />
																		<span className='me-2'> الحالة</span>
																	</div>
																	<div className='box pending-box d-flex justify-content-center'>
																		<span>
																			{technicalSupportData?.supportstatus}
																		</span>
																	</div>
																</div>
															</div>
														</div>

														<div className='col-lg-6 col-12'>
															<div className='row mb-md-4 mb-3'>
																<div className='data-row d-flex flex-md-row flex-column justify-content-end data-row'>
																	<div className='box label-box'>
																		<DateIcon className='date-icon' />
																		<span className='me-2'> تاريخ الرسالة</span>
																	</div>
																	<div className='box success-box d-flex justify-content-center'>
																		<span>
																			{moment(
																				technicalSupportData?.created_at
																			).format("DD-MM-YYYY")}
																		</span>
																	</div>
																</div>
															</div>

															<div className='row mb-md-4 mb-3'>
																<div className='data-row d-flex flex-md-row flex-column justify-content-end'>
																	<div className='box label-box'>
																		<Customer className='customer-icon' />
																		<span className='me-2'>عنوان الرسالة </span>
																	</div>
																	<div className='box success-box d-flex justify-content-center'>
																		<span>{technicalSupportData?.title}</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/**  */}

										<div className='issue-content mb-3'>
											<div className='col-12 mb-3'>
												<div className='d-flex flex-row align-items-center justify-content-between'>
													<h4 className='issue-title'>محتوي الرسالة</h4>
													<Button
														variant='outlined'
														className='replay-btn'
														onClick={() => {
															dispatch(openReplyModal());
														}}>
														<ReplayIcon />
														<span className='user-name me-2 align-self-center'>
															رد
														</span>
													</Button>
												</div>
											</div>

											<div className='col-12 empty-cart'>
												<TextEditor
													readOnly={true}
													ToolBar={"emptyCart"}
													placeholder={`${technicalSupportData?.content}`}
												/>
											</div>
										</div>

										{/**  */}
										<div className='row'>
											<div className='col-12'>
												<div className=' close-btn d-flex justify-content-center align-items-center mb-3'>
													<button onClick={() => navigate("/Support")}>
														إغلاق
													</button>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</section>
					</Box>
				</Modal>
			</div>
			<SendSupportReplayModal supportDetails={technicalSupportData} />
		</>
	);
};

export default TechnicalSupportDetails;
