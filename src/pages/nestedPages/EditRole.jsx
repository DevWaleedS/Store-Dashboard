import React, { useState, useContext } from "react";

// Third party
import axios from "axios";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// Components
import useFetch from "../../Hooks/UseFetch";
import CircularLoading from "../../HelperComponents/CircularLoading";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import FormGroup from "@mui/material/FormGroup";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ArrowBack, SearchIcon } from "../../data/Icons";

// ICONS

// Modal Style
const style = {
	position: "fixed",
	top: "80px",
	left: "0",
	transform: "translate(0%, 0%)",
	width: "100%",
	height: "100%",
	overflow: "auto",
	bgcolor: "#f8f9fa",
	paddingBottom: "80px",
	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		backgroundColor: "#F6F6F6",
		paddingBottom: 0,
	},
};

const EditRole = () => {
	const { id } = useParams();
	const { fetchedData: permissionsListData } = useFetch(
		"https://backend.atlbha.com/api/Store/permissions"
	);
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/roles/${id}`
	);
	const [search, setSearch] = useState("");
	const [roles, setRoles] = useState({
		role_name: "",
	});
	const [permissions, setPermissions] = useState([]);
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// To handle errors
	const [handleErrors, setHandleErrors] = useState("");
	let permissionsList = permissionsListData?.data?.permissions;

	if (search !== "") {
		permissionsList = permissionsListData?.data?.permissions?.filter((item) =>
			item?.name_ar?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		permissionsList = permissionsListData?.data?.permissions;
	}

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			role_name: "",
		},
	});

	useEffect(() => {
		setRoles({ ...roles, role_name: fetchedData?.data?.role?.name });
		setPermissions(fetchedData?.data?.role?.permissions?.map((per) => per?.id));
	}, [fetchedData?.data?.role, fetchedData?.data?.role?.permissions]);

	useEffect(() => {
		reset(roles);
	}, [roles, reset]);

	const updateRole = (data) => {
		setLoadingTitle("جاري تعديل الدور");
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("role_name", data?.role_name);
		for (var i = 0; i < permissions.length; i++) {
			formData.append("permissions[]", permissions[i]);
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/roles/${id}`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Management");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setHandleErrors(res?.data?.message?.en?.role_name[0]);
					toast.error(res?.data?.message?.en?.role_name[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل دور</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box
						component={"div"}
						sx={style}
						className='nested-pages-modal edit-job-title-modal'>
						<form onSubmit={handleSubmit(updateRole)}>
							<section className='SupportDetails-page create-role edit-job-title'>
								<div className='page-wrapper'>
									<div className='page-header mb-md-5 mb-3'>
										<div className='row'>
											<div className='col-md-5 col-12 mb-md-0 mb-3'>
												<span>{fetchedData?.data?.role?.name}</span>
											</div>
											<br />

											{handleErrors && (
												<span className='fs-6 text-danger'>{handleErrors}</span>
											)}
											<div className='col-md-7 col-12'>
												<div className='search'>
													<div className='row'>
														<div className='col-md-8 col-12 mb-md-0 mb-2'>
															<div className='input-icon'>
																<SearchIcon />
															</div>
															<input
																value={search}
																onChange={(e) => setSearch(e.target.value)}
																className='w-100'
																type='text'
																name='search-input'
																id='search-input'
																placeholder='ابحث عن صلاحية'
															/>
														</div>
														<div className='col-md-4 col-12'>
															<button
																className='save-btn w-100'
																type='submit'
																style={{ minWidth: "130px" }}>
																حفظ واعتماد
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className='row mb-md-5 mb-3'>
										<nav aria-label='breadcrumb'>
											<ol className='breadcrumb'>
												<li className='breadcrumb-item'>
													<ArrowBack />
													<Link to='/Management/JobTitles' className='me-2'>
														الأدوار الوظيفية
													</Link>
												</li>

												<li
													className='breadcrumb-item active'
													aria-current='page'>
													صلاحيات الادمن
												</li>
											</ol>
										</nav>
									</div>
									<div className='edit-job-wrapper'>
										<div className='mb-md-5 mb-3'>
											<div className='search-wrapper'>
												<div className='col-md-6 col-12'>
													<label className='d-block mb-2' htmlFor='role-search'>
														<span>
															اسم الدور الوظيفي
															<span className='text-danger'>*</span>
														</span>
													</label>
													<input
														style={{
															width: "100%",
															backgroundColor: "#eee",
															padding: "8px",
															borderRadius: "5px",
														}}
														type='text'
														placeholder='ادخل اسم الدور الوظيفي بالحروف فقط'
														name='role_name'
														{...register("role_name", {
															required: "حقل إسم الدور مطلوب",
															pattern: {
																value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
																message:
																	" يجب أن يكون اسم الدور عبارة عن نصاّّ ولا يحتوي علي حروف خاصه مثل الأقوس والرموز",
															},
														})}
													/>
													<br />
													<span className='fs-6 text-danger'>
														{errors?.role_name && errors?.role_name?.message}
													</span>
												</div>
											</div>
										</div>
										<div className='mb-md-5 mb-3'>
											<div className='create-role-tables'>
												<div className='role-wrapper mb-md-5 mb-3'>
													<div>
														<TableContainer component={Paper} sx={{ p: 0 }}>
															<Table>
																<TableHead
																	sx={{
																		bgcolor: "#eff9ff",
																	}}>
																	<TableRow>
																		<TableCell
																			sx={{
																				width: "60%",
																			}}
																			align='right'>
																			اسم الصلاحية
																		</TableCell>
																		<TableCell align='center'>عرض</TableCell>
																		<TableCell align='center'>تعديل</TableCell>
																		<TableCell align='center'>إضافة</TableCell>
																		<TableCell align='center'>حذف</TableCell>
																		<TableCell align='center'>
																			تفعيل-تعطيل
																		</TableCell>
																	</TableRow>
																</TableHead>
																<TableBody>
																	{loading ? (
																		<TableRow>
																			<TableCell colSpan={6}>
																				<CircularLoading />
																			</TableCell>
																		</TableRow>
																	) : permissionsList?.length !== 0 ? (
																		permissionsList?.map((row, index) => (
																			<TableRow key={index}>
																				<TableCell
																					sx={{
																						border: "none",
																						width: "60%",
																					}}
																					align='right'
																					padding='10px'>
																					{row?.name_ar}
																				</TableCell>
																				{row?.subpermissions?.map(
																					(sub, index) => (
																						<TableCell
																							key={index}
																							sx={{ border: "none" }}
																							align='center'>
																							<FormGroup
																								className=''
																								sx={{ overflow: "hidden" }}>
																								<FormControlLabel
																									value={sub?.id}
																									key={index}
																									sx={{
																										py: 1,
																										mr: 0,
																										borderBottom:
																											"1px solid #ECECEC",
																										"& .MuiTypography-root": {
																											fontSize: "18px",
																											fontWeight: "500",
																											"@media(max-width:767px)":
																												{
																													fontSize: "16px",
																												},
																										},
																									}}
																									control={
																										<Checkbox
																											defaultChecked={
																												permissions?.includes(
																													sub?.id
																												) || false
																											}
																											onChange={(e) => {
																												if (e.target.checked) {
																													setPermissions([
																														...permissions,
																														parseInt(
																															e.target.value
																														),
																													]);
																												} else {
																													setPermissions(
																														permissions?.filter(
																															(item) =>
																																item !== sub?.id
																														)
																													);
																												}
																											}}
																											sx={{
																												"& path": {
																													fill: "#000000",
																												},
																											}}
																										/>
																									}
																								/>
																							</FormGroup>
																						</TableCell>
																					)
																				)}
																			</TableRow>
																		))
																	) : (
																		<TableRow>
																			<TableCell colSpan={6}>
																				<p style={{ textAlign: "center" }}>
																					لاتوجد صلاحيات
																				</p>
																			</TableCell>
																		</TableRow>
																	)}
																</TableBody>
															</Table>
														</TableContainer>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
						</form>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default EditRole;
