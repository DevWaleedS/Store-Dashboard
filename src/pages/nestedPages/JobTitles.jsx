import React, { useContext, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../../Hooks/UseFetch';
import { DeleteContext } from '../../Context/DeleteProvider';
import CircularLoading from '../../HelperComponents/CircularLoading';
// MUI
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

// ICONS
import { ReactComponent as EditIcon } from '../../data/Icons/editt 2.svg';
import { ReactComponent as DeleteIcon } from '../../data/Icons/icon-24-delete.svg';

// Modal Style
const style = {
	position: 'fixed',
	top: '80px',
	left: '0%',
	transform: 'translate(0%, 0%)',
	width: '85%',
	height: '100%',
	overflow: 'auto',
	bgcolor: '#f8f9fa',
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

const JobTitles = () => {
	const { fetchedData, loading, reload, setReload } = useFetch('https://backend.atlbha.com/api/Store/roles');
	const DeleteStore = useContext(DeleteContext);
	const { setUrl, setActionDelete, deleteReload, setDeleteReload, setDeleteMethod } = DeleteStore;
	//
	const navigate = useNavigate();
	// Delete single item
	useEffect(() => {
		if (deleteReload === true) {
			setReload(!reload);
		}
		setDeleteReload(false);
	}, [deleteReload]);


	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الأدوار الوظيفية</title>
			</Helmet>
			<div className='' open={true}>
				<Modal open={true} onClose={() => navigate('/Management')} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
					<Box sx={style} className='nested-pages-modal'>
						<section className='job-title-page'>
							<div className='form-title mb-md-5 mb-3'>
								<div className='row header-row'>
									<div className='col-md-6 col-12'>
										<h5 className='mb-4'> الأدوار الوظيفية</h5>
										<div className='head-category '>
											<div className='row'>
												<nav aria-label='breadcrumb'>
													<ol className='breadcrumb'>
														<li className='breadcrumb-item'>
															<Link to='/Management' className='me-2'>
																جدول المستخدمين
															</Link>
														</li>

														<li className='breadcrumb-item active' aria-current='page'>
															الأدوار الوظيفية
														</li>
													</ol>
												</nav>
											</div>
										</div>
									</div>
									<div className='col-md-6 col-12 d-flex justify-content-end'>
										<div className='create-job-title-btn'>
											<button onClick={() => navigate('CreateRole')}>إنشاء دور</button>
										</div>
									</div>
								</div>
							</div>

							<div className='job-titles-wrapper mb-md-5 mb-3'>
								{
									loading ?
										<CircularLoading />
										:
										(
											fetchedData?.data?.roles?.map((role, index) => (
												<div className='row mb-3' key={index}>
													<div className='col-12'>
														<div className='job-box d-flex justify-content-between align-items-center'>
															<span className='job-name'>{role?.name}</span>
															<div className='job-btn-group'>
																<button className='edit-btn' onClick={() => navigate(`EditRole/${role?.id}`)}>
																	<EditIcon />
																	<span className='me-2'>تحرير</span>
																</button>
																<button
																	onClick={() => {
																		setActionDelete('سيتم حذف الدور وهذة الخطوة غير قابلة للرجوع');
																		setDeleteMethod('delete');
																		setUrl(`https://backend.atlbha.com/api/Store/roles/${role?.id}`);
																	}}
																	className='delete-btn me-md-3'
																>
																	<DeleteIcon />
																	<span className='me-md-2'>حذف</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											))
										)
								}

							</div>
							<div className='row m-0 mb-3'>
								<div className='col-12'>
									<div className='close-btn d-flex justify-content-center '>
										<button onClick={() => navigate('/Management')}>إغلاق</button>
									</div>
								</div>
							</div>
						</section>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default JobTitles;
