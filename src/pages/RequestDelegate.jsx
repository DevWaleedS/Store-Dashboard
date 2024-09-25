import React from "react";

// Third party
import { Helmet } from "react-helmet";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// Icons
import { IoIosArrowDown } from "react-icons/io";

// Components
import { TopBarSearchInput } from "../global/TopBar";
import { DelegateTable } from "../components/Tables";

// RTK Query
import { useGetCitiesQuery } from "../store/apiSlices/selectorsApis/selectCitiesApi";

import { Breadcrumb } from "../components";

// custom hook
import UseAccountVerification from "../Hooks/UseAccountVerification";

const RequestDelegate = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	// cities selector
	const { data: cities } = useGetCitiesQuery();
	const [cityId, setCityId] = React.useState("");
	const handleCategoryChange = (event) => {
		setCityId(event.target.value);
	};
	// ------------------------------------------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | المندوبين</title>
			</Helmet>
			<section className=' delegate-page p-md-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<Breadcrumb
					mb={" mb-md-4"}
					parentPage={"	خدمات المنصة"}
					currentPage={"	المندوبين"}
				/>

				<div
					id='select-delegate'
					className='select-delegate px-md-5 pt-md-4 pb-md-0 mb-md-5 mb-3'>
					<h4 className='select-delegate-title text-center mb-4'>
						قم باختيار المدينة التي تحتاج فيها إلى مندوبين
					</h4>
					<div className='select-delegate-input'>
						<FormControl
							sx={{
								width: "100%",
							}}>
							<Select
								MenuProps={{
									sx: {
										"& .MuiPaper-root ": {
											height: "350px",
											top: "325px",
										},
									},
								}}
								sx={{
									height: "70px",
									backgroundColor: "#DDF2FF ",
									borderRadius: "8px ",
									fontSize: "18px",
									"@media(max-width:768px)": {
										height: "50px",
									},

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
										right: "95%",
										"@media(max-width:768px)": {
											right: "90%",
										},
									},
								}}
								value={cityId}
								displayEmpty
								IconComponent={IoIosArrowDown}
								onChange={handleCategoryChange}
								inputProps={{ "aria-label": "Without label" }}
								renderValue={(selected) => {
									if (cityId === "") {
										return <span> اختر المدينة</span>;
									}
									const result =
										cities?.filter((item) => item?.id === parseInt(selected)) ||
										"";
									return result[0]?.name;
								}}>
								{cities?.map((item, idx) => {
									return (
										<MenuItem
											key={idx}
											className='souq_storge_category_filter_items'
											sx={{
												backgroundColor: "rgba(211, 211, 211, 1)",
												height: "3rem",
												"&:hover": {},
											}}
											value={`${item?.id}`}>
											{item?.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className='delegate-table'>
					<DelegateTable cityId={cityId} />
				</div>
			</section>
		</>
	);
};

export default RequestDelegate;
