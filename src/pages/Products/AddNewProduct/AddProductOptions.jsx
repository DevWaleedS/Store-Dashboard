import React, { Fragment, useContext, useState } from "react";

// Third party
import ReactDom from "react-dom";
import { toast } from "react-toastify";
import { SketchPicker } from "react-color";

import { useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeProductOptionModal } from "../../../store/slices/ProductOptionModal";

// Context
import Context from "../../../Context/context";

// Icons
import { FiPlus } from "react-icons/fi";
import { TfiWrite } from "react-icons/tfi";
import { MdStorage } from "react-icons/md";
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
import { Checkbox, FormControlLabel, Switch } from "@mui/material";

/* Modal Styles */
const style = {
	position: "absolute",
	top: "120px",
	left: "50%",
	transform: "translate(-50%, 0%)",
	width: "992px",
	maxWidth: "90%",
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

const select_value_options = ["نص", "اللون"];

const AddProductOptionsModal = () => {
	const { isProductOptionOpen } = useSelector(
		(state) => state.ProductOptionModal
	);

	const navigate = useNavigate();
	const dispatch = useDispatch(false);

	const contextStore = useContext(Context);
	const {
		productHasOptions,
		setProductHasOptions,
		quantityIsUnlimited,
		setQuantityIsUnlimited,
		attributes,
		setAttributes,
		optionsSection,
		setOptionsSection,
		clearOptions,
	} = contextStore;
	const [showColorPicker, setShowColorPicker] = useState(null);
	/** to handle the option-section */

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
				attributes.push({ values: [...currentAttribute], qty: 0 });
				return;
			}

			const block = blocks[blockIndex];

			for (const value of block.values) {
				currentAttribute[blockIndex] = { id: blockIndex, title: value.title };
				backtrack(currentAttribute, blockIndex + 1);
			}
		};

		backtrack(new Array(blocks.length), 0);
		return attributes;
	};

	const addPriceToAttributes = (e, blockIndex) => {
		// if (!quantityIsUnlimited) {

		// }
		const updatedAttributes = [...attributes];
		updatedAttributes[blockIndex].price = Number(
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

	const saveOptions = () => {
		if (productHasOptions === true) {
			const nameNotEmpty = optionsSection?.every(
				(section) => section?.name !== ""
			);
			const valuesNotEmpty = optionsSection?.every((section) =>
				section?.values?.some((value) => value?.title === "")
			);
			if (nameNotEmpty) {
				if (valuesNotEmpty) {
					toast.warning("يرجى ملاء حقل القيمة بالأول", {
						theme: "light",
					});
				} else {
					dispatch(closeProductOptionModal());
					toast.success("تم حفظ خيارات المنتج", {
						theme: "light",
					});
				}
			} else {
				toast.warning("يرجى ملاء حقل مسمى الخيار بالأول", {
					theme: "light",
				});
			}
		} else {
			dispatch(closeProductOptionModal());
		}
	};

	/** Handle mapping the options sections */
	const productOptionsSection = optionsSection?.map((section, sectionIndex) => (
		<section key={sectionIndex + 1} className='options-section'>
			<section className='mb-4 d-flex justify-content-start align-items-center gap-3'>
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
					<div className='delete-icon delete-option-section-icon'>
						<DeleteIcon onClick={() => handleDeleteBlock(sectionIndex)} />
					</div>
				)}
			</section>

			<section className='mb-6'>
				{section?.values?.map((item, itemIndex) => (
					<section
						key={itemIndex + 1}
						className='mb-3 d-flex justify-content-start align-items-center gap-3'>
						<div className='option-color-input d-flex justify-content-start align-items-center gap-2'>
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
							{section?.select_value === "اللون" && (
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
									}}></div>
							)}
							{showColorPicker === item?.id &&
								section?.select_value === "اللون" && (
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
				key={attributeIndex + 1}
				className=' flex justify-start items-center gap-3 mb-3'>
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
						<div className=' d-flex justify-content-between align-items-center w-100'>
							<div className='d-flex flex-row align-items-center gap-1'>
								{attribute?.values?.map((value, index) => (
									<>
										{value?.id === index && index !== 0 && <span>/</span>}
										<Typography
											key={index + 1}
											sx={{
												fontSize: "18px",
												fontWeight: "400",
												fontFamily: "Tajawal",
												color: "#023855",
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
								}}>
								متوفر عدد {attribute?.qty}
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
								// disabled={quantityIsUnlimited}
							/>
							<div className='input-type'>ر.س</div>
						</div>
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
										if (!quantityIsUnlimited) {
											increaseQtyToAttributes(attributeIndex);
										}
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
											if (!quantityIsUnlimited) {
												changeQtyToAttributes(e, attributeIndex);
											}
										}}
										style={{ textAlign: "center" }}
									/>
								</div>
								<div
									onClick={() => {
										if (!quantityIsUnlimited) {
											decreaseQtyToAttributes(attributeIndex);
										}
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
							className={`${productHasOptions ? "d-flex" : "d-none"} row mb-4`}>
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
										<div className='d-flex justify-content-between align-items-center'>
											<FormControlLabel
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
											/>
											<div
												className={`${
													quantityIsUnlimited ? "d-none" : "d-block"
												} total-quantity ps-2`}>
												إجمالي الكمية{" "}
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
								<button className='save-btn' onClick={() => saveOptions()}>
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
