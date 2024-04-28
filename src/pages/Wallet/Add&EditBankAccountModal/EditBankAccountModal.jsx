import React, { Fragment, useContext, useEffect, useState } from "react";

// Third party

import ReactDom from "react-dom";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";

// Context
import { LoadingContext } from "../../../Context/LoadingProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";

import MenuItem from "@mui/material/MenuItem";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeEditBankAccountModal } from "../../../store/slices/EditBankAccountModal";
import { openMessageAlert } from "../../../store/slices/BankAccountAlert";

// Icons
import { CiUser, CiBank } from "react-icons/ci";
import { BsCreditCard } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { IoMdInformationCircleOutline, IoIosArrowDown } from "react-icons/io";

// RTK Query
import { useGetBanksQuery } from "../../../store/apiSlices/selectorsApis/selectBanksApi";
import {
	useShowBankAccountQuery,
	useEditBankAccountMutation,
} from "../../../store/apiSlices/walletApi.js";

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

const EditBankAccountModal = () => {
	// get banks selector
	const { data: banks } = useGetBanksQuery();

	//show bank account data
	const { data: bankAccount, isLoading } = useShowBankAccountQuery();

	const dispatch = useDispatch(false);
	const { isEditBankAccountModalOpen } = useSelector(
		(state) => state.EditBankAccountModal
	);

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [bankAccountInfo, setBankAccountInfo] = useState({
		bankId: "",
		bankAccountHolderName: "",
		bankAccount: "",
		iban: "",
		supplierCode: "",
		civil_id: "",
		currentCivilIdFile: "",

		bankAccountLetter: "",
		currentBankAccountLetterFile: "",

		website_image: "",
		currentWebsiteImageFile: "",
	});

	useEffect(() => {
		if (bankAccount) {
			setBankAccountInfo({
				...bankAccountInfo,
				bankId: bankAccount?.supplierUser?.bankId || "",
				bankAccountHolderName:
					bankAccount?.supplierUser?.bankAccountHolderName || "",
				bankAccount: bankAccount?.supplierUser?.bankAccount || "",
				iban: bankAccount?.supplierUser?.iban?.startsWith("SA")
					? bankAccount?.supplierUser?.iban.slice(2)
					: bankAccount?.supplierUser?.iban || "",

				currentCivilIdFile: bankAccount?.SupplierDocumentUser[0]?.file || "",
				currentBankAccountLetterFile:
					bankAccount?.SupplierDocumentUser[1]?.file || "",
				currentWebsiteImageFile:
					bankAccount?.SupplierDocumentUser[2]?.file || "",
			});
		}
	}, [bankAccount]);

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

	// To Handle Errors
	useEffect(() => {
		reset(bankAccountInfo);
	}, [bankAccountInfo, reset]);
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
							<span className='tax-text pe-2'>
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
							<span className='tax-text pe-2'>
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
							<span className='tax-text pe-2'>
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

	/** handle edit bank account   */
	const [editBankAccount] = useEditBankAccountMutation();
	const handleEditBankAccount = async (data) => {
		setLoadingTitle("جاري تعديل بيانات الحساب البنكي");
		resetErrors();

		// data that send to api...
		let formData = new FormData();
		formData.append("bankId", data?.bankId);
		formData.append("bankAccountHolderName", data?.bankAccountHolderName);
		formData.append("bankAccount", data?.bankAccount);
		formData.append("iban", `SA${data?.iban}`);

		if (bankAccountInfo?.civil_id?.length !== 0)
			formData.append("civil_id", bankAccountInfo?.civil_id[0]);

		if (bankAccountInfo?.bankAccountLetter?.length !== 0)
			formData.append(
				"bankAccountLetter",
				bankAccountInfo?.bankAccountLetter[0]
			);

		if (bankAccountInfo?.website_image?.length !== 0)
			formData.append("website_image", bankAccountInfo?.website_image[0]);

		// make request...
		try {
			const response = await editBankAccount({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				dispatch(openMessageAlert(response?.data?.message?.ar));

				dispatch(closeEditBankAccountModal());
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
				setBankAccountErr({
					bankId: response?.data?.message?.en?.bankId?.[0],
					bankAccountHolderName:
						response?.data?.message?.en?.bankAccountHolderName?.[0],
					bankAccount: response?.data?.message?.en?.bankAccount?.[0],
					iban: response?.data?.message?.en?.iban?.[0],
					supplierCode: response?.data?.message?.en?.supplierCode?.[0],
				});
				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error changing addBankAccount:", error);
		}
	};

	return (
		<>
			<Modal open={isEditBankAccountModalOpen}>
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
										تعديل بيانات الحساب البنكي
									</h5>

									<div className='close-icon-video-modal ps-2'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={() => {
												dispatch(closeEditBankAccountModal());
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

							<form onSubmit={handleSubmit(handleEditBankAccount)}>
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
																banks?.filter(
																	(item) => item?.bankId === parseInt(selected)
																) || "";

															return result[0]?.name_ar;
														}}>
														{banks?.map((item, index) => {
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
												)}
											/>
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
										{bankAccountInfo?.currentCivilIdFile ? (
											<div className='d-flex justify-content-between'>
												<div className='tax-text'>الحد الأقصى للملف 1MB</div>
												<div className='tax-text'>
													<a
														href={bankAccountInfo?.currentCivilIdFile}
														download={bankAccountInfo?.currentCivilIdFile}
														target='_blank'
														rel='noreferrer'>
														تحميل الملف الحالي{" "}
													</a>
												</div>
											</div>
										) : (
											<div className='tax-text'>الحد الأقصى للملف 1MB</div>
										)}

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
										{bankAccountInfo?.currentBankAccountLetterFile ? (
											<div className='d-flex justify-content-between'>
												<div className='tax-text'>الحد الأقصى للملف 1MB</div>
												<div className='tax-text'>
													<a
														href={bankAccountInfo?.currentBankAccountLetterFile}
														download={
															bankAccountInfo?.currentBankAccountLetterFile
														}
														target='_blank'
														rel='noreferrer'>
														تحميل الملف الحالي{" "}
													</a>
												</div>
											</div>
										) : (
											<div className='tax-text'>الحد الأقصى للملف 1MB</div>
										)}

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
										{bankAccountInfo.currentWebsiteImageFile ? (
											<div className='d-flex justify-content-between'>
												<div className='tax-text'>الحد الأقصى للملف 1MB</div>
												<div className='tax-text'>
													<a
														href={bankAccountInfo?.currentWebsiteImageFile}
														download={bankAccountInfo?.currentWebsiteImageFile}
														target='_blank'
														rel='noreferrer'>
														تحميل الملف الحالي{" "}
													</a>
												</div>
											</div>
										) : (
											<div className='tax-text'>الحد الأقصى للملف 1MB</div>
										)}

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
											disabled={isLoading}
											className='save-btn'
											type='submit'>
											تعديل بيانات الحساب
										</button>
									</div>
									<div className='col-lg-4 col-6'>
										<button
											className='close-btn'
											onClick={() => {
												dispatch(closeEditBankAccountModal());
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

const EditBankAccount = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<EditBankAccountModal />,
				document.getElementById("add-bank-account-modal")
			)}
		</Fragment>
	);
};

export default EditBankAccount;
