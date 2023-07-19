import React from "react";
import { Helmet } from "react-helmet";
import useFetch from "../../Hooks/UseFetch";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// icons
import { ReactComponent as Message } from "../../data/Icons/icon-24-email.svg";
import { ReactComponent as Phone } from "../../data/Icons/icon-24- call.svg";
import CircularLoading from "../../HelperComponents/CircularLoading";

const style = {
	position: "absolute",
	top: "80px",
	left: "0%",
	transform: "translate(0%, 0%)",
	width: "74%",
	height: "auto",
	bgcolor: "#F6F6F6",
	"@media(max-width:992px)": {
		width: "80%",
	},
	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		paddingBottom: 0,
	},
};

const UserDetails = () => {
	const { fetchedData, loading } = useFetch(
		"https://backend.atlbha.com/api/Store/profile"
	);
	const navigate = useNavigate();

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | حسابي</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='user-details'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='user-details-title'>
										<h5 className='mb-3'> حسابي التاجر</h5>
										<div className='row'>
											<nav aria-label='breadcrumb'>
												<ol className='breadcrumb'>
													<li className='breadcrumb-item text-bold'>
														<Link to='/Management'> جدول المستخدمين</Link>
													</li>
													<li
														className='breadcrumb-item active'
														aria-current='page'>
														تفاصيل مستخدم موظف في النظام
													</li>
												</ol>
											</nav>
										</div>
									</div>
								</div>
							</div>
							{loading ? (
								<div className='mt-5'>
									<CircularLoading />
								</div>
							) : (
								<>
									<div className='user-details-body'>
										<div className='row'>
											<div className='col-lg-2 col-12 d-flex justify-content-center'>
												<img
													className='img-fluid'
													src={fetchedData?.data?.users?.image}
													alt={fetchedData?.data?.users?.name}
												/>
											</div>

											<div className='col-lg-4 col-12 d-flex justify-content-center'>
												<div className='user-info me-md-3'>
													<span className='user-name mb-3 d-block text-center'>
														{fetchedData?.data?.users?.name === null
															? fetchedData?.data?.users?.user_name
															: fetchedData?.data?.users?.name}
													</span>
													<div className='contact-info mb-2'>
														<Message />
														<span className='me-3'>
															{fetchedData?.data?.users?.email}
														</span>
													</div>
													<div
														className='contact-info'
														style={{
															direction: "ltr",
															display: "flex",
															flexDirection: "row-reverse",
														}}>
														<Phone />
														<span className='me-3'>
															{fetchedData?.data?.users?.phonenumber}
														</span>
													</div>
												</div>
											</div>

											<div className='col-lg-4 col-12 d-flex justify-content-center order-md-last order-first'>
												<div className='job-title'>
													{fetchedData?.data?.users?.role === null
														? "الدور الوظيفي"
														: fetchedData?.data?.users?.role?.name}
												</div>
											</div>
										</div>
									</div>
									<div className='user-details-footer'>
										<div className='row d-flex justify-content-center align-items-center'>
											<div className='col-lg-2 col-6'>
												<button
													onClick={() => navigate("EditUserDetails")}
													className='edit-btn'>
													تعديل
												</button>
											</div>
											<div className='col-lg-2 col-6'>
												<button
													className='close-btn'
													onClick={() => navigate("/")}>
													اغلاق
												</button>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default UserDetails;
