import React from "react";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// icons
import { IoIosArrowDown } from "react-icons/io";

const formStyle = {
	background: "#FFFF",
	borderRadius: "8px",
	width: "866px",
	maxWidth: "100%",
	height: "530px",
	boxShadow: "3px 3px 6px #0000000A",
	padding: "26px",
	marginBottom: "10px",
};

const inputsStyle = {
	background: "#F4F5F7",
	width: "100%",
	height: "56px",
	fontSize: "18px",
	fontWeight: 400,
	border: " 1px solid #E7ECEF",
	borderRadius: "4px",
};

const labelStyle = {
	fontSize: "18px",
	fontWeight: 400,
	color: "#02466A",
};

const banks = ["بنك 1 ", "بنك 2 ", "بنك 3 ", "بنك 4 "];

const MadaFormWeight = () => {
	const [selectBank, setSelectBank] = React.useState("");
	const handleCategoryChange = (event) => {
		setSelectBank(event.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
	};
	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<div className='row mb-3'>
				<div className='col-12'>
					<label style={labelStyle} htmlFor='owner-name'>
						اسم مالك الحساب
					</label>
				</div>
				<div className='col-12'>
					<input
						id='owner-name'
						type='text'
						name='owner-name'
						style={{ padding: "18px", ...inputsStyle }}
					/>
				</div>
			</div>
			<div className='row mb-3'>
				<div className='col-12'>
					<label style={labelStyle} htmlFor='select-bank'>
						اختر البنك
					</label>
				</div>
				<div className='col-12'>
					<FormControl sx={{ m: 0, width: "100%" }}>
						<Select
							sx={{
								fontSize: "18px",
								"& .MuiSelect-select .MuiSelect-outlined .MuiInputBase-input .MuiOutlinedInput-input css-qiwgdb":
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
									right: "90%",
								},
							}}
							style={inputsStyle}
							IconComponent={IoIosArrowDown}
							value={selectBank}
							displayEmpty
							onChange={handleCategoryChange}
							inputProps={{ "aria-label": "Without label" }}
							renderValue={(selected) => {
								if (selectBank === "") {
									return (
										<span style={{ color: "#67747B" }}>
											{" "}
											اختر البنك المعتمد
										</span>
									);
								}
								return selected;
							}}>
							{banks.map((item, idx) => {
								return (
									<MenuItem
										key={idx}
										className='souq_storge_category_filter_items'
										sx={{
											backgroundColor: "rgba(211, 211, 211, 1)",
											height: "3rem",
											"&:hover": {},
										}}
										value={`${item}`}>
										{item}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
			</div>
			<div className='row mb-3'>
				<div className='col-12'>
					<label style={labelStyle} htmlFor='account-nmuber'>
						رقم الحساب
					</label>
				</div>
				<div className='col-12'>
					<input
						id='account-nmuber'
						type='text'
						name='account-nmuber'
						style={{ padding: "18px", ...inputsStyle }}
					/>
				</div>
			</div>
			<div className='row mb-4'>
				<div className='col-12'>
					<label style={labelStyle} htmlFor='IBAN'>
						IBAN
					</label>
				</div>
				<div className='col-12'>
					<input
						id='IBAN'
						type='text'
						name='IBAN'
						style={{ padding: "18px", ...inputsStyle }}
					/>
				</div>
			</div>

			<div className='d-flex justify-content-center'>
				<button
					style={{
						background: "#1DBBBE",
						borderRadius: "4px",
						width: "474px",
						height: "56px",
						fontSize: "22px",
						fontWeight: 500,
						color: "#FFFFFF",
					}}>
					حفظ
				</button>
			</div>
		</form>
	);
};

export default MadaFormWeight;
