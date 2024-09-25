import * as React from "react";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Checkbox, ListItemText } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";

// Icons
import { IoIosArrowDown } from "react-icons/io";

// RTK Query
import { useFilterSouqOtlobhaProductsByCategoriesMutation } from "../../../../store/apiSlices/souqOtlobhaProductsApi";

// Select styles
const selectMenuStyles = {
	width: "100%",
	"& .MuiOutlinedInput-root": {
		height: "56px",
		borderRadius: "8px",
		border: "1px solid #03787A",
		"@media(max-width:768px)": {
			width: "100%",
			height: "45px",
		},
	},
};

const selectCategoriesStyles = {
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "20px",
		},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "none",
	},

	"& .MuiSelect-icon": {
		right: "90%",
		"@media(max-width:768px)": {
			right: "90%",
		},
	},
};

const ProductsFilterOperations = ({
	setSouqOtlobhaProductsData,
	showFilteringOptions,
	categories,
	products,
	number,
	page,
}) => {
	const [mainCategory, setMainCategory] = React.useState("");
	const [subCategory, setSubCategory] = React.useState([]);

	const handleSubCategoryChange = (event) => {
		const {
			target: { value },
		} = event;
		setSubCategory(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value
		);
	};

	// sub category Array
	const subcategory =
		categories?.filter((sub) => sub?.id === mainCategory) || "";

	// handle   Filter on souq otlobha products by categories
	const [filterSouqOtlobhaProductsByCategories, { isLoading }] =
		useFilterSouqOtlobhaProductsByCategoriesMutation();

	const subCategoriesSelectedIds = subCategory
		.map((id) => `id[]=${id}`)
		.join("&");
	const handleFilterSouqOtlobhaProductsByCategories = async () => {
		if (subCategory?.length !== 0 && mainCategory !== "") {
			try {
				const response = await filterSouqOtlobhaProductsByCategories({
					page,
					number,
					subCategoriesSelectedIds,
					mainCategoryId: mainCategory,
				});
				const responseData = response.data?.data;

				setSouqOtlobhaProductsData(responseData.products);
			} catch (error) {
				console.error(
					"Error fetching filterSouqOtlobhaProductsByCategories:",
					error
				);
			}
		} else {
			setSouqOtlobhaProductsData(products);
		}
	};

	return (
		<div
			className={`row ${
				showFilteringOptions ? "d-none" : "d-flex"
			} align-items-end`}>
			<div className='col-md-4 col-12 mb-md-0 mb-3'>
				<FormControl sx={selectMenuStyles}>
					<label
						className='d-block mb-1'
						style={{ fontSize: "18px", fontWight: 500 }}>
						النشاط الرئيسي
					</label>
					<Select
						sx={selectCategoriesStyles}
						displayEmpty
						IconComponent={(props) => <IoIosArrowDown {...props} />}
						value={mainCategory}
						onChange={(e) => {
							if (mainCategory !== e.target.value) {
								setSubCategory([]);
							}
							setMainCategory(e.target.value);
						}}
						input={<OutlinedInput />}
						inputProps={{ "aria-label": "Without label" }}
						renderValue={(selected) => {
							if (mainCategory === "") {
								return <span> الكل</span>;
							}
							const result =
								categories?.filter((item) => item?.id === selected) || "";

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
						{categories?.map((item) => (
							<MenuItem
								key={item?.id}
								value={item?.id}
								sx={{
									backgroundColor: "#67747B33",
								}}>
								{item?.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div className='col-md-4 col-12'>
				<FormControl sx={selectMenuStyles}>
					<label
						className='d-block mb-1'
						style={{ fontSize: "18px", fontWight: 500 }}>
						النشاط الفرعي
					</label>
					<Select
						multiple
						displayEmpty
						IconComponent={(props) => (
							<IoIosArrowDown fill='#03787A' {...props} />
						)}
						value={subCategory}
						onChange={handleSubCategoryChange}
						input={<OutlinedInput />}
						inputProps={{ "aria-label": "Without label" }}
						renderValue={(selected) => {
							if (subCategory.length === 0) {
								return <span style={{ color: "#03787A" }}> الكل</span>;
							}

							return (
								<div className=' d-flex justify-content-start flex-wrap gap-1'>
									{selected.map((item) => {
										const result = subcategory[0]?.subcategory?.filter(
											(sub) => sub?.id === item
										);
										return (
											<div className='multiple_select_items'>
												{result[0]?.name}
											</div>
										);
									})}
								</div>
							);
						}}
						sx={selectCategoriesStyles}>
						{subcategory[0]?.subcategory?.map((item) => (
							<MenuItem
								key={item?.id}
								value={item?.id}
								sx={{
									backgroundColor: "#67747B33",
									" ul": {
										paddingTop: 0,
										paddingBottom: 0,
									},
								}}>
								<Checkbox checked={subCategory.indexOf(item?.id) > -1} />
								<ListItemText primary={item?.name} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div className='col-md-3 col-12 mt-md-0 mt-3'>
				<button
					className='apply-btn'
					disabled={isLoading}
					onClick={() => handleFilterSouqOtlobhaProductsByCategories()}>
					تنفيذ الفرز
				</button>
			</div>
		</div>
	);
};

export default ProductsFilterOperations;
