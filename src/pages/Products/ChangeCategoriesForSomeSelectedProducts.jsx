import React, { useEffect, useState } from "react";

// MUI
import {
	FormControl,
	ListItemText,
	MenuItem,
	Modal,
	Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";

//Icons
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../store/slices/ChangeCategoriesForSomeSelectedProducts";
import { IoIosArrowDown } from "react-icons/io";
import { useChangeCategoriesForSomeSelectedProductsMutation } from "../../store/apiSlices/productsApi";

// RTK Query
import { PageHint } from "../../components";
import { useSelectCategoriesQuery } from "../../store/apiSlices/categoriesApi";

// Style the modal
const style = {
	position: "absolute",
	top: "100px",
	left: "0",
	transform: "translateX(50%)",
	minWidth: "50%",
	maxWidth: "95%",
	"@media(max-width:768px)": {
		top: "80px",

		transform: "translateX(2%)",
	},
};

const selectStyle = {
	fontSize: "18px",
	height: "56px",
	color: "#6790a6",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "20px",
		},
	"&:hover": {
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: " #6790a6",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "1px solid #6790a6",
	},

	"& .MuiSelect-icon": {
		right: "95%",
		color: "#6790a6",
	},

	"@media(max-width:768px)": {
		height: "48px",
	},
};

const formControlStyle = {
	m: 0,
	width: "95%",
	"@media(max-width:768px)": {
		width: "100%",
	},
};

const ChangeCategoriesForSomeSelectedProducts = ({ setSelected, selected }) => {
	// to get categories
	const { data: selectCategories } = useSelectCategoriesQuery({
		is_service: 0,
	});

	// handle open and close modal
	const { modalIsOpen } = useSelector(
		(state) => state.ChangeCategoriesForSomeSelectedProductsSlice
	);

	const dispatch = useDispatch();
	const [categories, setCategories] = useState([]);
	const [category_id, setCategory_id] = useState("");
	const [subcategory_id, setSubcategory_id] = useState([]);

	// To display categories
	useEffect(() => {
		if (selectCategories) {
			setCategories(selectCategories);
		}
	}, [selectCategories]);

	// get sub categories based on main categories
	const subcategory =
		categories?.filter((sub) => sub?.id === parseInt(category_id)) || [];
	// -------------------------------------------------------------------

	// Handle Errors
	const [productError, setProductError] = useState({
		category_id: "",
		subcategory_id: "",
	});

	const resetProductError = () => {
		setProductError({
			category_id: "",
			subcategory_id: "",
		});
	};

	/**  close modal */
	const handleCloseChangeCategoriesModal = () => {
		dispatch(closeModal());
		setCategory_id("");
		setSubcategory_id([]);
	};

	/** handle change categories function */
	const [changeCategoriesForSomeSelectedProducts, { isLoading }] =
		useChangeCategoriesForSomeSelectedProductsMutation();

	// Function to handle changing categories
	const changeCategories = async () => {
		resetProductError();

		// data that send to api
		let formData = new FormData();
		formData.append("category_id", category_id);

		// If subcategory_id array is not empty, include it in the payload
		if (subcategory_id && subcategory_id.length > 0) {
			subcategory_id.forEach((id, index) => {
				formData.append(`subcategory_id[${index}]`, id);
			});
		}

		try {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			const response = await changeCategoriesForSomeSelectedProducts({
				queryParams,
				body: formData,
				subcategory_id,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				handleCloseChangeCategoriesModal();
				setSelected([]);
				setCategory_id("");
				setSubcategory_id([]);
			} else {
				setProductError({
					category_id: response?.data?.message?.en?.category_id?.[0],
					subcategory_id: response?.data?.message?.en?.subcategory_id?.[0],
				});

				toast.error(response?.data?.message?.en?.category_id?.[0], {
					theme: "light",
				});

				toast.error(response?.data?.message?.en?.subcategory_id?.[0], {
					theme: "light",
				});
			}
		} catch (error) {
			console.error("Error changing categories:", error);
		}
	};

	return (
		<Modal open={modalIsOpen} closeAfterTransition>
			<Box component={"div"} sx={style}>
				<div className='change-categories-modal-content'>
					<section className='mb-4 '>
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
										style={{
											fontSize: "22px",
											fontWeight: 400,
											whiteSpace: "normal",
										}}>
										تعديل أنشطة مجموعة من المنتجات
									</h5>

									<div className='close-icon-video-modal ps-2'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={handleCloseChangeCategoriesModal}
										/>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className='p-3'>
						<div className='row mb-md-5 mb-3'>
							<div className='col-12 '>
								<PageHint
									hint={`	بإمكانك تعديل أنشطة المنتجات التي قمت بتحديدها`}
									flex={"d-flex justify-content-start align-items-center gap-2"}
								/>
							</div>
						</div>
						<div className='row mb-md-5 mb-3'>
							<div className='col-12'>
								<label htmlFor='product-category'>
									{" "}
									النشاط الرئيسي
									<span className='important-hint'>*</span>
								</label>
							</div>
							<div className='col-12'>
								<FormControl sx={formControlStyle}>
									<Select
										value={category_id}
										name='category_id'
										sx={selectStyle}
										onChange={(e) => {
											if (category_id !== e.target.value) {
												setSubcategory_id([]);
											}
											setCategory_id(e.target.value);
										}}
										IconComponent={IoIosArrowDown}
										displayEmpty
										renderValue={(selected) => {
											if (category_id?.length === 0) {
												return <p className='text-[#02466a]'>اختر النشاط</p>;
											}
											const result =
												categories?.filter(
													(item) =>
														item?.id === parseInt(selected) ||
														item?.id === category_id
												) || "";
											return result[0]?.name;
										}}>
										{categories?.map((cat, idx) => {
											return (
												<MenuItem
													key={idx}
													className='souq_storge_category_filter_items'
													sx={{
														backgroundColor: "rgba(211, 211, 211, 1)",
														height: "3rem",
														"&:hover": {},
													}}
													value={`${cat?.id}`}>
													{cat?.name}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</div>
							<div className=' col-12'></div>
							<div className='col-12'>
								<span className='fs-6 text-danger'>
									{productError?.category_id}
								</span>
							</div>
						</div>

						{/* Sub catagories */}
						<div className='row mb-md-5 mb-3'>
							<div className=' col-12'>
								<label htmlFor='sub-category labeles'>النشاط الفرعي</label>
							</div>
							<div className=' col-12'>
								<FormControl sx={formControlStyle}>
									{category_id !== "" &&
									subcategory[0]?.subcategory?.length === 0 ? (
										<div
											className='d-flex justify-content-center align-items-center'
											style={{ color: "#1dbbbe" }}>
											لا يوجد أنشطة فرعية للنشاط الرئيسي الذي اخترتة
										</div>
									) : (
										<Select
											sx={selectStyle}
											IconComponent={IoIosArrowDown}
											multiple
											displayEmpty
											name='subcategory_id'
											value={subcategory_id || []}
											onChange={(e) => setSubcategory_id(e.target.value)}
											renderValue={(selected) => {
												if (subcategory_id?.length === 0) {
													return (
														<p className='text-[#02466a]'>النشاط الفرعي</p>
													);
												}

												return (
													<div className=' d-flex justify-content-start flex-wrap gap-1'>
														{selected.map((item) => {
															const result =
																subcategory[0]?.subcategory?.filter(
																	(sub) => sub?.id === parseInt(item)
																) || subcategory_id;
															return (
																<div className='multiple_select_items'>
																	{result[0]?.name}
																</div>
															);
														})}
													</div>
												);
											}}>
											{subcategory[0]?.subcategory?.map((sub, index) => (
												<MenuItem key={index} value={sub?.id}>
													<Checkbox
														checked={subcategory_id?.indexOf(sub?.id) > -1}
													/>
													<ListItemText primary={sub?.name} />
												</MenuItem>
											))}
										</Select>
									)}
								</FormControl>
							</div>
							<div className='col-12'></div>
							<div className='col-12'>
								{productError?.subcategory_id && (
									<span className='fs-6 text-danger'>
										{productError?.subcategory_id}
									</span>
								)}
							</div>
						</div>

						<div className='row mb-3 d-flex justify-content-center align-items-center'>
							<div className='col-md-5 col-12'>
								<button
									disabled={isLoading || !category_id}
									className='save-change-btn w-100'
									onClick={changeCategories}>
									حفظ
								</button>
							</div>
						</div>
					</section>
				</div>
			</Box>
		</Modal>
	);
};

export default ChangeCategoriesForSomeSelectedProducts;
