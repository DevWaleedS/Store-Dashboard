import React, { Fragment, useContext, useState } from "react";

// Third party
import ReactDom from "react-dom";
import { toast } from "react-toastify";
import axios from "axios";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";

import MenuItem from "@mui/material/MenuItem";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeAddBankAccountModal } from "../../store/slices/AddBankAccountModal";

// Icons
import { CiUser } from "react-icons/ci";
import { BsCreditCard } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { IoMdInformationCircleOutline, IoIosArrowDown } from "react-icons/io";

import { useForm, Controller } from "react-hook-form";

import useFetch from "../../Hooks/UseFetch";

/* Modal Styles */
const style = {
	position: "absolute",
	top: "120px",
	left: "50%",
	transform: "translate(-50%, 0%)",
	width: "992px",
	maxWidth: "90%",
	paddingBottom: "30px",
	"@media(max-width:768px)": {
		position: "absolute",
		top: "10px",

		maxWidth: "95%",
	},
};

const selectStyle = {
	fontSize: "16px",
	width: "100%",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "0px",
		},
	"& .MuiOutlinedInput-root": {
		"& :hover": {
			border: "none",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "none",
	},
	"& .MuiSelect-icon": {
		right: "95%",
	},
};

/**----------------------------------------------------------------------------- */

const AddBankAccountModal = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const dispatch = useDispatch(false);
	const { isAddBankAccountModalOpen } = useSelector(
		(state) => state.AddBankAccountModal
	);

	/** ----------------- */
	const {
		fetchedData: banks,
		setReload,
		reload,
	} = useFetch("https://backend.atlbha.com/api/selector/banks");

	/** ----------- */

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);

	const { setLoadingTitle } = LoadingStore;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			bankId: "",
			bankAccountHolderName: "",
			bankAccount: "",
			iban: "",
			supplierCode: "",
		},
	});

	const [bankAccountInfo, setBankAccountInfo] = useState({
		bankId: "",
		bankAccountHolderName: "",
		bankAccount: "",
		iban: "",
		supplierCode: "",
	});

	/** handle onchange function  */
	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setBankAccountInfo((prevAccounts) => {
			return { ...prevAccounts, [name]: value };
		});
	};

	/** handle errors  */
	const [bankAccountErr, setBankAccountErr] = useState({
		bankId: "",
		bankAccountHolderName: "",
		bankAccount: "",
		iban: "",
		supplierCode: "",
	});

	const resetErrors = () => {
		setBankAccountErr({
			bankId: "",
			bankAccountHolderName: "",
			bankAccount: "",
			iban: "",
			supplierCode: "",
		});
	};

	/** handle save Options  */

	const addBankAccount = (data) => {
		setLoadingTitle("جاري اضافة الحساب البنكي");
		resetErrors();

		let formData = new FormData();
		formData.append("bankId", data?.bankId);
		formData.append("bankAccountHolderName", data?.bankAccountHolderName);
		formData.append("bankAccount", data?.bankAccount);
		formData.append("iban", data?.iban);
		formData.append("supplierCode", data?.supplierCode);

		axios
			.post(`https://backend.atlbha.com/api/Store/createSupplier`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);

					setReload(!reload);
					dispatch(closeAddBankAccountModal());
				} else {
					setLoadingTitle("");
					setBankAccountErr({
						bankId: res?.data?.message?.en?.bankId?.[0],
						bankAccountHolderName:
							res?.data?.message?.en?.bankAccountHolderName?.[0],
						bankAccount: res?.data?.message?.en?.bankAccount?.[0],
						iban: res?.data?.message?.en?.iban?.[0],
						supplierCode: res?.data?.message?.en?.supplierCode?.[0],
					});
					toast.error(res?.data?.message?.en?.name?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.short_description?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.cover?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.description?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.selling_price?.[0], {
						theme: "light",
					});

					toast.error(res?.data?.message?.en?.category_id?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.discount_price?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.subcategory_id?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.stock?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.weight?.[0], {
						theme: "light",
					});

					toast.error(res?.data?.message?.en?.SEOdescription?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.images?.[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Modal open={isAddBankAccountModalOpen}>
				<Box component={"div"} sx={style}>
					<div
						className=' add-bank-Account bg-white position-relative'
						style={{ borderRadius: "16px" }}>
						<div className='row'>
							<div className='col-12'>
								<div
									className='form-title  d-flex justify-content-center align-content-center'
									style={{
										borderRadius: "16px 16px 0 0",
										backgroundColor: "#1DBBBE",
										padding: "20px ",
									}}>
									<h5
										className='text-white text-center'
										style={{ fontSize: "22px", fontWeight: 400 }}>
										إضافة حساب بنكي
									</h5>

									<div className='close-icon-video-modal ps-2'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={() => {
												dispatch(closeAddBankAccountModal());
											}}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='form-body bg-white'>
							<div className='row  mb-4'>
								<div className='col-12 '>
									<div className='mb-2 option-info-label d-flex justify-content-start align-items-center gap-2 '>
										<IoMdInformationCircleOutline />
										<span>قم باضافة بيانات الحساب البنكي الخاص بك</span>
									</div>
								</div>
							</div>

							<form onSubmit={handleSubmit(addBankAccount)} className=''>
								<div className='row  mb-3'>
									<div className='col-12'>
										<label>
											{" "}
											البنك
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='inputs-wrapper'>
											<CiBank />
											<Controller
												name={"bankId"}
												control={control}
												rules={{
													required: "حقل اختيار البنك  مطلوب",
												}}
												render={({ field: { onChange, value } }) => (
													<Select
														name='bankId'
														value={value}
														onChange={(e) => {
															handleOnChange(e);
															onChange(e);
														}}
														sx={selectStyle}
														IconComponent={IoIosArrowDown}
														displayEmpty
														inputProps={{ "aria-label": "Without label" }}
														renderValue={(selected) => {
															if (bankAccountInfo?.bankId === "" || !selected) {
																return (
																	<p className='text-[#ADB5B9]'>اختر البنك</p>
																);
															}
															const result =
																banks?.data?.Banks?.filter(
																	(item) => item?.Value === parseInt(selected)
																) || "";
															return result[0]?.Text;
														}}>
														{banks?.data?.Banks?.map((item, index) => {
															return (
																<MenuItem
																	key={index}
																	className='souq_storge_category_filter_items'
																	sx={{
																		backgroundColor: " rgba(211, 211, 211, 1)",
																		height: "3rem",
																		"&:hover": {},
																	}}
																	value={item?.Value}>
																	{item?.Text}
																</MenuItem>
															);
														})}
													</Select>
												)}
											/>
											{(bankAccountErr?.bankId || errors?.bankId) && (
												<div className='fs-6 text-danger'>
													{bankAccountErr?.bankId}
													{errors?.bankId.message}
												</div>
											)}
										</div>
									</div>
								</div>

								<div className='row  mb-3'>
									<div className='col-12'>
										<label>
											اسم صاحب الحساب
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='inputs-wrapper'>
											<CiUser />
											<input
												type='text'
												name='bankAccountHolderName'
												id='bankAccountHolderName'
												placeholder='ادخل الاسم كما هو موجود في الحساب البنكي '
												{...register("bankAccountHolderName", {
													required: "حقل اسم صاحب الحساب مطلوب",
												})}
											/>
										</div>

										{(bankAccountErr?.bankAccountHolderName ||
											errors?.bankAccountHolderName) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.bankAccountHolderName}
												{errors?.bankAccountHolderName.message}
											</div>
										)}
									</div>
								</div>

								<div className='row  mb-3'>
									<div className='col-12'>
										<label>
											رقم الحساب
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='inputs-wrapper'>
											<BsCreditCard />
											<input
												type='text'
												name='bankAccount'
												id='bankAccount'
												placeholder='ادخل رقم الحساب البنكي الخاص بك '
												{...register("bankAccount", {
													required: "حقل  رقم الحساب البنكي مطلوب",
												})}
											/>
										</div>

										{(bankAccountErr?.bankAccount || errors?.bankAccount) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.bankAccount}
												{errors?.bankAccount.message}
											</div>
										)}
									</div>
								</div>

								<div className='row  mb-5'>
									<div className='col-12'>
										<label>
											رقم الآيبان
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='inputs-wrapper'>
											<BsCreditCard />
											<input
												type='text'
												name='iban'
												id='iban'
												placeholder='ادخل رقم الآيبان كما الخاص بالحساب البنكي '
												{...register("iban", {
													required: "حقل رقم الآيبان الحساب مطلوب",
												})}
											/>
										</div>

										{(bankAccountErr?.iban || errors?.iban) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.iban}
												{errors?.iban.message}
											</div>
										)}
									</div>
								</div>

								<div className='form-footer row d-flex justify-content-center align-items-center'>
									<div className='col-lg-4 col-6'>
										<button
											className='save-btn'
											// disabled={!bankAccountInfoHasOptions}
											type='submit'>
											حفظ
										</button>
									</div>
									<div className='col-lg-4 col-6'>
										<button
											className='close-btn'
											onClick={() => {
												dispatch(closeAddBankAccountModal());
											}}>
											إلغاء
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</Box>
			</Modal>
		</>
	);
};

const AddBankAccount = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<AddBankAccountModal />,
				document.getElementById("add-bank-account-modal")
			)}
		</Fragment>
	);
};

export default AddBankAccount;
