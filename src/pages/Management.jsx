import React, { useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { MdAdd } from "react-icons/md";
import { HomeIcon } from "../data/Icons";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

// MUI
import { Button } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// Components
import useFetch from "../Hooks/UseFetch";
import { UserAndManagementTable } from "../components/Tables";

const Management = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/user"
	);
	const { fetchedData: roles } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/roles"
	);
	const navigate = useNavigate();
	const [roll_id, setRoll_id] = useState("");
	const [search, setSearch] = useState("");
	let users = fetchedData?.data?.users;
	let filterUsers = users;

	if (search !== "") {
		users = fetchedData?.data?.users?.filter((item) =>
			item?.name?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		users = fetchedData?.data?.users;
	}

	if (roll_id !== "") {
		filterUsers = users?.filter(
			(item) => parseInt(item?.role?.id) === parseInt(roll_id)
		);
	} else {
		filterUsers = users;
	}

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الإدارة و المستخدمين</title>
			</Helmet>
			<section className='management-page p-lg-3'>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<div className='col-lg-6 col-md-6 col-sm-12 mb-2'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<HomeIcon />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>
									<li className='breadcrumb-item  ' aria-current='page'>
										الإعدادات
									</li>
									<li className='breadcrumb-item active' aria-current='page'>
										الإدارة و المستخدمين
									</li>
								</ol>
							</nav>
						</div>

						<div className='col-lg-6 col-md-6 col-sm-12 d-flex justify-content-end mb-3 mb-md-0'>
							<div className='add-page-btn '>
								<Button
									variant='contained'
									className='outline'
									onClick={() => {
										navigate("AddUser");
									}}>
									<MdAdd />
									<span className='me-2'>اضافة مستخدم</span>
								</Button>
							</div>
							<div className='add-page-btn d-flex-justify-content-center me-3'>
								<Button
									className='roles-btn'
									variant='contained'
									onClick={() => {
										navigate("JobTitles");
									}}>
									الأدوار
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className='table-filter'>
					<div className='row'>
						<div className='col-12'>
							<div className='table-title'>
								<h5> جدول المستخدمين</h5>
							</div>
						</div>
					</div>
					<div className='filter-row'>
						<div className='row d-flex align-items-center '>
							<div className='col-lg-6 col-md-6 col-sm-12 mb-2'>
								<div className='filter-user-selector'>
									<label htmlFor='select-user-filter ' className='d-block mb-3'>
										فرز حسب
									</label>

									<FormControl sx={{ m: 0, width: "100%" }}>
										<Select
											name='roll_id'
											value={roll_id}
											onChange={(e) => {
												setRoll_id(e.target.value);
											}}
											sx={{
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
													right: "95%",
												},
												"& .MuiSelect-nativeInput": {
													display: "none",
												},
											}}
											IconComponent={IoIosArrowDown}
											displayEmpty
											inputProps={{ "aria-label": "Without label" }}
											renderValue={(selected) => {
												if (roll_id === "") {
													return (
														<p className='select-role-hint'>
															اختر الدور الوظيفي
														</p>
													);
												}
												const result =
													roles?.data?.roles?.filter(
														(item) => parseInt(item?.id) === parseInt(selected)
													) || "";
												return result[0]?.name;
											}}>
											<MenuItem
												className='souq_storge_category_filter_items'
												sx={{
													backgroundColor: "#fff",
													height: "3rem",
													"&:hover": {},
												}}
												value={""}>
												الكل
											</MenuItem>
											{roles?.data?.roles?.map((cat, index) => {
												return (
													<MenuItem
														key={index}
														className='souq_storge_category_filter_items'
														sx={{
															backgroundColor: "#ffff",
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
							</div>
							<div className='col-lg-6 col-md-6 col-sm-12 '>
								<div className='filter-user-input-group'>
									<div className='d-block mb-md-2'></div>
									<div className='search-icon'>
										<span>
											<BsSearch />
										</span>
									</div>
									<input
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										type='text'
										name='search-user'
										id='search-user'
										placeholder='ابحث عن مستخدم'
										autoComplete='false'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='management-table'>
					<UserAndManagementTable
						data={filterUsers}
						loading={loading}
						reload={reload}
						setReload={setReload}
					/>
				</div>
			</section>
		</>
	);
};

export default Management;
