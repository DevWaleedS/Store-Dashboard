import React, { Fragment, useContext, useId } from "react";

// Third party
import ReactDom from "react-dom";
import { toast } from "react-toastify";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeProductOptionModal } from "../../../store/slices/ProductsSlice";

// Context
import Context from "../../../Context/context";

// Icons
import { FiPlus } from "react-icons/fi";
import { TfiWrite } from "react-icons/tfi";
import { DeleteIcon } from "../../../data/Icons";
import { IoPricetagsOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CiTimer } from "react-icons/ci";

// MUI
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

import { Switch } from "@mui/material";
import { PageHint } from "../../../components";

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

/* switch style */
const switchStyle = {
	width: "58px",
	"& .MuiSwitch-track": {
		boxShadow: "none",
		width: 35,
		height: 24,
		borderRadius: "12px",
		opacity: 1,
		border: "1px solid #dfdfdf",
		backgroundColor: "#ffff",
	},

	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		height: 20,
		borderRadius: "12px",
		border: "1px solid #dfdfdf",
		transform: "translate(5px,6px)",
		color: "#fff",
	},
	"&:hover": {
		"& .MuiSwitch-thumb": {
			boxShadow: "none",
			backgroundColor: "none",
		},
	},

	"& .MuiSwitch-switchBase": {
		padding: 1,
		"&.Mui-checked": {
			transform: "translateX(12px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#1dbbbe",
			},
		},
		"&.Mui-checked:hover": {
			backgroundColor: "transparent",
		},
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
};

/**----------------------------------------------------------------------------- */

const AddServiceOptionsModal = () => {
	const uniqueId = useId();
	const dispatch = useDispatch(false);
	const { isProductOptionOpen } = useSelector((state) => state.ProductsSlice);
	const contextStore = useContext(Context);
	const {
		productHasOptions,
		setProductHasOptions,

		optionsSection,
		setOptionsSection,
		clearOptions,
	} = contextStore;

	/** ------------------------------------------------------------- */

	//handle name of section
	const handleSetTitleInput = (e, index) => {
		const updatedPackInfoInput = [...optionsSection];
		updatedPackInfoInput[index].name = e.target.value;
		setOptionsSection(updatedPackInfoInput);
	};

	//handle value title of block
	const handleSetValueTitleInput = (e, blockIndex, valueIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex].values[valueIndex].title = e.target.value;
		setOptionsSection(updatedBlocks);
	};

	//  handle value  period of block
	const handleSetValuePeriodInput = (e, blockIndex, valueIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex].values[valueIndex].period = e.target.value;
		setOptionsSection(updatedBlocks);
	};

	// handle value  price of block
	const handleSetValuePriceInput = (e, blockIndex, valueIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex].values[valueIndex].price = e.target.value;
		setOptionsSection(updatedBlocks);
	};

	// handle value  discount_price of block
	const handleSetValueDiscountPriceInput = (e, sectionIndex, itemIndex) => {
		const value = e.target.value.replace(/[^\d.]|\.(?=.*\.)/g, "");
		const updatedAttributes = [...optionsSection];
		const price = updatedAttributes[sectionIndex].values[itemIndex].price;

		if (!price || price === "") {
			toast.error("يرجى إضافة السعر الخيار أولاً", { theme: "light" });
			return;
		}

		if (parseFloat(value) > parseFloat(price)) {
			toast.error("يجب أن يكون سعر الخصم أقل من السعر الأساسي", {
				theme: "light",
			});
			return;
		}

		updatedAttributes[sectionIndex].values[itemIndex].discount_price = value;
		setOptionsSection(updatedAttributes);
	};

	const handleAddNewBlock = () => {
		// Create a new block with default values
		const newBlock = {
			name: "",
			select_value: "نص",
			values: [
				{
					id: uniqueId + 2332,
					title: "",
					price: "",
					period: "",
					discount_price: "",
				},
			],
		};

		// Clone the existing productOptions array and add the new block
		const updatedBlocks = [...optionsSection, newBlock];

		// Update the state with the new array of blocks
		setOptionsSection(updatedBlocks);
	};

	/** handle delete options section */
	const handleDeleteBlock = (blockIndex) => {
		const updatedBlocks = optionsSection?.filter(
			(__item, index) => index !== blockIndex
		);
		setOptionsSection(updatedBlocks);
	};

	/** ---------------------------------------------- */

	/** handle save Options  */
	const saveOptions = () => {
		if (productHasOptions === true) {
			// to check if the name of option in not empty or no
			const nameNotEmpty = optionsSection?.every(
				(section) => section?.name !== ""
			);

			// to check if the qtyAttrNotEmpty of option in not empty or no
			const valuesNotEmpty = optionsSection?.every((section) =>
				section?.values?.every((value) => value?.title !== "")
			);
			// to check if the qtyAttrNotEmpty of option in not empty or no
			const periodNotEmpty = optionsSection?.every((section) =>
				section?.values?.every((value) => value?.period !== "")
			);

			if (nameNotEmpty && valuesNotEmpty && periodNotEmpty) {
				dispatch(closeProductOptionModal());
				toast.success("تم حفظ خيارات الخدمة", {
					theme: "light",
				});
			} else {
				!nameNotEmpty &&
					toast.warning("يرجى ملء حقل مسمى الخيار أولاً", {
						theme: "light",
					});
				!valuesNotEmpty &&
					toast.warning("يرجى ملء حقل سعر الخيار أولاً", {
						theme: "light",
					});
				!periodNotEmpty &&
					toast.warning("يرجى ملء حقل المدة أولاً", {
						theme: "light",
					});
			}
		} else {
			dispatch(closeProductOptionModal());
			toast.warning("  لم يتم اضافة اي خيارات ليتم حفظها", {
				theme: "light",
			});
		}
	};

	/** Handle mapping the options sections */
	const productOptionsSection = optionsSection?.map((section, sectionIndex) => (
		<section key={section?.id} className='options-section'>
			<section className='mb-4 d-flex flex-column flex-md-row justify-content-start align-items-center gap-3'>
				{optionsSection?.length > 1 && (
					<div className='delete-icon delete-option-section-icon d-flex d-md-none me-auto'>
						<DeleteIcon onClick={() => handleDeleteBlock(sectionIndex)} />
					</div>
				)}
				<div className='option-name-input d-flex justify-content-start align-items-center gap-2'>
					<div className='input-icon'>
						<TfiWrite />
					</div>
					<input
						type='text'
						placeholder='مسمى الخيارات'
						value={section?.name}
						onChange={(e) => handleSetTitleInput(e, sectionIndex)}
					/>
				</div>

				{optionsSection?.length > 1 && (
					<div className='delete-icon delete-option-section-icon d-none d-md-flex'>
						<DeleteIcon onClick={() => handleDeleteBlock(sectionIndex)} />
					</div>
				)}
			</section>

			<section className='mb-6'>
				{section?.values?.map((item, itemIndex) => (
					<>
						<section className='mb-3 d-flex flex-column flex-md-row justify-content-start align-items-md-center align-items-start gap-1 gap-md-gap-3'>
							<div
								key={item?.id}
								className={`w-100 w-md-50 option-color-input d-flex justify-content-start align-items-center`}>
								<div className='w-100 d-flex justify-content-start align-items-center gap-2 position-relative'>
									<div className='input-icon'>
										<TfiWrite />
									</div>
									<input
										type='text'
										placeholder='القيمة'
										value={item?.title}
										onChange={(e) => {
											handleSetValueTitleInput(e, sectionIndex, itemIndex);
										}}
									/>
								</div>
							</div>
							<div
								key={item?.id}
								className={`w-100 w-md-50  option-color-input d-flex justify-content-start align-items-center`}>
								<div className='w-100 d-flex justify-content-start align-items-center gap-1 position-relative'>
									<div className='input-icon'>
										<CiTimer />
									</div>
									<input
										type='text'
										placeholder='مدة التنفيذ'
										value={item?.period}
										onChange={(e) => {
											handleSetValuePeriodInput(e, sectionIndex, itemIndex);
										}}
									/>
									<div className='input-type'>يوم</div>
								</div>
							</div>
						</section>

						<section className='mb-3  d-flex flex-column flex-md-row justify-content-start align-items-md-center align-items-start gap-1 gap-md-gap-3'>
							<div
								key={item?.id}
								className=' w-100 w-md-50 option-color-input d-flex justify-content-start align-items-center'>
								<div className='w-100 d-flex justify-content-start align-items-center gap-2 position-relative'>
									<div className='input-icon'>
										<IoPricetagsOutline />
									</div>
									<input
										type='text'
										placeholder={`سعر الخيار`}
										value={item?.price}
										onChange={(e) => {
											handleSetValuePriceInput(e, sectionIndex, itemIndex);
										}}
									/>
									<div className='input-type'>ر.س</div>
								</div>
							</div>

							<div
								key={item?.id}
								className='w-100 w-md-50 option-color-input d-flex justify-content-start align-items-center '>
								<div className='w-100 d-flex justify-content-start align-items-center gap-1 position-relative'>
									<div className='input-icon'>
										<IoPricetagsOutline />
									</div>
									<input
										type='text'
										placeholder={`السعر بعد الخصم `}
										value={item?.discount_price}
										onChange={(e) => {
											handleSetValueDiscountPriceInput(
												e,
												sectionIndex,
												itemIndex
											);
										}}
									/>
									<div className='input-type'>ر.س</div>
								</div>
							</div>
						</section>
					</>
				))}
			</section>
		</section>
	));
	/** ----------------------------------------------------------------------------------------------------------------------------- */

	return (
		<>
			<Modal open={isProductOptionOpen}>
				<Box component={"div"} sx={style}>
					<div
						className='add-form-wrapper product-options bg-white position-relative'
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
										إدارة خيارات الخدمة
									</h5>

									<div className='close-icon-video-modal ps-2'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={() => {
												dispatch(closeProductOptionModal());
												clearOptions();
											}}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='form-body bg-white'>
							<div className='row  mb-2'>
								<div className='col-12 '>
									<PageHint
										hint={`بإمكانك إدارة خيارات الخدمة`}
										flex={
											"d-flex justify-content-start align-items-center gap-2"
										}
									/>
								</div>
							</div>

							<div className='row mb-2'>
								<div className='col-12'>
									<div className='d-flex justify-content-start align-items-center  active-options-switch'>
										<Switch
											sx={switchStyle}
											checked={productHasOptions}
											onChange={() => setProductHasOptions(!productHasOptions)}
										/>
										<span className='switch-label'>تفعيل خيارات الخدمة</span>
									</div>
								</div>
							</div>

							<section
								className={`${
									productHasOptions ? "d-flex" : "d-none"
								} row mb-4`}>
								<div className='col-12 mb-4'>
									{/* the product options section */}
									{productOptionsSection}

									<div>
										<button
											onClick={handleAddNewBlock}
											className='w-100 add-new-option-section-btn d-flex justify-content-center align-items-center cursor-pointer'>
											<FiPlus className='add-icon' />
											اضافة خيار جديد
										</button>
									</div>
								</div>
							</section>
						</div>

						<div
							className='form-footer bg-white'
							style={{ borderRadius: "0 0 16px 16px" }}>
							<div className='row d-flex justify-content-center align-items-center'>
								<div className='col-lg-4 col-6'>
									<button
										className='save-btn'
										disabled={!productHasOptions}
										onClick={() => saveOptions()}>
										حفظ
									</button>
								</div>
								<div className='col-lg-4 col-6'>
									<button
										className='close-btn'
										onClick={() => {
											dispatch(closeProductOptionModal());
											clearOptions();
										}}>
										إلغاء
									</button>
								</div>
							</div>
						</div>
					</div>
				</Box>
			</Modal>
		</>
	);
};

const AddServiceOptions = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<AddServiceOptionsModal />,
				document.getElementById("product-option")
			)}
		</Fragment>
	);
};

export default AddServiceOptions;
