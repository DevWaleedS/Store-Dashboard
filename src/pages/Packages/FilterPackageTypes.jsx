import React from "react";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

// Icon
import { IoIosArrowDown } from "react-icons/io";

// RTK Query

import { useGetPeriodTypesQuery } from "../../store/apiSlices/selectorsApis/selectPeriodTypesApi";

const selectStyle = {
	backgroundColor: "#EFF9FF",
	color: "#1DBBBE",
	fontSize: "16px",
	fontWeight: 500,
	height: "100%",

	"& .MuiOutlinedInput-input": {
		paddingRight: "20px !important",
		whiteSpace: "normal",
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

export default function FilterPackageTypes({ packageType, setPackageType }) {
	// Get Period Types
	const { data: getPeriodTypes } = useGetPeriodTypesQuery();

	return (
		<>
			<div className='row d-flex justify-content-between align-items-start mb-2 '>
				<div className='col-12 '>
					<h5 className='label'>فرز الباقات حسب المدة</h5>
				</div>
				<div className='col-12'>
					<FormControl sx={{ width: "100%", height: "50px" }}>
						<Select
							displayEmpty
							sx={selectStyle}
							name='packageType'
							value={packageType}
							input={<OutlinedInput />}
							IconComponent={IoIosArrowDown}
							onChange={(e) => {
								setPackageType(e.target.value);
							}}
							renderValue={(selected) => {
								if (!selected) {
									return <span>فرز حسب مدة الإشتراك</span>;
								}
								const result = getPeriodTypes?.filter(
									(item) => item?.name === selected
								);
								return result[0]?.name_ar;
							}}>
							{getPeriodTypes?.map((item, index) => (
								<MenuItem
									sx={{
										backgroundColor: "#EFF9FF",
										height: "3rem",
										"&:hover": {
											backgroundColor: "#1DBBBE",
										},
									}}
									key={index}
									value={item?.name}>
									{item?.name_ar}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
			</div>
		</>
	);
}
