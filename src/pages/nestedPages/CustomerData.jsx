import React, { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../Hooks/UseFetch';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ImageUploading from 'react-images-uploading';

const style = {
	position: 'fixed',
	top: '80px',
	left: '0%',
	transform: 'translate(0%, 0%)',
	width: '70%',
	height: '100%',
	overflow: 'auto',
	bgcolor: '#fff',
	paddingBottom: '83px',
	'@media(max-width:768px)': {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		backgroundColor: '#F6F6F6',
		paddingBottom: 0,
	},
};
const CustomerData = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { fetchedData } = useFetch(`https://backend.atlbha.com/api/Store/client/${id}`);
	const customerDataInfo = fetchedData?.data?.$clients;

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<div className='add-category-form' open={true}>
			<Modal open={true} onClose={() => navigate('/Customer')} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
				<Box sx={style}>
					<div className='add-form-wrapper add-customer-form customer-data '>
						<div className='d-flex'>
							<div className='col-12'>
								<div className='form-title  '>
									<h5 className='mb-3'> بيانات العميل</h5>
									<p> استعرض بيانات العميل التي قام بالتسجيل من خلالها </p>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit}>
							<div className='form-body'>
								<div className='row mb-md-4 mb-3 d-flex flex-row-reverse justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-0'>
										<ImageUploading disabled>
											{({ imageList, onImageUpload, dragProps }) => (
												// Ui For Upload Log
												<Fragment>
													{/** Preview Image Box */}
													<div className='banners-preview-container mx-md-0 mx-auto mb-md-0 mb-3'>
														<img src={customerDataInfo?.image} alt='' className='img-fluid' />
													</div>
												</Fragment>
											)}
										</ImageUploading>
									</div>
									<div className='col-md-4 col-12'>
										<label htmlFor='id-number' className='d-block mb-2'>
											الرقم ID
										</label>
										<input name='ID_number' value={customerDataInfo?.ID_number} onChange={null} type='text' id='id-number' placeholder='DA88' disabled />

										<div className='row mt-4'>
											<div className='col-12'>
												<label htmlFor='first-name' className='d-block mb-2'>
													الاسم الأول
												</label>
												<input name='first_name' value={customerDataInfo?.first_name} onChange={null} type='text' id='first-name' disabled />
											</div>
										</div>
									</div>
								</div>

								<div className='row mb-md-4 mb-3 d-flex flex-row-reverse justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-3'>
										<label htmlFor='city' className='d-block mb-2'>
											الدولة
										</label>
										<input name='phonenumber' value={customerDataInfo?.country?.name} onChange={null} type='text' id='phone-number' disabled />
									</div>
									<div className='col-md-4 col-12'>
										<label htmlFor='last-name' className='d-block mb-2'>
											الاسم الثاني
										</label>
										<input name='last_name' value={customerDataInfo?.last_name} onChange={null} type='text' id='last-name' disabled />
									</div>
								</div>

								<div className='row mb-md-4 mb-3 d-flex justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-0'>
										<label htmlFor='email' className='d-block mb-2'>
											البريد الالكتروني
										</label>
										<input name='email' value={customerDataInfo?.email} onChange={null} type='email' id='email' disabled />
									</div>

									<div className='col-md-4 col-12'>
										<label htmlFor='city' className='d-block mb-2'>
											المدينة
										</label>
										<input name='phonenumber' value={customerDataInfo?.city?.name} onChange={null} type='text' id='phone-number' disabled />
									</div>
								</div>

								<div className='row mb-md-4 mb-3 justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-0'>
										<label htmlFor='phone-number' className='d-block mb-2'>
											رقم الجوال
										</label>
										<input name='phonenumber' value={customerDataInfo?.phonenumber} onChange={null} type='text' id='phone-number' disabled />
									</div>

									<div className='col-md-4 col-12'>
										<label htmlFor='gender' className='d-block mb-2'>
											الجنس
										</label>
										<input name='phonenumber' value={customerDataInfo?.gender} onChange={null} type='text' id='phone-number' disabled />
									</div>
								</div>
							</div>

							<div className='form-footer'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-md-5 col-12'>
										<button className='close-btn' onClick={() => navigate('/Customer')}>
											إلغاء
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default CustomerData;
