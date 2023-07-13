import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useFetch from "../Hooks/UseFetch";
import { useCookies } from "react-cookie";
import Context from "../Context/context";
import { Switch } from "@mui/material";
import { Link } from "react-router-dom";

// components
import MadaFormWeight from "../components/MadaFormWeight";
import PayPalFormWeight from "../components/PayPalFormWeight";

// import images
import CircularLoading from "../HelperComponents/CircularLoading";
import howIcon from "../data/Icons/icon_24_home.svg";
import { AiOutlineSearch } from "react-icons/ai";

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
						Authorization: `Bearer ${cookies.access_token}`,
					},
				}
			)
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
				<title>لوحة تحكم أطلبها | بوابات الدفع</title>
			</Helmet>
			<section className='payment-page p-lg-3'>
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
				<div className='head-category mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
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

				{loading ? (
					<div
						className='d-flex justify-content-center align-items-center'
						style={{ height: "200px" }}>
						<CircularLoading />
					</div>
				) : (
					<div className='data-container'>
						<div className='row'>
							{fetchedData?.data?.paymenttypes.map((item) => (
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
							))}

							<div className='payment-form' style={{ height: "550px" }}>
								{fetchedData?.data?.paymenttypes.map(
									(item) => item?.name
								)[0] === "paypal" &&
								fetchedData?.data?.paymenttypes.map(
									(item) => item?.status
								)[0] === "نشط" ? (
									<PayPalFormWeight />
								) : fetchedData?.data?.paymenttypes.map(
										(item) => item?.name
								  )[1] === "mada" &&
								  fetchedData?.data?.paymenttypes.map(
										(item) => item?.status
								  )[1] === "نشط" ? (
									<MadaFormWeight />
								) : (
									""
								)}
							</div>
						</div>
					</div>
				)}
			</section>
		</>
	);
};

export default PaymentGetways;
