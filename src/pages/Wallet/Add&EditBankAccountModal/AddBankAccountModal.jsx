import React, { Fragment, useContext, useState } from "react";

// Third party
import axios from "axios";
import ReactDom from "react-dom";
import { toast } from "react-toastify";

import { useDropzone } from "react-dropzone";

// Context
import Context from "../../../Context/context";
import { LoadingContext } from "../../../Context/LoadingProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";

import MenuItem from "@mui/material/MenuItem";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeAddBankAccountModal } from "../../../store/slices/AddBankAccountModal";
import { openMessageAlert } from "../../../store/slices/BankAccountAlert";

// Icons
import { CiUser, CiBank } from "react-icons/ci";
import { BsCreditCard } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { IoMdInformationCircleOutline, IoIosArrowDown } from "react-icons/io";

import { useForm } from "react-hook-form";

import useFetch from "../../../Hooks/UseFetch";

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

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [bankAccountInfo, setBankAccountInfo] = useState({
		bankId: "",
		bankAccountHolderName: "",
		bankAccount: "",
		iban: "",
		supplierCode: "",
		civil_id: "",
		bankAccountLetter: "",
		website_image: "",
	});

	const {
		register,
		handleSubmit,
		reset,
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

	/** handle onchange function  */
	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setBankAccountInfo((prevAccounts) => {
			return { ...prevAccounts, [name]: value };
		});
	};

	/** ---------------- handle errors ----------------------------  */

	const [bankAccountErr, setBankAccountErr] = useState({
		bankId: "",
		bankAccountHolderName: "",
		bankAccount: "",
		iban: "",
		supplierCode: "",
		civil_id: "",
		bankAccountLetter: "",
		website_image: "",
	});

	const resetErrors = () => {
		setBankAccountErr({
			bankId: "",
			bankAccountHolderName: "",
			bankAccount: "",
			iban: "",
			supplierCode: "",
			civil_id: "",
			bankAccountLetter: "",
			website_image: "",
		});
	};

	const restValues = () => {
		reset(bankAccountInfo);
		setBankAccountInfo({
			bankId: "",
			bankAccountHolderName: "",
			bankAccount: "",
			iban: "",
			supplierCode: "",
			civil_id: "",
			bankAccountLetter: "",
			website_image: "",
		});
	};

	/** ----------------------------------------------------------- */

	//  Handler upload bank account docs
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;

	const handleFileUpload = (
		acceptedFiles,
		fileType,
		setBankAccountErr,
		setBankAccountInfo,
		toast
	) => {
		const updatedFile = acceptedFiles?.map((file) => {
			const isSizeValid = file.size <= maxFileSize;
			const errorMessage = "حجم الملف يجب أن لا يزيد عن 1 ميجابايت.";
			setBankAccountErr({ ...bankAccountErr, [fileType]: "" });

			if (!isSizeValid) {
				toast.warning(errorMessage, {
					theme: "light",
				});
				setBankAccountErr({
					...bankAccountErr,
					[fileType]: errorMessage,
				});
				setBankAccountInfo({
					...bankAccountInfo,
					[fileType]: "",
				});
			} else {
				setBankAccountErr({
					...bankAccountErr,
					[fileType]: null,
				});
			}

			return isSizeValid
				? Object.assign(file, { preview: URL.createObjectURL(file) })
				: null;
		});

		setBankAccountInfo({
			...bankAccountInfo,
			[fileType]: updatedFile?.filter((file) => file !== null),
		});
	};

	// handle CivilIdUploader
	const CivilIdUploader = () => {
		const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
			onDrop: (files) =>
				handleFileUpload(
					files,
					"civil_id",
					setBankAccountErr,
					setBankAccountInfo,
					toast
				),
		});

		return (
			<>
				{" "}
				<div
					{...getRootProps({
						className:
							"inputs-wrapper upload-civil-id mb-1 d-flex justify-content-between",
					})}>
					<div>
						<BsFileEarmarkArrowUp />
						{bankAccountInfo?.civil_id[0]?.name ? (
							<span className='tax-text docs-file-name pe-2'>
								{bankAccountInfo?.civil_id[0]?.name}
							</span>
						) : (
							<span className='tax-text pe-2'>ارفق صورة من الهوية الوطنية</span>
						)}
					</div>

					<input
						{...getInputProps()}
						id='upload-docs-input'
						name='upload-docs-input'
					/>

					<FaCloudUploadAlt />
				</div>
			</>
		);
	};

	// handle BankAccountLetterUploader
	const BankAccountLetterUploader = () => {
		const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
			accept: {
				"application/pdf": [".pdf"],
			},
			onDrop: (files) =>
				handleFileUpload(
					files,
					"bankAccountLetter",
					setBankAccountErr,
					setBankAccountInfo,
					toast
				),
		});

		return (
			<>
				{" "}
				<div
					{...getRootProps({
						className:
							"inputs-wrapper upload-civil-id mb-1 d-flex justify-content-between",
					})}>
					<div>
						<BsFileEarmarkArrowUp />
						{bankAccountInfo?.bankAccountLetter[0]?.name ? (
							<span className='tax-text docs-file-name pe-2'>
								{bankAccountInfo?.bankAccountLetter[0]?.name}
							</span>
						) : (
							<span className='tax-text pe-2'>
								ارفق شهادة الايبان بالحساب البنكي pdf
							</span>
						)}
					</div>

					<input
						{...getInputProps()}
						id='upload-docs-input'
						name='upload-docs-input'
					/>

					<FaCloudUploadAlt />
				</div>
			</>
		);
	};

	// handle WebsiteImageUploader
	const WebsiteImageUploader = () => {
		const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
			onDrop: (files) =>
				handleFileUpload(
					files,
					"website_image",
					setBankAccountErr,
					setBankAccountInfo,
					toast
				),
		});

		return (
			<>
				{" "}
				<div
					{...getRootProps({
						className:
							"inputs-wrapper upload-civil-id mb-1 d-flex justify-content-between",
					})}>
					<div>
						<BsFileEarmarkArrowUp />
						{bankAccountInfo?.website_image[0]?.name ? (
							<span className='tax-text docs-file-name pe-2'>
								{bankAccountInfo?.website_image[0]?.name}
							</span>
						) : (
							<span className='tax-text pe-2'>
								صورة واضحة من الصفحة الرئيسية للمتجر
							</span>
						)}
					</div>

					<input
						{...getInputProps()}
						id='upload-docs-input'
						name='upload-docs-input'
					/>

					<FaCloudUploadAlt />
				</div>
			</>
		);
	};

	/** handle save Options  */
	const addBankAccount = (data) => {
		setLoadingTitle("جاري اضافة الحساب البنكي");
		resetErrors();

		let formData = new FormData();
		formData.append("bankId", data?.bankId);
		formData.append("bankAccountHolderName", data?.bankAccountHolderName);
		formData.append("bankAccount", data?.bankAccount);
		formData.append("iban", `SA${data?.iban}`);
		formData.append("civil_id", bankAccountInfo?.civil_id[0]);
		formData.append("bankAccountLetter", bankAccountInfo?.bankAccountLetter[0]);
		formData.append("website_image", bankAccountInfo?.website_image[0]);

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
					dispatch(openMessageAlert(res?.data?.message?.ar));

					setReload(!reload);
					dispatch(closeAddBankAccountModal());
					restValues();
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
					toast.error(res?.data?.message?.ar, {
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
										اضافة حساب بنكي
									</h5>

									<div className='close-icon-video-modal ps-2'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={() => {
												dispatch(closeAddBankAccountModal());
												restValues();
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
										<span>
											يجب كتابة البيانات الصحيحة ليتم رفعها للجهات المختصة
										</span>
									</div>
								</div>
							</div>

							<form onSubmit={handleSubmit(addBankAccount)}>
								<div className='row  mb-3'>
									<div className='col-12'>
										<label>
											البنك
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='inputs-wrapper'>
											<CiBank />
											<Select
												name='bankId'
												displayEmpty
												control={control}
												sx={selectStyle}
												value={bankAccountInfo?.bankId}
												{...register("bankId", {
													required: "حقل اختيار البنك  مطلوب",
												})}
												onChange={(e) => {
													handleOnChange(e);
												}}
												IconComponent={IoIosArrowDown}
												inputProps={{ "aria-label": "Without label" }}
												renderValue={(selected) => {
													if (bankAccountInfo?.bankId === "" || !selected) {
														return <p className='text-[#ADB5B9]'>اختر البنك</p>;
													}
													const result =
														banks?.data?.Banks?.filter(
															(item) => item?.bankId === parseInt(selected)
														) || "";
													return result[0]?.name_ar;
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
															value={item?.bankId}>
															{item?.name_ar}
														</MenuItem>
													);
												})}
											</Select>
										</div>
										{(bankAccountErr?.bankId || errors?.bankId) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.bankId}
												{errors?.bankId.message}
											</div>
										)}
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
													pattern: {
														value: /^[a-zA-Z\s]*$/,
														message: "الاسم يجب ان يكون باللغه الانجليزيه",
													},
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
												maxLength={22}
												placeholder='12345678923456789'
												{...register("iban", {
													required: "حقل رقم آيبان الحساب مطلوب",
												})}
												style={{ direction: "ltr" }}
											/>
											<span className='sa-iban-hint d-flex justify-content-center align-content-center flex-wrap'>
												SA
											</span>
										</div>

										{(bankAccountErr?.iban || errors?.iban) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.iban}
												{errors?.iban.message}
											</div>
										)}
									</div>
								</div>

								{/* CivilIdUploader */}
								<div className='row  mb-5'>
									<div className='col-12'>
										<label>
											الهوية الوطنية
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='tax-text'>الحد الأقصى للملف 1MB</div>

										<CivilIdUploader
											bankAccountInfo={bankAccountInfo}
											bankAccountErr={bankAccountErr}
											setBankAccountInfo={setBankAccountInfo}
											setBankAccountErr={setBankAccountErr}
											toast={toast}
										/>

										{(bankAccountErr?.civil_id || errors?.civil_id) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.civil_id}
												{errors?.civil_id.message}
											</div>
										)}
									</div>
								</div>

								{/* BankAccountLetterUploader */}
								<div className='row  mb-5'>
									<div className='col-12'>
										<label>
											شهادة الآيبان
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='tax-text'>الحد الأقصى للملف 1MB</div>

										<BankAccountLetterUploader
											bankAccountInfo={bankAccountInfo}
											bankAccountErr={bankAccountErr}
											setBankAccountInfo={setBankAccountInfo}
											setBankAccountErr={setBankAccountErr}
											toast={toast}
										/>

										{(bankAccountErr?.bankAccountLetter ||
											errors?.bankAccountLetter) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.bankAccountLetter}
												{errors?.bankAccountLetter.message}
											</div>
										)}
									</div>
								</div>

								{/* WebsiteImageUploader */}
								<div className='row  mb-5'>
									<div className='col-12'>
										<label>
											صورة من المتجر الخاص بك
											<span className='important-hint'>*</span>{" "}
										</label>
									</div>
									<div className='col-12'>
										<div className='tax-text'>الحد الأقصى للملف 1MB</div>

										<WebsiteImageUploader
											bankAccountInfo={bankAccountInfo}
											bankAccountErr={bankAccountErr}
											setBankAccountInfo={setBankAccountInfo}
											setBankAccountErr={setBankAccountErr}
											toast={toast}
										/>

										{(bankAccountErr?.website_image ||
											errors?.website_image) && (
											<div className='fs-6 text-danger'>
												{bankAccountErr?.website_image}
												{errors?.website_image.message}
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
												restValues();
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
