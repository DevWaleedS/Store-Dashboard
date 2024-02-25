import React, { Fragment, useContext, useEffect, useState } from "react";

// Third party

import ReactDom from "react-dom";
import { toast } from "react-toastify";
import { SketchPicker } from "react-color";
import ImageUploading from "react-images-uploading";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeProductOptionModal } from "../../../store/slices/ProductOptionModal";

// Context
import Context from "../../../Context/context";

// Icons
import { FiPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { MdStorage } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteIcon } from "../../../data/Icons";
import { IoPricetagsOutline } from "react-icons/io5";
import {
	AiOutlineCloseCircle,
	AiOutlinePlus,
	AiOutlineMinus,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { IoMdInformationCircleOutline, IoIosArrowDown } from "react-icons/io";

// MUI
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { FaRegSquarePlus } from "react-icons/fa6";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Switch } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ToggleButton from "@mui/material/ToggleButton";

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

/** product options According  */
const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	backgroundColor: "transparent",
	marginBottom: "10px",

	"&:not(:last-child)": {
		borderBottom: 0,
		marginBottom: "10px",
	},
	"&:before": {
		display: "none",
	},
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
	({ theme }) => ({
		width: "100%",
		backgroundColor: "#baf3e6",
		borderRadius: "4px 4px 0 0",
		flexDirection: "row-reverse",

		"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
			display: "none",
		},
		"& .MuiAccordionSummary-content": {
			marginLeft: theme.spacing(1),
		},
	})
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: "12px ",
	border: "1px solid #1dbbbe",
	borderTop: "none",
	borderRadius: "0 0 4px 4px",
}));

const select_value_options = ["نص", "نص و لون", "نص و صورة"];

const AddProductOptionsModal = () => {
	const { isProductOptionOpen } = useSelector(
		(state) => state.ProductOptionModal
	);

	const dispatch = useDispatch(false);

	const contextStore = useContext(Context);
	const {
		productHasOptions,
		setProductHasOptions,

		attributes,
		setAttributes,
		optionsSection,
		setOptionsSection,
	} = contextStore;
	const [showColorPicker, setShowColorPicker] = useState(null);

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");

	const handleCancel = () => {
		setPreviewOpen(false);
		setPreviewImage("");
	};

	/** preview product image */
	const ProductImageModal = () => {
		return (
			<>
				<div onClick={handleCancel} className='imageprev-modal'></div>
				<div className='ProductImageModal-content'>
					<CloseIcon className='close_video_icon' onClick={handleCancel} />
					<div className='product-option-img-wrap'>
						<img src={previewImage} alt='' />
					</div>
				</div>
			</>
		);
	};

	/** ------------------------------------------------------------- */
	const handleChangeImage = (e, blockIndex, valueIndex) => {
		const updatedBlocks = [...optionsSection];

		updatedBlocks[blockIndex].values[valueIndex].image = e[0]?.file;
		updatedBlocks[blockIndex].values[valueIndex].previewImage = e[0]?.data_url;
		setOptionsSection(updatedBlocks);
	};

	const handleDeleteImages = (e, blockIndex, valueIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex].values[valueIndex].image = "";
		updatedBlocks[blockIndex].values[valueIndex].previewImage = "";

		setOptionsSection(updatedBlocks);
	};

	// ----------------------------------------------------------------

	/** Create Product options according  */
	const [expanded, setExpanded] = useState(false);
	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	//handle name of section
	const handleSetTitleInput = (e, index) => {
		const updatedPackInfoInput = [...optionsSection];
		updatedPackInfoInput[index].name = e.target.value;
		setOptionsSection(updatedPackInfoInput);
	};

	//handle value selected value of section
	const handleSetSelectValue = (e, index) => {
		const updatedPackInfoInput = [...optionsSection];
		updatedPackInfoInput[index].select_value = e.target.value;
		setOptionsSection(updatedPackInfoInput);
	};

	//handle value title of block
	const handleSetValueTitleInput = (e, blockIndex, valueIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex].values[valueIndex].title = e.target.value;
		setOptionsSection(updatedBlocks);

		// Generate Attributes
		const newAttributes = generateAttributes(updatedBlocks);
		setAttributes(newAttributes);
	};

	//handle default value of block
	const handleSetValueDefaultOption = (value, blockIndex, valueIndex) => {
		const updatedBlocks = optionsSection?.map((block, currentIndex) => {
			if (currentIndex === blockIndex) {
				const updatedValues = block?.values?.map((valueObj, index) => {
					if (index === valueIndex) {
						return {
							...valueObj,
							defaultOption: value,
						};
					}
					return {
						...valueObj,
						defaultOption: false,
					};
				});

				return {
					...block,
					values: updatedValues,
				};
			}

			return block;
		});

		setOptionsSection(updatedBlocks);
	};

	//handle value color of block
	const handleSetValueColorInput = (e, blockIndex, valueIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex].values[valueIndex].color = e.hex;
		setOptionsSection(updatedBlocks);
	};

	//handle add new value to block
	const handleAddNewValue = (blockIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex].values.push({
			id: updatedBlocks[blockIndex].values.length + 1,
			title: "",
			color: "#000000",
			image: "",
			previewImage: "",
			defaultOption: false,
		});
		setOptionsSection(updatedBlocks);
	};

	const handleDeleteValue = (valueIndex, blockIndex) => {
		const updatedBlocks = [...optionsSection];
		updatedBlocks[blockIndex]?.values?.splice(valueIndex, 1);
		setOptionsSection(updatedBlocks);
		// Generate new Attributes based on the updated productOptions
		const newAttributes = generateAttributes(updatedBlocks);
		setAttributes(newAttributes);
	};

	const handleAddNewBlock = () => {
		// Create a new block with default values
		const newBlock = {
			name: "",
			select_value: "نص",
			values: [
				{
					id: 1,
					title: "",
					color: "#000000",
					image: "",
					previewImage: "",
					defaultOption: false,
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
		// Generate new Attributes based on the updated productOptions
		const newAttributes = generateAttributes(updatedBlocks);
		setAttributes(newAttributes);
	};

	const generateAttributes = (blocks) => {
		const attributes = [];

		const backtrack = (currentAttribute, blockIndex) => {
			if (blockIndex === blocks.length) {
				attributes.push({
					values: [...currentAttribute],
					qty: 0,
				});
				return;
			}

			const block = blocks[blockIndex];

			for (const value of block.values) {
				currentAttribute[blockIndex] = {
					id: blockIndex,
					title: value.title,
					isDefaultOption: value.defaultOption,
				};
				backtrack(currentAttribute, blockIndex + 1);
			}
		};

		backtrack(new Array(blocks.length), 0);

		return attributes;
	};

	const addPriceToAttributes = (e, blockIndex) => {
		const updatedAttributes = [...attributes];
		updatedAttributes[blockIndex].price = Number(
			e.target.value.replace(/[^0-9]/g, "")
		);
		setAttributes(updatedAttributes);
	};

	/** handle add discount_price for attr */
	const addDiscountPrice = (e, blockIndex) => {
		const updatedAttributes = [...attributes];

		updatedAttributes[blockIndex].discount_price = Number(
			e.target.value.replace(/[^0-9]/g, "")
		);
		setAttributes(updatedAttributes);
	};

	const changeQtyToAttributes = (e, blockIndex) => {
		const updatedAttributes = [...attributes];
		updatedAttributes[blockIndex].qty = Number(
			e.target.value.replace(/[^0-9]/g, "")
		);
		setAttributes(updatedAttributes);
	};

	const increaseQtyToAttributes = (blockIndex) => {
		const updatedAttributes = [...attributes];
		updatedAttributes[blockIndex].qty += 1;
		setAttributes(updatedAttributes);
	};

	const decreaseQtyToAttributes = (blockIndex) => {
		const updatedAttributes = [...attributes];
		if (updatedAttributes[blockIndex].qty > 0) {
			updatedAttributes[blockIndex].qty -= 1;
			setAttributes(updatedAttributes);
		}
	};

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

			// to check if the one of some option is default
			const notSelectDefaultOption = optionsSection?.every((section) =>
				section?.values?.some((value) => value?.defaultOption === true)
			);

			// to check if the qtyAttrNotEmpty of option in not empty or no
			const priceAttrNotEmpty = attributes?.every((attr) => attr?.price !== 0);

			// to check if the qtyAttrNotEmpty of option in not empty or no
			const qtyAttrNotEmpty = attributes?.every((attr) => attr?.qty !== 0);

			if (
				nameNotEmpty &&
				valuesNotEmpty &&
				notSelectDefaultOption &&
				priceAttrNotEmpty &&
				qtyAttrNotEmpty
			) {
				dispatch(closeProductOptionModal());
				toast.success("تم حفظ خيارات المنتج", {
					theme: "light",
				});
			} else {
				!nameNotEmpty &&
					toast.warning("يرجى ملء حقل مسمى الخيار أولاً", {
						theme: "light",
					});
				!valuesNotEmpty &&
					toast.warning("يرجى ملء حقل القيمة أولاً", {
						theme: "light",
					});
				!notSelectDefaultOption &&
					toast.warning("يرجى تعيين قيمة افتراضية أولاً", {
						theme: "light",
					});
				!priceAttrNotEmpty &&
					toast.warning("يرجى ملء حقل السعر أولاً", {
						theme: "light",
					});
				!qtyAttrNotEmpty &&
					toast.warning("يرجى ملء حقل الكمية أولاً", {
						theme: "light",
					});
			}
		} else {
			dispatch(closeProductOptionModal());
			toast.warning("  لم يتم اضافه اي خيارات ليتم حفظها", {
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
						placeholder='مسمى الخيار (مثل اللون، القياس)'
						value={section?.name}
						onChange={(e) => handleSetTitleInput(e, sectionIndex)}
					/>
				</div>
				<div className='option-select-input d-flex justify-content-start align-items-center gap-2'>
					<Select
						value={section?.select_value}
						IconComponent={() => {
							return <IoIosArrowDown size={"1rem"} />;
						}}
						onChange={(e) => handleSetSelectValue(e, sectionIndex)}
						displayEmpty
						inputProps={{ "aria-label": "Without label" }}
						renderValue={(selected) => {
							return selected;
						}}
						className={"font-medium"}
						sx={{
							height: "100%",
							pl: "1rem",
							width: "100%",

							"& .MuiSelect-select.MuiSelect-outlined": {
								p: 0,
								display: "flex",
								alignItems: "center",
							},
							"& .MuiOutlinedInput-notchedOutline": {
								border: "none",
							},
							"&  svg": {
								display: "block",
							},
						}}>
						{select_value_options?.map((option, index) => (
							<MenuItem
								key={index}
								className='souq_storge_category_filter_items '
								sx={{
									backgroundColor: "#FAFAFA",
									color: "#011723",
									"ul:has(&) li:hover": {
										backgroundColor: "#B4EDEE",
									},
									height: "3rem",
									"&:hover": {},
								}}
								value={`${option}`}>
								{option}
							</MenuItem>
						))}
					</Select>
				</div>
				{optionsSection?.length > 1 && (
					<div className='delete-icon delete-option-section-icon d-none d-md-flex'>
						<DeleteIcon onClick={() => handleDeleteBlock(sectionIndex)} />
					</div>
				)}
			</section>

			<section className='mb-6'>
				{section?.values?.map((item, itemIndex) => (
					<section
						key={item?.id}
						className='mb-3 d-flex justify-content-start align-items-center gap-3'>
						<div className='option-color-input d-flex justify-content-start align-items-center gap-2'>
							<ToggleButton
								title='تعيينه كخيار افتراضي'
								value='check'
								selected={item?.defaultOption}
								onChange={() => {
									handleSetValueDefaultOption(true, sectionIndex, itemIndex);
								}}>
								<CheckIcon />
							</ToggleButton>
							<div className='input-icon'>
								<TfiWrite />
							</div>
							<input
								type='text'
								placeholder={`القيمة ${itemIndex + 1}`}
								value={item?.title}
								onChange={(e) => {
									handleSetValueTitleInput(e, sectionIndex, itemIndex);
								}}
							/>
							{section?.select_value === "نص و لون" && (
								<div
									onClick={() => {
										setShowColorPicker(item?.id);
									}}
									style={{
										position: "absolute",
										left: "15px",
										width: "1.5rem",
										height: "1.5rem",
										backgroundColor: item?.color,
										borderRadius: "50%",
										cursor: "pointer",
										border: item?.color === "#ffffff" ? "1px solid #d4d4d4" : "none"
									}}></div>
							)}
							{showColorPicker === item?.id &&
								section?.select_value === "نص و لون" && (
									<div
										style={{
											position: "absolute",
											left: "0",
											bottom: "0",
											zIndex: "50",
											transform: "translateY(100%)",
										}}>
										<SketchPicker
											color={item?.color}
											onChange={(e) => {
												handleSetValueColorInput(e, sectionIndex, itemIndex);
											}}></SketchPicker>
										<div
											style={{
												position: "absolute",
												top: "0",
												right: "0",
												zIndex: "50",
												transform: "translateY(-100%)",
											}}>
											<TiDeleteOutline
												onClick={() => {
													setShowColorPicker(null);
												}}
												size={"1.5rem"}
												color={"#000000"}></TiDeleteOutline>
										</div>
									</div>
								)}
							{section?.select_value === "نص و صورة" && (
								<>
									<ImageUploading
										value={item?.image}
										onChange={(e) => {
											handleChangeImage(e, sectionIndex, itemIndex);
										}}
										maxNumber={1}
										dataURLKey='data_url'
										acceptType={["jpg", "png", "jpeg"]}
										allowNonImageType={true}>
										{({
											imageList,
											onImageUpload,
											onImageRemoveAll,
											onImageUpdate,
											onImageRemove,
											isDragging,
											dragProps,
										}) =>
											item?.previewImage ? (
												<>
													<div className='product-options-img-wrapper d-flex justify-content-center align-items-center gap-2 px-2'>
														<div className='item-previewImage'>
															<img src={item?.previewImage} alt='' />
														</div>
														<div className='d-flex justify-content-center align-items-center gap-2 '>
															<FaEye
																className='prev-img-icon'
																onClick={() => {
																	setPreviewOpen(true);
																	setPreviewImage(item?.previewImage);
																}}
															/>
															<CloseIcon
																className='prev-img-icon'
																onClick={(e) => {
																	handleDeleteImages(
																		e,
																		sectionIndex,
																		itemIndex
																	);
																}}
															/>
														</div>
													</div>
												</>
											) : (
												<button
													type='button'
													onClick={onImageUpload}
													className='w-full h-full flex justify-center items-center add-product-image'>
													استعراض...
												</button>
											)
										}
									</ImageUploading>
								</>
							)}
						</div>

						{section?.values?.length > 1 && (
							<div className='delete-icon '>
								<DeleteIcon
									onClick={() => {
										handleDeleteValue(itemIndex, sectionIndex);
									}}
								/>
							</div>
						)}
					</section>
				))}

				{/* Add more item button */}
				<div>
					<button
						onClick={() => handleAddNewValue(sectionIndex)}
						className='w-100 add-new-value-btn d-flex justify-content-center align-items-center cursor-pointer'>
						<FiPlus className='add-icon' />
						إضافة قيمة جديدة
					</button>
				</div>
			</section>
		</section>
	));
	/** ----------------------------------------------------------------------------------------------------------------------------- */

	/** product Options According */
	const attributesAccording = attributes?.map((attribute, attributeIndex) => (
		<>
			<section
				key={attributeIndex}
				className=' flex justify-start items-center gap-3 mb-3 products-attr'>
				<Accordion
					expanded={expanded === attributeIndex}
					onChange={handleChange(attributeIndex)}>
					<AccordionSummary
						aria-controls={`${attributeIndex}-content`}
						id={`${attributeIndex}-header`}
						expandIcon={
							<FaRegSquarePlus
								style={{
									fontSize: "1.2rem",
									fill: "#023855",
									marginLeft: "5px",
								}}
							/>
						}>
						<div className=' d-flex justify-content-between flex-wrap align-items-center w-100'>
							<div className='d-flex flex-row align-items-center gap-1'>
								{attribute?.values?.map((value, index) => (
									<>
										{index !== 0 && <span>/</span>}
										<Typography
											key={value?.id}
											sx={{
												fontSize: "18px",
												fontWeight: "400",
												fontFamily: "Tajawal",
												color: "#023855",

												"@media(max-width:768px)": {
													fontSize: "15px",
													fontWeight: "500",
												},
											}}>
											{value?.title}
										</Typography>
									</>
								))}
							</div>
							<Typography
								sx={{
									fontSize: "16px",
									fontWeight: "400",
									fontFamily: "Tajawal",
									color: "#023855",

									"@media(max-width:768px)": {
										fontSize: "14px",
										fontWeight: "500",
										// margin: "0 auto 0 0",
									},
								}}>
								متوفر عدد: {attribute?.qty}
							</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<div className='option-name-input d-flex justify-content-start align-items-center gap-2 mb-2'>
							<div className='input-icon'>
								<IoPricetagsOutline />
							</div>
							<input
								type='text'
								placeholder='السعر'
								value={attribute?.price}
								onChange={(e) => {
									addPriceToAttributes(e, attributeIndex);
								}}
							/>
							<div className='input-type'>ر.س</div>
						</div>

						<div className='option-name-input d-flex justify-content-start align-items-center gap-2 mb-2'>
							<div className='input-icon'>
								<IoPricetagsOutline />
							</div>
							<input
								type='text'
								placeholder='السعر بعد الخصم'
								value={attribute?.discount_price}
								onChange={(e) => {
									addDiscountPrice(e, attributeIndex);
								}}
							/>
							<div className='input-type'>ر.س</div>
						</div>

						{attribute?.discount_price && attribute?.price && (
							<div className='col-lg-7 col-md-9 col-12'>
								{Number(attribute?.price) - Number(attribute?.discount_price) <=
									0 ? (
									<span style={{ color: "red", fontSize: "14px",whiteSpace:"normal" }}>
										يجب ان يكون سعر الخصم اقل من السعر الأساسي
									</span>
								) : null}
							</div>
						)}

						{attribute?.discount_price && !attribute?.price ? (
							<div className='col-lg-7 col-md-9 col-12'>
								<span
									style={{
										color: "red",
										fontSize: "14px",
										whiteSpace:"normal",
									}}>
									يرجى ادخال السعر الأساسي أولاّّ حتى تتمكن من ادخال سعر الخصم
								</span>
							</div>
						) : null}
						<div className='option-name-input d-flex justify-content-start align-items-center gap-2 mb-2'>
							<div className='input-icon'>
								<MdStorage />
							</div>
							<span
								style={{
									flex: "1",
									fontSize: "1rem",
									fontWeight: "500",
									color: "#000000",
								}}>
								الكمية المتوفرة
							</span>
							<Box
								sx={{
									display: "flex",
									height: "46px",
									"& div": {
										width: "56px",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										height: "100%",
										border: "1px solid #ADB5B966",
									},
								}}>
								<div
									onClick={() => {
										increaseQtyToAttributes(attributeIndex);
									}}
									style={{ cursor: "pointer" }}>
									<AiOutlinePlus></AiOutlinePlus>
								</div>
								<div>
									<input
										type='text'
										placeholder='الكمية'
										value={attribute?.qty}
										onChange={(e) => {
											changeQtyToAttributes(e, attributeIndex);
										}}
										style={{ textAlign: "center" }}
									/>
								</div>
								<div
									onClick={() => {
										decreaseQtyToAttributes(attributeIndex);
									}}
									style={{ cursor: "pointer" }}>
									<AiOutlineMinus></AiOutlineMinus>
								</div>
							</Box>
						</div>
					</AccordionDetails>
				</Accordion>
			</section>
		</>
	));

	return (
		<>
			{previewOpen && <ProductImageModal />}
			<Modal open={isProductOptionOpen}>
				<Box component={"div"} sx={style}>
					<div
						className='add-form-wrapper product-options bg-white'
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
										إدارة الكميات
									</h5>

									<div className='close-icon-video-modal ps-2'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={() => {
												dispatch(closeProductOptionModal());
												// clearOptions();
											}}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='form-body bg-white'>
							<div className='row  mb-2'>
								<div className='col-12 '>
									<div className='mb-2 option-info-label d-flex justify-content-start align-items-center gap-2 '>
										<IoMdInformationCircleOutline />
										<span>بإمكانك إدارة الكمية بناء على خيارات المنتج</span>
									</div>
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
										<span className='switch-label'>تفعيل خيارات المنتج</span>
									</div>
								</div>
							</div>

							<section
								className={`${productHasOptions ? "d-flex" : "d-none"
									} row mb-4`}>
								<div className='col-12 mb-4'>
									{/* the product options section */}
									{productOptionsSection}

									<div>
										<button
											onClick={handleAddNewBlock}
											className='w-100 add-new-option-section-btn d-flex justify-content-center align-items-center cursor-pointer'>
											<FiPlus className='add-icon' />
											إضافة خيار جديد
										</button>
									</div>
								</div>
								{attributesAccording?.length > 0 && (
									<>
										<div className='col-12 border mb-3'></div>

										<div className='col-12 p-0 mb-2'>
											<div className='d-flex justify-content-end align-items-center'>
												{/* سيتم تعطيله بشكل مؤقت */}
												{/*<FormControlLabel
												control={
													<Checkbox
														checked={quantityIsUnlimited}
														onChange={() =>
															setQuantityIsUnlimited(!quantityIsUnlimited)
														}
														sx={{
															color: "#76e8cd",
															"& .MuiSvgIcon-root": {
																color: "#76e8cd",
																fontSize: "1.6rem",
															},
														}}
													/>
												}
												label='كميات غير محدودة'
											/>*/}

												<div className='d-block total-quantity ps-2'>
													إجمالي الكمية:{" "}
													<span>
														{attributes?.reduce(
															(total, attribute) => total + attribute?.qty,
															0
														) || 0}
													</span>
												</div>
											</div>
										</div>
									</>
								)}

								<div className='col-12 mb-2'>
									{attributesAccording && attributesAccording}
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
											// clearOptions();
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

const AddProductOptions = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<AddProductOptionsModal />,
				document.getElementById("product-option")
			)}
		</Fragment>
	);
};

export default AddProductOptions;
