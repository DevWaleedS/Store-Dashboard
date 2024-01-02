import React, { Fragment, useEffect, useState } from "react";

// Third party
import axios from "axios";
import ReactDom from "react-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeProductOptionModal } from "../../../store/slices/ProductOptionModal";

// Icons
import { FiPlus } from "react-icons/fi";
import { TfiWrite } from "react-icons/tfi";
import { MdStorage } from "react-icons/md";
import { DeleteIcon } from "../../../data/Icons";
import { IoPricetagsOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";

// MUI
import Box from "@mui/material/Box";
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

const AddProductOptionsModal = () => {
	const { isProductOptionOpen } = useSelector(
		(state) => state.ProductOptionModal
	);

	const navigate = useNavigate();
	const dispatch = useDispatch(false);

	const [activeOptions, setActiveOptions] = useState(false);
	const [quantityIsUnlimited, setQuantityIsUnlimited] = useState(false);

	/** to handle the option-section */
	const [optionsSection, setOptionsSection] = useState([
		{
			id: uuidv4(),
			name: "",
			values: [{ id: uuidv4(), value: "" }],
			attributes: [{ id: uuidv4(), name: "", price: "", quantity: "" }],
		},
	]);

	/** handle set option name */
	const handleSetOptionName = (e, index) => {
		const updatedOptionsInputs = [...optionsSection];
		updatedOptionsInputs[index].name = e.target.value;
		setOptionsSection(updatedOptionsInputs);
	};

	/** handle set option values inputs value */
	const handleSetValuesInputsValue = (
		e,
		section,
		sectionIndex,
		item,
		itemIndex
	) => {
		console.log(section);
		console.log(optionsSection);
		// const updatedOptionsSections = [...optionsSection];

		// // Update values array
		// updatedOptionsSections[sectionIndex].values[itemIndex].value =
		// 	e.target.value;

		// // Update attributes array
		// const attributeValues = updatedOptionsSections[sectionIndex].values.map(
		// 	(val) => val.value || ""
		// );
		// const newValue = attributeValues;

		// // Check if a new item was added
		// const newSectionIndex = section.length;

		// console.log(`section: ${section}`);
		// console.log(sectionIndex === newSectionIndex);
		// console.log(
		// 	`sectionIndex: ${sectionIndex}`,
		// 	`newSectionIndex : ${newSectionIndex}`
		// );

		// if (sectionIndex === newSectionIndex) {
		// 	updatedOptionsSections[sectionIndex].attributes.forEach((attr, index) => {
		// 		attr.name = newValue[index];
		// 	});
		// } else {
		// 	// If a new item was added, merge its name with the existing names
		// 	const existingAttributeNames = updatedOptionsSections
		// 		.slice(0, newSectionIndex)
		// 		.flatMap((section) =>
		// 			section.attributes.map((attr) => attr.name || "")
		// 		);
		// 	const mergedNames = [...existingAttributeNames, newValue].join("/");

		// 	updatedOptionsSections[newSectionIndex].attributes.forEach((attr) => {
		// 		attr.name = mergedNames;
		// 	});
		// }
	};

	// handle Add New value Input
	const handleAddNewValueInput = (sectionIndex) => {
		const updatedOptionsSection = [...optionsSection];
		updatedOptionsSection[sectionIndex].values.push({
			id: uuidv4(),
			value: "",
		});
		setOptionsSection(updatedOptionsSection);
	};

	// handle Add New product attributes according item
	const handleAddAttributesAccording = (sectionIndex) => {
		const updatedOptionsSection = [...optionsSection];
		updatedOptionsSection[sectionIndex].attributes.push({
			id: uuidv4(),
			name: "",
			price: "",
			quantity: "",
		});
		setOptionsSection(updatedOptionsSection);
	};

	/** handle delete value input */
	const handleDeleteValueInput = (sectionIndex, inputItemIndex) => {
		setOptionsSection((prevOptionsSection) => {
			return prevOptionsSection.map((section, index) => {
				if (index === sectionIndex) {
					return {
						...section,
						values: section.values.filter((item, i) => i !== inputItemIndex),
						attributes: section.attributes.filter(
							(item, i) => i !== inputItemIndex
						),
					};
				}
				return section;
			});
		});
	};

	/** handle add new option section */
	const handleAddNewOptionsSection = () => {
		const updatedOptionsSections = [...optionsSection];
		const newItem = {
			id: uuidv4(),
			name: "", // Set the initial name to an empty string
			values: [{ id: uuidv4(), value: "" }],
			attributes: [{ id: uuidv4(), name: "", price: "", quantity: "" }],
		};

		// Add the new item to the optionsSection
		updatedOptionsSections.push(newItem);

		setOptionsSection(updatedOptionsSections);
	};

	/** handle delete options section */
	const handleDeleteOptionsSection = (sectionIndex) => {
		setOptionsSection((prevOptionsSection) => {
			return prevOptionsSection.filter(
				(section, index) => index !== sectionIndex
			);
		});
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
						onChange={(e) => handleSetOptionName(e, sectionIndex)}
					/>
				</div>
				{optionsSection?.length > 1 && (
					<div className='delete-icon delete-option-section-icon'>
						<DeleteIcon
							onClick={() => handleDeleteOptionsSection(sectionIndex)}
						/>
					</div>
				)}
			</section>

			<section className='mb-6'>
				{section?.values?.map((item, itemIndex) => (
					<section
						key={itemIndex + 1}
						className='mb-3 d-flex justify-content-start align-items-center gap-3'>
						<div className='option-name-input d-flex justify-content-start align-items-center gap-2'>
							<div className='input-icon'>
								<TfiWrite />
							</div>
							<input
								type='text'
								value={item?.value}
								onChange={(e) => {
									handleSetValuesInputsValue(
										e,
										section,
										sectionIndex,
										item,
										itemIndex
									);
								}}
								placeholder={`القيمة رقم ${itemIndex + 1}`}
							/>
						</div>

						{section?.values?.length > 1 && (
							<div className='delete-icon '>
								<DeleteIcon
									onClick={() =>
										handleDeleteValueInput(sectionIndex, itemIndex)
									}
								/>
							</div>
						)}
					</section>
				))}

				{/* Add more item button */}
				<div>
					<button
						onClick={() => {
							handleAddAttributesAccording(sectionIndex);
							handleAddNewValueInput(sectionIndex);
						}}
						className='w-100 add-new-value-btn d-flex justify-content-center align-items-center cursor-pointer'>
						<FiPlus className='add-icon' />
						إضافة قيمة جديدة
					</button>
				</div>
			</section>
		</section>
	));
	/** ----------------------------------------------------------------------------------------------------------------------------- */

	/** Create Product options according  */
	const [expanded, setExpanded] = React.useState("");
	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	/** handle set option name */
	const handleSetOptionPrice = (e, index) => {
		const updatedOptionsInputs = [...optionsSection];
		updatedOptionsInputs[index].price = e.target.value;
		setOptionsSection(updatedOptionsInputs);
	};

	/** handle set option values inputs value */
	const handleSetValuesInputsQuantity = (e, index) => {
		const updatedOptionsInputs = [...optionsSection];
		updatedOptionsInputs[index].quantity = e.target.value;
		setOptionsSection(updatedOptionsInputs);
	};

	/** product Options According */
	const productOptionsAccording = optionsSection?.map((section, sectionIndex) =>
		section?.attributes?.map((item, itemIndex) => (
			<>
				{item?.name !== "" && (
					<section
						key={itemIndex + 1}
						className=' flex justify-start items-center gap-3 mb-3'>
						<Accordion
							expanded={expanded === `panel${item?.id}`}
							onChange={handleChange(`panel${item?.id}`)}>
							<AccordionSummary
								aria-controls={`panel${item?.id}-content`}
								id={`panel${item?.id}-header`}
								expandIcon={
									<FaRegSquarePlus
										style={{
											fontSize: "1.2rem",
											fill: "#023855",
											marginLeft: "5px",
										}}
									/>
								}>
								<div className=' d-flex justify-content-between align-items-center  w-100'>
									<Typography
										sx={{
											fontSize: "18px",
											fontWeight: "400",
											fontFamily: "Tajawal",
											color: "#023855",
										}}>
										{item?.name}
									</Typography>

									<Typography
										sx={{
											fontSize: "16px",
											fontWeight: "400",
											fontFamily: "Tajawal",
											color: "#023855",
										}}>
										متوفر عدد {item?.quantity}
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
										value={item?.price}
										onChange={(e) => handleSetOptionPrice(e, itemIndex)}
									/>

									<div className='input-type'>ر.س</div>
								</div>
								<div className='option-name-input d-flex justify-content-start align-items-center gap-2 mb-2'>
									<div className='input-icon'>
										<MdStorage />
									</div>
									<input
										type='text'
										placeholder='الكمية'
										value={item?.quantity}
										onChange={(e) =>
											handleSetValuesInputsQuantity(e, itemIndex)
										}
									/>
									<div className='input-type'>قطعة</div>
								</div>
							</AccordionDetails>
						</Accordion>
					</section>
				)}
			</>
		))
	);

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
										onClick={() => dispatch(closeProductOptionModal())}
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
										checked={activeOptions}
										onChange={() => setActiveOptions(!activeOptions)}
									/>
									<span className='switch-label'>تفعيل خيارات المنتج</span>
								</div>
							</div>
						</div>

						<section
							className={`${activeOptions ? "d-flex" : "d-none"} row mb-4`}>
							<div className='col-12 mb-4'>
								{/* the product options section */}
								{productOptionsSection}

								<div>
									<button
										onClick={handleAddNewOptionsSection}
										className='w-100 add-new-option-section-btn d-flex justify-content-center align-items-center cursor-pointer'>
										<FiPlus className='add-icon' />
										إضافة خيار جديد
									</button>
								</div>
							</div>
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
										label='الكمية غير محدودة'
									/>
									<div
										className={`${
											quantityIsUnlimited ? "d-none" : "d-block"
										} total-quantity ps-2`}>
										إجمالي الكمية 0
									</div>
								</div>
							</div>

							<div className='col-12 mb-2'>
								{productOptionsAccording && productOptionsAccording}
							</div>
						</section>
					</div>

					<div
						className='form-footer bg-white'
						style={{ borderRadius: "0 0 16px 16px" }}>
						<div className='row d-flex justify-content-center align-items-center'>
							<div className='col-lg-4 col-6'>
								<button className='save-btn' onClick={console.log("")}>
									حفظ
								</button>
							</div>
							<div className='col-lg-4 col-6'>
								<button
									className='close-btn'
									onClick={() => dispatch(closeProductOptionModal())}>
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
