import React, { useContext, useEffect, useState } from "react";

// Third party

import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// Components
import { Breadcrumb, PageHint } from "../../components";
import { TopBarSearchInput } from "../../global/TopBar";
import ShippingCompaniesData from "./ShippingCompaniesData";
// Helpers
import { CircularLoading } from "../../HelperComponents";

// RTK Query
import {
	useGetShippingCompaniesQuery,
	useChangeShippingComponyStatusMutation,
	useUpdatePriceForOtherShippingCompanyMutation,
	useChangeOtherShippingCompanyStatusAndAddPriceMutation,
} from "../../store/apiSlices/shippingCompaniesApi";

// Icons
import { Switch } from "@mui/material";
import { LoadingContext } from "../../Context/LoadingProvider";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";
import Context from "../../Context/context";

// utilities
import { DaysFormatter } from "../../utilities";

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

const ShippingCompanies = () => {
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	// to get all  data from server
	const { data: shippingCompanies, isLoading } = useGetShippingCompaniesQuery();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [validPriceFocus, setValidPriceFocus] = useState(false);
	const [otherShippingCompany, setOtherShippingCompany] = useState({});
	const [allShippingCompanies, setAllShippingCompanies] = useState([]);
	const [otherShipCompDetails, setOtherShipCompDetails] = useState({
		id: "",
		status: "",
		price: "",
		currentPrice: "",
		time: "",
		currentTime: "",
		overprice: "",
		currentOverprice: "",
		cod_price: "",
		currentCodPrice: "",
	});

	// -----------------------------------------------------------

	// Side Effects to filter other shipping
	useEffect(() => {
		if (shippingCompanies) {
			setOtherShippingCompany(
				shippingCompanies?.find(
					(shippingCompany) => shippingCompany?.name === "اخرى"
				)
			);

			setAllShippingCompanies(
				shippingCompanies?.filter(
					(shippingCompany) => shippingCompany?.name !== "اخرى"
				)
			);
		}
	}, [shippingCompanies]);

	// -----------------------------------------------
	useEffect(() => {
		if (otherShippingCompany) {
			setOtherShipCompDetails((prevDetails) => ({
				...prevDetails,
				id: otherShippingCompany?.id,
				status: otherShippingCompany?.status === "نشط" ? true : false,

				// shipment price
				price:
					otherShippingCompany?.price === "0"
						? ""
						: otherShippingCompany?.price,

				// shipment time
				time:
					otherShippingCompany?.time === "0" ? "" : otherShippingCompany?.time,
				//shipment over price
				overprice: !otherShippingCompany?.overprice
					? ""
					: otherShippingCompany?.overprice,

				currentOverprice: otherShippingCompany?.overprice,
				currentPrice: otherShippingCompany?.price,
				currentTime: otherShippingCompany?.time,
				//cod price
				cod_price: !otherShippingCompany?.cod_price
					? ""
					: otherShippingCompany?.cod_price,
				currentCodPrice: otherShippingCompany?.cod_price,
			}));
		}
	}, [otherShippingCompany]);

	// TO HANDLE NAME OF DAYS

	// handle onchange function
	const handleOnChangeDetails = (e) => {
		const { name, value } = e.target;
		setOtherShipCompDetails((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};
	//===================================================================//

	// change the Shipping Company  Status
	const [changeShippingComponyStatus] =
		useChangeShippingComponyStatusMutation();

	const handleChangeStatus = async (id) => {
		// make request...
		try {
			const response = await changeShippingComponyStatus(id);

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setEndActionTitle(response?.data?.message?.ar);
			} else {
				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);
			}
		} catch (error) {
			console.error("Error changing changeShippingComponyStatus:", error);
		}
	};
	// ----------------------------------------------------------------------------

	// Change OtherShipping Company Status And Add Price
	const [changeOtherShippingCompanyStatusAndAddPrice] =
		useChangeOtherShippingCompanyStatusAndAddPriceMutation();
	const handleChangeOtherShippingCompanyStatusAndAddPrice = async (id) => {
		// check if there some of a
		if (
			otherShippingCompany?.status === false ||
			otherShippingCompany?.status === "غير نشط" ||
			allShippingCompanies?.some((item) => item?.status === "نشط") ||
			allShippingCompanies?.length === 0
		) {
			// make request...
			try {
				const response = await changeOtherShippingCompanyStatusAndAddPrice({
					otherShipCompanyId: id,
					otherShipCompanyPrice: otherShipCompDetails?.price,
					otherShipCompanyDuration: otherShipCompDetails?.time,
				});

				// Handle response
				if (
					response.data?.success === true &&
					response.data?.data?.status === 200
				) {
					setEndActionTitle(response?.data?.message?.ar);
				} else {
					// Handle display errors using toast notifications
					toast.error(
						response?.data?.message?.ar
							? response.data.message.ar
							: response.data.message.en,
						{
							theme: "light",
						}
					);

					Object.entries(response?.data?.message?.en)?.forEach(
						([key, message]) => {
							toast.error(message[0], { theme: "light" });
						}
					);
				}
			} catch (error) {
				console.error("Error changing changeShippingComponyStatus:", error);
			}
		} else {
			toast.error("يجب تفعيل شركة شحن واحدة على الاقل", {
				theme: "light",
			});
		}
	};

	//--------------------------------------------------------------------------------

	// handle update Price For Other Shipping Company
	const [updatePriceForOtherShippingCompany] =
		useUpdatePriceForOtherShippingCompanyMutation();
	const handleUpdatePrice = async () => {
		setLoadingTitle("جار تعديل بيانت الشحن");

		// data that sent to api...
		let formData = new FormData();
		formData.append("price", otherShipCompDetails?.price);
		formData.append("time", otherShipCompDetails?.time);
		formData.append("overprice", otherShipCompDetails?.overprice);
		formData.append("cod_price", otherShipCompDetails?.cod_price);

		// make request...
		try {
			const response = await updatePriceForOtherShippingCompany({
				otherShipCompanyId: otherShipCompDetails?.id,
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
			} else {
				setLoadingTitle("");

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);

				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error(
				"Error changing updatePriceForOtherShippingCompany:",
				error
			);
		}
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | شركات الشحن</title>
			</Helmet>
			<section className='shipping-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<Breadcrumb mb={"mb-md-5 mb-3"} currentPage={"شركات الشحن"} />

				<div className='row  mb-2'>
					<div className='col-12 '>
						<PageHint
							hint={`اشتراك واحد يتيح لك استخدام جميع شركات الشحن`}
							flex={"d-flex justify-content-start align-items-center gap-2"}
						/>
					</div>
				</div>
				<div className='data-container '>
					{isLoading ? (
						<div className='row'>
							<div
								className='d-flex justify-content-center align-items-center col-12'
								style={{ minHeight: "250px" }}>
								<CircularLoading />
							</div>
						</div>
					) : (
						<>
							<div className='row other-shipping-company mb-4'>
								<PageHint
									hint={`	من خلال تفعيل هذا الخيار يمكنك تحديد الطريقة المناسبة في
										توصيل الطلبات وتحديد تكلفة الشحن المناسبة.`}
									flex={
										" d-flex  justify-content-start align-items-center gap-2"
									}
								/>

								<div className='col-xl-3 col-lg-4 col-12'>
									<ShippingCompaniesData
										shippingCompanyName={otherShippingCompany?.name}
										currentShippingPrice={
											otherShipCompDetails?.status &&
											otherShipCompDetails?.currentPrice
										}
										currentShippingTime={
											otherShipCompDetails?.status &&
											otherShipCompDetails?.currentTime
										}
										currentShippingOverPrice={
											otherShipCompDetails?.status &&
											otherShipCompDetails?.currentOverprice
										}
										currentShippingCodPrice={
											otherShipCompDetails?.status &&
											otherShipCompDetails?.currentCodPrice
										}
										image={otherShippingCompany?.image}
										hideSwitch={true}
									/>
								</div>
								{otherShippingCompany && (
									<div className='col-xl-7 col-lg-6 col-12'>
										<div className=''>
											<div className='tax-text'>تفعيل/تعطيل الشحن الخاص </div>
											<div
												className='switch-box d-flex justify-content-center align-items-center mb-2'
												style={{
													height: "50px",
													backgroundColor: "#f7f8f8",
												}}>
												<Switch
													onChange={() => {
														handleChangeOtherShippingCompanyStatusAndAddPrice(
															otherShippingCompany?.id
														);
													}}
													checked={
														otherShippingCompany?.status === "نشط"
															? true
															: false
													}
													sx={switchStyle}
												/>
											</div>
											<div className='shipping-price-hint d-flex d-md-none'>
												تكلفة الشحن{" "}
											</div>
											<div
												style={{
													backgroundColor: !otherShipCompDetails?.status
														? "#fefefeef"
														: "#fffffff7",
												}}
												className='shipping-price-input-box d-flex justify-content-center align-items-center gap-1 mb-2'>
												<div className='shipping-price-hint d-none d-md-flex'>
													تكلفة الشحن{" "}
												</div>

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
													disabled={!otherShipCompDetails?.status}
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

											<div className='shipping-price-hint d-flex d-md-none'>
												مدة التوصيل{" "}
											</div>
											<div
												style={{
													backgroundColor: !otherShipCompDetails?.status
														? "#fefefeef"
														: "#fffffff7",
												}}
												className='shipping-price-input-box d-flex justify-content-center align-items-center gap-1 mb-2'>
												<div className='shipping-price-hint d-none d-md-flex'>
													مدة التوصيل{" "}
												</div>
												<input
													type='text'
													name='time'
													value={otherShipCompDetails?.time}
													onChange={(e) => handleOnChangeDetails(e)}
													placeholder='حدد مدة التوصيل '
													className='shipping-price'
													disabled={!otherShipCompDetails?.status}
												/>
												<div className='currency p-2'>
													{otherShipCompDetails?.time === "" ||
													otherShipCompDetails?.time === "0"
														? "يوم"
														: DaysFormatter(otherShipCompDetails?.time)}
												</div>
											</div>
											<div className='shipping-price-hint d-flex d-md-none'>
												تكلفة الوزن الزائد
											</div>
											<div
												style={{
													backgroundColor: !otherShipCompDetails?.status
														? "#fefefeef"
														: "#fffffff7",
												}}
												className='shipping-price-input-box d-flex justify-content-center align-items-center gap-1 mb-2'>
												<div className='shipping-price-hint d-none d-md-flex'>
													تكلفة الوزن الزائد
												</div>
												<input
													type='text'
													name='overprice'
													value={otherShipCompDetails?.overprice}
													onChange={(e) => handleOnChangeDetails(e)}
													placeholder='حدد تكلفة الوزن الزائد لكل كيلو جرام  '
													className='shipping-price'
													disabled={!otherShipCompDetails?.status}
												/>
												<div className='currency p-2'> ر.س</div>
											</div>
											<div className='shipping-price-hint d-flex d-md-none'>
												تكلفة الدفع عند الاستلام
											</div>
											<div
												style={{
													backgroundColor: !otherShipCompDetails?.status
														? "#fefefeef"
														: "#fffffff7",
												}}
												className='shipping-price-input-box d-flex justify-content-center align-items-center gap-1 mb-2'>
												<div className='shipping-price-hint d-none d-md-flex'>
													تكلفة الدفع عند الاستلام
												</div>

												<input
													type='text'
													name='cod_price'
													value={otherShipCompDetails?.cod_price}
													onChange={(e) => handleOnChangeDetails(e)}
													placeholder=' تكلفة الدفع عند الاستلام'
													className='shipping-price'
													disabled={!otherShipCompDetails?.status}
												/>
												<div className='currency p-2'> ر.س</div>
											</div>
											<button
												className='save-price-btn'
												disabled={!otherShipCompDetails?.status || isLoading}
												onClick={handleUpdatePrice}>
												تعديل بيانات الشحن
											</button>
										</div>
									</div>
								)}
							</div>

							<div className='row'>
								{allShippingCompanies?.length !== 0 &&
									allShippingCompanies?.map((item) => (
										<div className='col-xl-3 col-lg-4 col-6' key={item?.id}>
											<ShippingCompaniesData
												shippingCompanyName=''
												currentShippingPrice=''
												currentShippingTime={0}
												image={item?.image}
												changeStatus={() => handleChangeStatus(item?.id)}
												checked={item?.status === "نشط" ? true : false}
											/>
										</div>
									))}
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
};

export default ShippingCompanies;
