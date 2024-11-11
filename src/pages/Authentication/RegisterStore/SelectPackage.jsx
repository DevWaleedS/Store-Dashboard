import React from "react";

import { MenuItem, Select } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { useGetPackagesQuery } from "../../../store/apiSlices/selectorsApis/selectPackageApi";
import { ComparisonPackages } from "../../../data/Icons";
import { useNavigate } from "react-router-dom";
import PackagePeriodNaming from "../../Packages/PackagePeriodNaming";

// select style
const selectStyle = {
	width: "100%",
	fontSize: "18px",

	"&.MuiInputBase-root": {
		backgroundColor: "#FFF",
	},
	"& .MuiOutlinedInput-input": {
		paddingRight: "20px !important",
		whiteSpace: "normal",
	},

	"& .MuiOutlinedInput-root": {
		border: "none",
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

const PackageData = ({ width, item }) => {
	return (
		<p
			style={{
				width: width,
			}}
			className=' d-flex flex-row justify-content-between gap-5 align-items-center'>
			<h6
				className='pack-name'
				style={{
					maxWidth: "198px",
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
				}}>
				{" "}
				{item?.name}
			</h6>
			<section className=' d-flex flex-row justify-content-end align-items-center gap-1'>
				{item?.discount > 0 ? (
					<section className='d-flex flex-row justify-content-end align-items-center gap-1'>
						<span className='pack-discount-price '>
							{item?.yearly_price} <span className='pack-currency'>ر.س</span>
						</span>
						<span className='pack-price'>
							{item?.yearly_price - item?.discount}
							<span className='pack-currency pe-1'>ر.س</span>
						</span>
					</section>
				) : (
					<span className='pack-price'>
						{item?.yearly_price}
						<span className='pack-currency'>ر.س </span>
					</span>
				)}
				/<PackagePeriodNaming pack={item} />
			</section>
		</p>
	);
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
					sx={selectStyle}
					IconComponent={IoIosArrowDown}
					displayEmpty
					renderValue={(selected) => {
						if (!package_id || !selected) {
							return <p style={{ color: "#7d7d7d" }}>أختر نوع الباقة</p>;
						}
						const result = packages?.filter(
							(item) => parseInt(item?.id) === parseInt(selected)
						);

						return <PackageData width={"85%"} item={result?.[0]} />;
					}}>
					{packages?.map((item) => {
						return (
							<MenuItem
								key={item?.id}
								className='souq_storge_category_filter_items'
								sx={{
									backgroundColor: "inherit",
									height: "3rem",
									"&:hover": {},
								}}
								value={item?.id}>
								<PackageData width={"100%"} item={item} />
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
