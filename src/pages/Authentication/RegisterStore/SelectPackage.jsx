import React from "react";

import { MenuItem, Select } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { useGetPackagesQuery } from "../../../store/apiSlices/selectorsApis/selectPackageApi";
import { ComparisonPackages } from "../../../data/Icons";
import { useNavigate } from "react-router-dom";

// select style
const selectStyle = {
	width: "100%",
	fontSize: "18px",

	"&.MuiInputBase-root": {
		backgroundColor: "#FFF",
	},
	"& .MuiSelect-select.MuiSelect-outlined": {
		paddingRight: "20px !important",
	},

	"& .MuiOutlinedInput-root": {
		border: "none",
		"& :hover": {
			border: "none",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "1px solid #e4e4e4",
		" :hover": {
			borderColor: "#e4e4e4",
			borderWidth: "1px",
		},
	},
	"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
		borderColor: "#e4e4e4",
		borderWidth: "1px",
	},

	"& .MuiSelect-icon": {
		right: "95%",
	},
};

const SelectPackage = ({ packageError, package_id, handleRegisterInfo }) => {
	const navigate = useNavigate();
	const { data: packages } = useGetPackagesQuery();
	return (
		<div>
			<h5 className='d-flex justify-content-start align-items-center'>
				نوع الباقة <span style={{ color: "red" }}>*</span>{" "}
				<span
					className='comparison-packages-icon d-inline-block pe-1'
					onClick={() => navigate("/compare-packages")}>
					<ComparisonPackages />
				</span>
			</h5>
			<div className='select-country'>
				<Select
					id='package_id'
					name='package_id'
					value={package_id}
					onChange={handleRegisterInfo}
					MenuProps={{
						sx: {
							"& .MuiPaper-root ": {
								height: "350px",
							},
						},
					}}
					sx={selectStyle}
					IconComponent={IoIosArrowDown}
					displayEmpty
					renderValue={(selected) => {
						if (package_id === "" || package_id === "undefined" || !selected) {
							return <p style={{ color: "#7d7d7d" }}>أختر نوع الباقة</p>;
						}
						const result = packages?.filter(
							(item) => parseInt(item?.id) === parseInt(selected)
						);

						return result?.[0]?.name;
					}}>
					{packages?.map((item, idx) => {
						return (
							<MenuItem
								key={idx}
								className='souq_storge_category_filter_items'
								sx={{
									backgroundColor: "inherit",
									height: "3rem",
									"&:hover": {},
								}}
								value={`${item?.id}`}>
								<p className=' w-100 d-flex justify-content-between align-items-center'>
									<span className='pack-name'> {item?.name}</span>

									{item?.discount > 0 ? (
										<>
											<div>
												<span className='pack-discount-price '>
													{item?.yearly_price}{" "}
													<span className='pack-currency '>ر.س</span>
												</span>
												<span className='pack-price'>
													{item?.yearly_price - item?.discount}
													<span className='pack-currency pe-1'>ر.س</span>
												</span>
											</div>
										</>
									) : (
										<span className='pack-price'>
											{item?.yearly_price}
											<span className='pack-currency'>ر.س </span>
										</span>
									)}
								</p>
							</MenuItem>
						);
					})}
				</Select>
			</div>

			{packageError && (
				<span
					className='wrong-text w-100'
					style={{ color: "red", direction: "rtl" }}>
					{packageError}
				</span>
			)}
		</div>
	);
};

export default SelectPackage;
