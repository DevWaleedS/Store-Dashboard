import React, { useContext, useEffect, useState } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// Components
import useFetch from "../../Hooks/UseFetch";
import { TopBarSearchInput } from "../../global";
import ShippingCompaniesData from "./ShippingCompaniesData";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Context
import Context from "../../Context/context";

// Icons

import { HomeIcon } from "../../data/Icons";
import { toast } from "react-toastify";

const ShippingCompanies = () => {
	const [validPriceFocus, setValidPriceFocus] = useState(false);
	const [otherShippingCompany, setOtherShippingCompany] = useState([]);
	const [allShippingCompanies, setAllShippingCompanies] = useState([]);
	const [otherShipCompDetails, setOtherShipCompDetails] = useState({
		id: "",
		status: "",
		price: "",
		currentPrice: "",
		time: "",
		currentTime: "",
	});

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/shippingtype`
	);

	// Side Effects
	useEffect(() => {
		if (fetchedData) {
			setOtherShippingCompany(
				fetchedData?.data?.shippingtypes?.filter(
					(shippingCompany) => shippingCompany?.name === "اخرى"
				)
			);

			setAllShippingCompanies(
				fetchedData?.data?.shippingtypes?.filter(
					(shippingCompany) => shippingCompany?.name !== "اخرى"
				)
			);
		}
	}, [fetchedData]);
	// ------------------------

	useEffect(() => {
		if (otherShippingCompany) {
			setOtherShipCompDetails((prevDetails) => ({
				...prevDetails,
				id: otherShippingCompany[0]?.id,
				status: otherShippingCompany[0]?.status === "نشط" ? true : false,
				price: otherShippingCompany[0]?.price,
				time: otherShippingCompany[0]?.time,
				currentPrice: otherShippingCompany[0]?.price,
				currentTime: otherShippingCompany[0]?.time,
			}));
		}
	}, [otherShippingCompany]);

	// TO HANDLE NAME OF DAYS
	const daysDefinition = (time) => {
		let timeValue = Number(time);
		if (timeValue === 1) {
			return "يوم واحد";
		} else if (timeValue === 2) {
			return "يومين";
		} else if (timeValue <= 10 && timeValue >= 3) {
			return `${timeValue} أيام`;
		} else {
			return `${timeValue} يوم`;
		}
	};

	// handle onchange function
	const handleOnChangeDetails = (e) => {
		const { name, value } = e.target;
		setOtherShipCompDetails((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// change the Shipping Company  Status
	const changeStatus = (id) => {
		axios
			.get(
				`https://backend.atlbha.com/api/Store/changeShippingtypeStatus/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("store_token")}`,
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

	// Change OtherShipping Company Status And Add Price
	const changeOtherShippingCompanyStatusAndAddPrice = (id) => {
		axios
			.get(
				`https://backend.atlbha.com/api/Store/changeShippingtypeStatus/${id}?price=${otherShipCompDetails?.price}&time=${otherShipCompDetails?.time}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("store_token")}`,
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

	const updatePrice = () => {
		let formData = new FormData();
		formData.append("price", otherShipCompDetails?.price);
		formData.append("time", otherShipCompDetails?.time);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/updatePrice/${otherShipCompDetails?.id}`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("store_token")}`,
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
					toast.error(res?.data?.message?.en?.price?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.time?.[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | شركات الشحن</title>
			</Helmet>
			<section className='shipping-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-md-5 mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item ' aria-current='page'>
									بيانات المتجر
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									شركات الشحن
								</li>
							</ol>
						</nav>
					</div>
				</div>

				{/* Shipping Companies Data Components */}
				<div className='shipping-company-hint mb-2'>
					اشتراك واحد يتيح لك استخدام جميع شركات الشحن
				</div>
				<div className='data-container '>
					{loading ? (
						<div className='row'>
							<div
								className='d-flex justify-content-center align-items-center col-12'
								style={{ minHeight: "250px" }}>
								<CircularLoading />
							</div>
						</div>
					) : (
						<>
							<div className='row'>
								{allShippingCompanies?.length !== 0 &&
									allShippingCompanies?.map((item) => (
										<div className='col-xl-3 col-lg-4 col-6' key={item?.id}>
											<ShippingCompaniesData
												shippingCompanyName=''
												currentShippingPrice=''
												currentShippingTime={0}
												image={item?.image}
												changeStatus={() => changeStatus(item?.id)}
												checked={item?.status === "نشط" ? true : false}
											/>
										</div>
									))}
							</div>

							<div className='row other-shipping-company'>
								{otherShippingCompany?.map((item) => (
									<div key={item?.id} className='col-xl-3 col-lg-4 col-12'>
										<div className='shipping-company-hint d-lg-none d-flex mb-2 '>
											من خلال تفعيل هذا الخيار يمكنك تحديد الطريقة المناسبة في
											توصيل الطلبات وتحديد تكلفة الشحن المناسبة.
										</div>
										<ShippingCompaniesData
											shippingCompanyName={item?.name}
											currentShippingPrice={
												otherShipCompDetails?.status &&
												otherShipCompDetails?.currentPrice
											}
											currentShippingTime={
												otherShipCompDetails?.status &&
												otherShipCompDetails?.currentTime
											}
											image={item?.image}
											changeStatus={() =>
												changeOtherShippingCompanyStatusAndAddPrice(item?.id)
											}
											checked={item?.status === "نشط" ? true : false}
										/>
									</div>
								))}
								{otherShippingCompany?.length !== 0 && (
									<div className='col-xl-7 col-lg-6 col-12'>
										<div className=''>
											<div className='shipping-company-hint  d-lg-flex d-none mb-2'>
												من خلال تفعيل هذا الخيار يمكنك تحديد الطريقة المناسبة في
												توصيل الطلبات وتحديد تكلفة الشحن المناسبة.
											</div>
											<div
												style={{
													backgroundColor: !otherShipCompDetails?.status
														? "#fefefeef"
														: "#fffffff7",
												}}
												className='shipping-price-input-box d-flex justify-content-center align-items-center gap-1 mb-2'>
												<div className='shipping-price-hint'>تكلفة الشحن </div>
												<input
													type='text'
													name='price'
													value={otherShipCompDetails?.price}
													onChange={(e) => handleOnChangeDetails(e)}
													placeholder='حدد تكلفة الشحن المناسبة'
													className='shipping-price'
													onFocus={() => {
														setValidPriceFocus(true);
													}}
													onBlur={() => {
														setValidPriceFocus(true);
													}}
													aria-invalid={validPriceFocus ? "false" : "true"}
												/>

												<div className='currency p-2'>ر.س</div>
											</div>
											<div
												className={`${
													validPriceFocus &&
													otherShipCompDetails?.price &&
													otherShipCompDetails?.price === "0"
														? "d-block"
														: "d-none"
												}  important-hint  mb-2 `}
												style={{
													fontSize: "16px",
													whiteSpace: "normal",
													marginTop: "-10px",
												}}>
												تكلفة الشحن 0 تعنى ان الشحن سيصبح مجاني هل انت متأكد من
												ذلك؟
											</div>

											<div
												style={{
													backgroundColor: !otherShipCompDetails?.status
														? "#fefefeef"
														: "#fffffff7",
												}}
												className='shipping-price-input-box d-flex justify-content-center align-items-center gap-1 mb-2'>
												<div className='shipping-price-hint'>مدة التوصيل </div>
												<input
													type='text'
													name='time'
													value={otherShipCompDetails?.time}
													onChange={(e) => handleOnChangeDetails(e)}
													placeholder='حدد مدة التوصيل '
													className='shipping-price'
												/>
												<div className='currency p-2'>
													{otherShipCompDetails?.time === "" ||
													otherShipCompDetails?.time === "0"
														? "يوم"
														: daysDefinition(otherShipCompDetails?.time)}
												</div>
											</div>

											<button
												className='save-price-btn'
												disabled={!otherShipCompDetails?.status}
												onClick={updatePrice}>
												تعديل بيانات الشحن
											</button>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
};

export default ShippingCompanies;
