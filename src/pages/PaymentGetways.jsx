import React, { useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

// CONTEXT
import Context from "../Context/context";

// MUI
import { Switch } from "@mui/material";

// components
import useFetch from "../Hooks/UseFetch";
import { TopBarSearchInput } from "../global";
import CircularLoading from "../HelperComponents/CircularLoading";

// Icons
import { HomeIcon } from "../data/Icons";

const PaymentGetways = () => {
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/paymenttype`
	);

	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// change Status function
	const changeStatus = (id, e) => {
		axios
			.get(
				`https://backend.atlbha.com/api/Store/changePaymenttypeStatus/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | بوابات الدفع</title>
			</Helmet>
			<section className='payment-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item  ' aria-current='page'>
									بيانات المتجر
								</li>
								<li className='breadcrumb-item active' aria-current='page'>
									بوابات الدفع
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='data-container'>
					<div className='row'>
						{loading ? (
							<div
								style={{ minHeight: "250px" }}
								className='d-flex justify-content-center align-items-center'>
								<CircularLoading />
							</div>
						) : (
							fetchedData?.data?.paymenttypes?.map((item) => (
								<div className='col-xl-3 col-6' key={item.id}>
									<div className='data-widget'>
										<div className='data'>
											<div className='image-box'>
												<img
													className='img-fluid'
													src={item?.image}
													alt={item?.name}
													style={{ padding: "30px" }}
												/>
											</div>
										</div>
										<div className='switch-box'>
											<Switch
												name={item?.name}
												checked={item?.status === "نشط" ? true : false}
												onChange={() => changeStatus(item?.id)}
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
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default PaymentGetways;
