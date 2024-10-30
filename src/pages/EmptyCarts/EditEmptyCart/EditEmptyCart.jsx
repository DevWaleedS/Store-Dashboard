import React, { useState, useContext, useEffect } from "react";

// Third Party

import moment from "moment";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";

// Context
import { LoadingContext } from "../../../Context/LoadingProvider";
import { TextEditorContext } from "../../../Context/TextEditorProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Components
import UserDetails from "./UserDetails";
import DiscountDetails from "./DiscountDetails";
import { Breadcrumb } from "../../../components";
import SendOfferMessage from "./SendOfferMessage";
import ProductsTableDetails from "./ProductsTableDetails";
// Helpers
import { CircularLoading } from "../../../HelperComponents";

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Icons
import { Communication, DateIcon } from "../../../data/Icons";

// RTK Query
import {
	useGetEmptyCartByIdQuery,
	useSendOfferToEmptyCartMutation,
} from "../../../store/apiSlices/emptyCartsApi";

// Modal Style
const style = {
	position: "fixed",
	top: "80px",
	left: "0%",
	transform: "translate(0%, 0%)",
	width: "80%",
	height: "100%",
	overflow: "auto",
	bgcolor: "#fff",
	paddingBottom: "80px",
	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		backgroundColor: "#F6F6F6",
		paddingBottom: 0,
	},
};

const EditEmptyCart = () => {
	const { id } = useParams();
	// get empty cart data by id
	const { data: currentCartData, isFetching } = useGetEmptyCartByIdQuery(id);

	const navigate = useNavigate();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	const [openPercentMenu, setOpenPercentMenu] = useState(false);
	const [free_shipping, setFree_shipping] = useState(false);
	const [discount_type, setDiscount_type] = useState(null);
	const [discount_value, setDiscount_value] = useState(0);
	const [discountPercentValue, setDiscountPercentValue] = useState(0);
	const [discountFixedValue, setDiscountFixedValue] = useState(0);
	const [discount_total, setDiscount_total] = useState(0);
	const [discount_expire_date, setDiscount_expire_date] = useState("");

	// ----------------------------------------------------------------------

	// to handle open discount_type inputs
	useEffect(() => {
		if (
			currentCartData?.discount_type !== "" &&
			currentCartData?.discount_total !== 0 &&
			currentCartData?.discount_value !== 0
		) {
			setOpenPercentMenu(true);
		} else {
			setOpenPercentMenu(false);
		}
	}, [
		currentCartData?.discount_type,
		currentCartData?.discount_total,
		currentCartData?.discount_value,
	]);

	// To Calc discount total if the discount value is percent
	useEffect(() => {
		if (currentCartData && discount_type === "percent") {
			setDiscountPercentValue((discount_value / 100) * currentCartData?.total);
		} else if (currentCartData && discount_type === "fixed") {
			setDiscountFixedValue(currentCartData?.total - discount_value);
		} else {
			setDiscountPercentValue();
			setDiscountFixedValue();
		}
	}, [currentCartData, discount_type, discount_value]);

	// to handle  total discount value
	const [discountValue, setDiscountValue] = useState("---");
	useEffect(() => {
		calculateDiscountValue();
	}, [
		free_shipping,
		currentCartData,
		discount_type,
		discountFixedValue,
		discountPercentValue,
		openPercentMenu,
	]);

	const calculateDiscountValue = () => {
		let calculatedValue = "---";

		if (free_shipping) {
			calculatedValue =
				currentCartData?.total - currentCartData?.shipping_price;
		} else {
			if (openPercentMenu) {
				if (discount_type === "fixed") {
					calculatedValue =
						discountFixedValue <= 0 ? "---" : discountFixedValue;
				} else if (discount_type === "percent") {
					const totalAfterDiscount = (
						currentCartData?.total - discountPercentValue
					)?.toFixed(2);
					calculatedValue =
						totalAfterDiscount <= 0 ? "---" : totalAfterDiscount;
				} else {
					calculatedValue =
						currentCartData?.total <= 0 ? "---" : currentCartData?.total;
				}
			} else {
				calculatedValue =
					currentCartData?.total <= 0 ? "---" : currentCartData?.total;
			}
		}

		setDiscountValue(calculatedValue);
	};
	// -----------------------------------------------------------------------

	// errors
	const [errors, setErrors] = useState({
		messageErr: "",
		discountValueErr: "",
		discountExpireDateErr: "",
	});
	const resetError = () => {
		setErrors({
			message: "",
			discount_value: "",
			discount_expire_date: "",
		});
	};
	// -----------------------------------------------------------------------

	// --------------- handle send offer to the empty cart -----------------------------------------------
	const [sendOfferToEmptyCart] = useSendOfferToEmptyCartMutation();
	const sendOfferCart = async () => {
		setLoadingTitle("جاري ارسال العرض");
		resetError();

		// data that send to api
		let formData = new FormData();
		formData.append("free_shipping", free_shipping === true ? 1 : 0);
		if (openPercentMenu) {
			formData.append("discount_type", discount_type);
			formData.append("discount_value", discount_value);
		} else {
			formData.append("discount_type", "");
			formData.append("discount_value", "");
		}

		formData.append("message", editorValue);
		formData.append("discount_total", discount_total);
		formData.append(
			"discount_expire_date",
			discount_expire_date
				? moment(discount_expire_date).format("YYYY-MM-DD")
				: ""
		);

		// making request...
		try {
			const response = await sendOfferToEmptyCart({
				id,
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");

				navigate("/EmptyCarts");

				setEditorValue("");
			} else {
				setLoadingTitle("");

				setErrors({
					...errors,
					messageErr: response?.data?.message?.en?.message?.[0],
					discountValueErr: response?.data?.message?.en?.discount_value?.[0],
					discountExpireDateErr:
						response?.data?.message?.en?.discount_expire_date?.[0],
				});

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
			console.error("Error changing sendOfferToEmptyCart:", error);
		}
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تفاصيل السلة</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					onClose={() => {
						navigate("/EmptyCarts");
						setEditorValue("");
					}}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style} className='nested-pages-modal'>
						<div className='user-cart-data'>
							<div className='d-flex'>
								<div className='col-12'>
									<Breadcrumb
										mb={"mb-md-5"}
										pt={"pt-md-4"}
										route={"/EmptyCarts"}
										parentPage={"السلات المتروكة"}
										currentPage={currentCartData?.user?.name}
									/>
								</div>
							</div>

							{isFetching ? (
								<div
									className='d-flex justify-content-center align-items-center'
									style={{ height: "200px" }}>
									<CircularLoading />
								</div>
							) : (
								<div className='user-cart-data-wrapper'>
									{/** client details */}
									<div className='mb-md-5 mb-3'>
										<UserDetails userData={currentCartData} />
									</div>

									{/** Products details */}
									<div className='mb-md-5 mb-3'>
										<ProductsTableDetails
											tableData={currentCartData}
											is_service={currentCartData?.is_service}
										/>
									</div>

									{/** Discount details */}
									<div className='mb-md-5 mb-3'>
										<DiscountDetails
											is_service={currentCartData?.is_service}
											data={currentCartData}
											errors={errors}
											setDiscount_total={setDiscount_total}
											setDiscount_value={setDiscount_value}
											setDiscount_type={setDiscount_type}
											setFree_shipping={setFree_shipping}
											setOpenPercentMenu={setOpenPercentMenu}
											openPercentMenu={openPercentMenu}
											discount_type={discount_type}
											free_shipping={free_shipping}
											discount_value={discount_value}
											discountPercentValue={discountPercentValue}
										/>
									</div>

									{/** Offer Message  */}
									<div className='mb-5 '>
										<SendOfferMessage
											currentCartData={currentCartData}
											errors={errors}
										/>
									</div>

									{/** handle offer data  */}
									<div className='mb-md-5 mb-3'>
										<div className='create-offer-row'>
											<div className='mb-md-0 mb-3 box user-name-box '>
												<label htmlFor='user-name'>اسم العميل</label>
												<input
													disabled
													value={`${currentCartData?.user?.name} ${currentCartData?.user?.lastname}`}
													onChange={() => console.log("")}
													type='text'
													name='user-name'
													id='user-name'
												/>
											</div>
											<div className='mb-md-0 mb-3 box total-discount-box'>
												<label htmlFor='total-discount'>
													إجمالي السلة بعد الخصم
												</label>
												<input
													disabled
													className='direction-ltr text-center'
													value={discountValue}
													type='text'
													name='total-discount'
													id='total-discount'
												/>
											</div>
											{(free_shipping || openPercentMenu) && (
												<div className=' mb-md-0 mb-3 box discount-date-box'>
													<label htmlFor='discount-date'>
														تاريخ انتهاء العرض
													</label>

													<div className='date-icon'>
														<DateIcon />
													</div>
													<DatePicker
														placeholderText='اختر تاريخ انتهاء العرض'
														type='text'
														dateFormat='yyyy-MM-dd'
														minDate={moment().toDate()}
														selected={discount_expire_date}
														onChange={(date) => setDiscount_expire_date(date)}
													/>
													{errors?.discountExpireDateErr && (
														<div className='text-center '>
															<span
																className='fs-6 text-danger'
																style={{ whiteSpace: "normal" }}>
																{errors?.discountExpireDateErr}
															</span>
														</div>
													)}
												</div>
											)}
										</div>
									</div>

									{/** buttons  */}
									<div className='mb-md-5 mb-3'>
										<div className='col-12 p-0'>
											<div className='send-offer-btn gap-3'>
												<button
													onClick={sendOfferCart}
													disabled={
														discountFixedValue <= 0 ||
														currentCartData?.total <= 0
													}>
													<Communication />
													<span className='me-2'>ارسال العرض</span>
												</button>
												<button
													onClick={() => {
														navigate("/EmptyCarts");
													}}
													style={{
														backgroundColor: "transparent",
														border: "1px solid #02466a",
													}}>
													<span style={{ color: "#02466a" }} className='me-2'>
														الغاء
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default EditEmptyCart;
