import React, { useState, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

// Components
import useFetch from "../../Hooks/UseFetch";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import FormGroup from "@mui/material/FormGroup";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import FormControlLabel from "@mui/material/FormControlLabel";

// ICONS
import arrowBack from "../../data/Icons/icon-30-arrwos back.svg";
import { ReactComponent as StarIcon } from "../../data/Icons/icon-20-star.svg";

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

const CreateRole = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/permissions"
	);
	const [permissions, setPermissions] = useState([]);
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			role_name: "",
		},
	});

	// To handle errors
	const [handleErrors, setHandleErrors] = useState("");

	const createRole = (dataRole) => {
		setLoadingTitle("جاري حفظ الدور");
		const data = {
			role_name: dataRole?.role_name,
			permissions: permissions,
		};
		axios
			.post("https://backend.atlbha.com/api/Store/roles", data, {
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
				<title>لوحة تحكم أطلبها | اضافة دور</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style} className='nested-pages-modal'>
						<form onSubmit={handleSubmit(createRole)}>
							<section className='SupportDetails-page create-role'>
								<div className='head-category mb-md-5'>
									<div className='row'>
										<div className='page-title mb-3'>
											<h3> انشاء دور جديد</h3>
										</div>
									</div>

									<div className='row'>
										<nav aria-label='breadcrumb'>
											<ol className='breadcrumb'>
												<li className='breadcrumb-item'>
													<img src={arrowBack} alt='' loading='lazy' />
													<Link to='/Management/JobTitles' className='me-2'>
														الأدوار الوظيفية
													</Link>
												</li>

												<li
													className='breadcrumb-item active'
													aria-current='page'>
													انشاء دور جديد
												</li>
											</ol>
										</nav>
									</div>
								</div>

								<div className='create-role-wrapper'>
									<div className='mb-md-5 mb-3'>
										<div className='search-wrapper'>
											<div className='col-md-6 col-12'>
												<label className='d-block mb-2' htmlFor='role-search'>
													<StarIcon className='star-icon' />
													<span className='me-2'>
														اسم الدور الوظيفي
														<span className='important-hint'>*</span>
													</span>
												</label>
												<input
													style={{ backgroundColor: "#fff" }}
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

												{handleErrors && (
													<span className='fs-6 text-danger'>
														{handleErrors}
													</span>
												)}
												<br />
												<span className='fs-6 text-danger'>
													{errors?.role_name && errors.role_name.message}
												</span>
											</div>
										</div>
									</div>

									<div className='mb-md-5 mb-3'>
										<div className='create-role-title mb-md-4 mb-3'>
											<StarIcon className='star-icon' />
											<span className='me-2'> حدد الصلاحيات</span>
										</div>
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
																) : (
																	fetchedData?.data?.permissions?.map(
																		(row, index) => (
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
																		)
																	)
																)}
															</TableBody>
														</Table>
													</TableContainer>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='d-flex justify-content-center pb-3'>
									<div className='col-lg-2 col-10'>
										<div className='btn-wrapper w-100'>
											<button type='submit'>حفظ واعتماد</button>
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

export default CreateRole;
