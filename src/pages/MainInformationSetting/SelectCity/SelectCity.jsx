import React from "react";

import { MenuItem, Select } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { CityIcon } from "../../../data/Icons";

import { useGetCitiesQuery } from "../../../store/apiSlices/selectorsApis/selectCitiesApi";

// select style
const selectStyle = {
	width: "100%",
	fontSize: "18px",

	"& .MuiSelect-select.MuiSelect-outlined": {
		paddingRight: "50px !important",
	},

	"& .MuiOutlinedInput-root": {
		border: "none",
		"& :hover": {
			border: "none",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "1px solid #ededed",
	},
	"& .MuiSelect-icon": {
		right: "95%",
	},
};

const SelectCity = ({ city, setCity, settingErr, setCityAddress }) => {
	const { data: cities } = useGetCitiesQuery();

	return (
		<div className='row d-flex justify-content-center align-items-center'>
			<div className='col-lg-8 col-12'>
				<div className='store_email'>
					<label htmlFor='city_id' className='setting_label d-block'>
						المدينة<span className='important-hint'>*</span>
					</label>
				</div>
				<div className='select-country'>
					<div className='select-icon'>
						<CityIcon />
					</div>

					<Select
						id='city_id'
						name='city_id'
						value={city}
						onChange={(e) => {
							setCity(e.target.value);
						}}
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
							if (city === "" || city === "undefined" || !selected) {
								return <span style={{ color: "#7d7d7d" }}>اختر المدينة</span>;
							}
							const result = cities?.filter(
								(item) => parseInt(item?.id) === parseInt(selected)
							);
							setCityAddress(result?.[0]?.name || "");

							return result?.[0]?.name;
						}}>
						{cities?.map((item, idx) => {
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
									{item?.name}
								</MenuItem>
							);
						})}
					</Select>
				</div>
				{settingErr?.city_id && (
					<span className='fs-6 w-100 text-danger'>{settingErr?.city_id}</span>
				)}
			</div>
		</div>
	);
};

export default SelectCity;
