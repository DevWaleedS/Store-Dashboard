import React from "react";
import { MenuItem, Select } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { CountryIcon } from "../../../data/Icons";
import { useGetCountriesQuery } from "../../../store/apiSlices/selectorsApis/selectCountriesApi";

const SelectCountry = ({
	settingErr,
	country,
	setCountry,
	setCountryAddress,
}) => {
	const { data: countries } = useGetCountriesQuery();

	return (
		<div className='row d-flex justify-content-center align-items-center'>
			<div className='col-lg-8 col-12'>
				<div className='store_email'>
					<label htmlFor='country_id' className='setting_label gap-0 d-block'>
						الدولة
						<span className='important-hint ps-1'>*</span>
						<span className='tax-text '>(تلقائي)</span>
					</label>
				</div>
				<div className='select-country'>
					<div className='select-icon'>
						<CountryIcon />
					</div>

					<Select
						readOnly
						id='country_id'
						name='country_id'
						value={country}
						onChange={(e) => {
							setCountry(e.target.value);
						}}
						MenuProps={{
							sx: {
								"& .MuiPaper-root ": {
									height: "350px",
								},
							},
						}}
						sx={{
							width: "100%",
							fontSize: "18px",

							"& .MuiSelect-select.MuiSelect-outlined": {
								paddingRight: "50px !important",
								cursor: "auto",
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
								display: "none",
							},
						}}
						IconComponent={IoIosArrowDown}
						displayEmpty
						inputProps={{ "aria-label": "Without label" }}
						renderValue={(selected) => {
							if (country === "" || !selected || country === "undefined") {
								return <span style={{ color: "#7d7d7d" }}>اختر الدولة</span>;
							}
							const result = countries?.filter(
								(item) => parseInt(item?.id) === parseInt(selected)
							);
							setCountryAddress(result?.[0]?.name || "");
							return result?.[0]?.name;
						}}>
						{countries?.map((item, idx) => {
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
				{settingErr?.country_id && (
					<span className='fs-6 w-100 text-danger'>
						{settingErr?.country_id}
					</span>
				)}
			</div>
		</div>
	);
};

export default SelectCountry;
