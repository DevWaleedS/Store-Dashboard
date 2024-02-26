import React, { useState } from "react";

// Icons
import { MdAdd } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

// Redux
import { useDispatch } from "react-redux";
import { openProductHintModal } from "../../store/slices/ImportProductHintModal";

// MUI
import Select from "@mui/material/Select";
import { FormControl } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const FormSearchWeight = ({
	type,
	searchInput,
	categories,
	categorySelected,
}) => {
	const dispatch = useDispatch(true);
	const handleSubmit = (event) => {
		event.preventDefault();
	};
	const [search, setSearchhandel] = useState("");
	const [category_id, setCategory_id] = useState("");
	let data;
	switch (type) {
		case "product":
			data = {
				placeHolder: "ابحث عن منتج",
				buttonValue: "  اضافة منتج من السوق",
			};
			break;
		case "coupon":
			data = {
				placeHolder: "ابحث عن طريق اسم كود الخصم",
				buttonValue: "  اضافة كود خصم",
			};
			break;
		case "customer":
			data = {
				placeHolder: "ابحث بواسطة الرقم ID / الاسم/ رقم الجوال",
				buttonValue: "  اضافة عميل",
			};
			break;
		default:
			break;
	}

	//  select styles
	const selectStyle = {
		fontSize: "18px",
		backgroundColor: "#ededed",
		"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
			{
				paddingRight: "20px",
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
			right: "94%",
		},
		"& .MuiSelect-nativeInput": {
			display: "none",
		},
	};

	return (
		<div className='add-category'>
			<form onSubmit={handleSubmit}>
				<div className='input-group'>
					<div className='search-input input-box'>
						<input
							value={search}
							onChange={(e) => {
								setSearchhandel(e.target.value);
								searchInput(e.target.value);
							}}
							type='text'
							name='search'
							id='search'
							placeholder={data.placeHolder}
						/>
						<BsSearch />
					</div>

					<div className='d-flex flex-column select-input input-box '>
						<label htmlFor='form-select'> النشاط</label>
						<FormControl sx={{ width: "100%" }}>
							<Select
								name='category_id'
								value={category_id}
								onChange={(e) => {
									setCategory_id(e.target.value);
									categorySelected(e.target.value);
								}}
								sx={selectStyle}
								IconComponent={IoIosArrowDown}
								displayEmpty
								inputProps={{ "aria-label": "Without label" }}
								renderValue={(selected) => {
									if (category_id === "") {
										return <p style={{ color: "#ADB5B9" }}>اختر النشاط</p>;
									}
									const result =
										categories?.filter(
											(item) => item?.id === parseInt(selected)
										) || "";
									return result[0]?.name;
								}}>
								<MenuItem
									className='souq_storge_category_filter_items'
									sx={{
										backgroundColor: "rgba(211, 211, 211, 1)",
										height: "3rem",
										"&:hover": {},
									}}
									value={""}>
									الكل
								</MenuItem>
								{categories?.map((cat, index) => {
									return (
										<MenuItem
											key={index}
											className='souq_storge_category_filter_items'
											sx={{
												backgroundColor:
													cat?.store === null
														? " #dfe2aa"
														: " rgba(211, 211, 211, 1)",
												height: "3rem",
												"&:hover": {},
											}}
											value={cat?.id}>
											{cat?.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</div>

					<div className='add-category-bt-box'>
						<button
							className='add-cat-btn'
							onClick={() => {
								dispatch(openProductHintModal());
							}}>
							<MdAdd />
							{data.buttonValue}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default FormSearchWeight;
