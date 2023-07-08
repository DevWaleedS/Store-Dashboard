import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import useFetch from '../../Hooks/UseFetch';
import { useNavigate, useParams } from 'react-router-dom';
import CircularLoading from '../../HelperComponents/CircularLoading';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// icons
import { ReactComponent as Message } from '../../data/Icons/icon-24-email.svg';
import { ReactComponent as User } from '../../data/Icons/icon-24-user.svg';
import { ReactComponent as Password } from '../../data/Icons/icon-24-invisible.svg';
import { ReactComponent as Mobile } from '../../data/Icons/mobile-icon-24.svg';

const style = {
	position: 'fixed',
	top: '80px',
	left: '0%',
	transform: 'translate(0%, 0%)',
	width: '81%',
	height: '100%',
	overflow: 'auto',
	bgcolor: '#fff',
	paddingBottom: '80px',
	'@media(max-width:768px)': {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		backgroundColor: '#F6F6F6',
		paddingBottom: 0,
	},
};
const UserData = () => {
	const { id } = useParams();
	const { fetchedData, loading } = useFetch(`https://backend.atlbha.com/api/Store/user/${id}`);
	const navigate = useNavigate();
	const [user, setUser] = useState({
		name: '',
		user_name: '',
		user_type: '',
		email: '',
		password: '',
		phonenumber: '',
		image: '',
		status: '',
	});
	useEffect(() => {
		setUser({
			...user,
			name: fetchedData?.data?.users?.name,
			user_name: fetchedData?.data?.users?.user_name,
			user_type: fetchedData?.data?.users?.user_type,
			email: fetchedData?.data?.users?.email,
			image: fetchedData?.data?.users?.image,
			phonenumber: fetchedData?.data?.users?.phonenumber,
			status: fetchedData?.data?.users?.status,
		});
	}, [fetchedData?.data?.users]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تفاصيل المستخدم</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal open={true} onClose={() => navigate('/Management')} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='add-form-wrapper add-user-form'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title  '>
										<h5 className='mb-3'> عرض بيانات المستخدم </h5>
										<p>تفاصيل المستخدم</p>
									</div>
								</div>
							</div>
							<form>
								{loading ? (
									<div className='pt-md-5'>
										<CircularLoading />
									</div>
								) : (
									<>
										<div className='form-body'>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='full-name' className=''>
														الإسم الكامل
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<div className='input-icons'>
														<User />
													</div>
													<input type='text' id='full-name' name='name' value={user?.name} disabled />
												</div>
											</div>

											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='user-name' className=''>
														اسم المستخدم
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<div className='input-icons'>
														<User />
													</div>
													<input type='text' id='full-name' name='name' value={user?.user_name} disabled />
												</div>
											</div>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='job-title' className=''>
														الدور الوظيفي
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<select className='form-select' value={user?.user_type} disabled>
														<option defaultValue='اختر نوع الدور الوظيفي'>اختر نوع الدور الوظيفي</option>
														<option value='admin'>آدمن</option>
														<option value='store'>متجر</option>
													</select>
												</div>
											</div>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='password' className=''>
														كلمة المرور
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<div className='input-icons password-icon'>
														<Password />
													</div>
													<input type='password' id='password' name='password' disabled />
												</div>
											</div>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='email' className=''>
														البريد الإلكتروني
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<div className='input-icons'>
														<Message />
													</div>
													<input type='email' id='email' name='email' value={user?.email} disabled />
												</div>
											</div>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='phone-number' className=''>
														رقم الهاتف
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<div className='input-icons'>
														<Mobile />
													</div>
													<input
													maxLength='14'
														minLength='13'
														type='text'
														id='phonenumber'
														name='phonenumber'
														value={user?.phonenumber}
														disabled
													/>
												</div>
											</div>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='personal-image' className=''>
														الصورة الشخصية
													</label>
												</div>
												<div className='col-2'>
													<img width='100%' src={user?.image} alt={user?.name} />
												</div>
											</div>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='status' className=''>
														الحالة
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<select value={user?.status} className='form-select' id='status' name='status' disabled>
														<option defaultValue='active'>مفعل</option>
														<option value='not_active'>غير مفعل</option>
													</select>
												</div>
											</div>
										</div>
										<div className='form-footer'>
											<div className='row d-flex justify-content-center align-items-center'>
												<div className='col-6'>
													<button className='close-btn' onClick={() => navigate('/Management')}>
														إلغاء
													</button>
												</div>
											</div>
										</div>
									</>
								)}
							</form>
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default UserData;
