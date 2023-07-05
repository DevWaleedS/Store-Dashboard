import React, { useContext, useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import Context from '../Context/context';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Button from '@mui/material/Button';
import useFetch from '../Hooks/UseFetch';
// import ImageUploading library
import ImageUploading from 'react-images-uploading';
// IMPORT ICONS
import { MdFileUpload } from 'react-icons/md';
import { BsArrowLeft } from 'react-icons/bs';
import { FormControl, Switch } from '@mui/material';
import { ReactComponent as CommentIcon } from '../data/Icons/icon-32-comment.svg';
import { ReactComponent as Client } from '../data/Icons/icon-24-ratings.svg';
import { Link } from 'react-router-dom';
import CircularLoading from '../HelperComponents/CircularLoading';
import { LoadingContext } from '../Context/LoadingProvider';

const TemplateUpdate = () => {
	const { fetchedData, loading, reload, setReload } = useFetch('https://backend.atlbha.com/api/Store/homepage');
	const navigate = useNavigate();
	const [cookies] = useCookies(['access_token']);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [firstimage, setFirstImage] = useState([]);
	const [secondimage, setSecondImage] = useState([]);
	const [thirdimage, setThirdImage] = useState([]);
	const [previewImage, setPreviewImage] = useState('');
	const [bannerstatus1, setBannerStatus1] = useState(true);
	const [bannerstatus2, setBannerStatus2] = useState(true);
	const [bannerstatus3, setBannerStatus3] = useState(true);
	const [commentStatus, setCommentStatus] = useState(true);
	const [clientStatus, setClientStatus] = useState(true);

	useEffect(() => {
		setCommentStatus(fetchedData?.data?.Homepages[0]?.commentstatus === 'active' ? true : false);
		setClientStatus(fetchedData?.data?.Homepages[0]?.clientstatus === 'active' ? true : false);
		setBannerStatus1(fetchedData?.data?.Homepages[0]?.banarstatus1 === 'active' ? true : false);
		setBannerStatus2(fetchedData?.data?.Homepages[0]?.banarstatus2 === 'active' ? true : false);
		setBannerStatus3(fetchedData?.data?.Homepages[0]?.banarstatus3 === 'active' ? true : false);
	}, [fetchedData?.data?.Homepages]);

	/** --------------------------------------------------------------------------------------------------------------- */

	// Use state with ImageUploading library to set Logo
	const [logo, setLogo] = React.useState([]);

	// maxNumbers of files uploaded
	const maxNumber = 2;

	const onChange = (imageList, addUpdateIndex) => {
		// data for submit
		setLogo(imageList);
	};

	const updateLogo = () => {
		setLoadingTitle('جاري تعديل الشعار');
		let formData = new FormData();
		if (logo.length !== 0) {
			formData.append('logo', logo[0]?.file);
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/logoUpdate`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Template');
					setReload(!reload);
				} else {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Template');
					setReload(!reload);
				}
			});
	};

	const updateBanners = () => {
		setLoadingTitle('جاري تعديل البنرات الإعلانية');
		let formData = new FormData();
		if (firstimage.length !== 0) {
			formData.append('banar1', firstimage[0]?.file || null);
		}
		if (secondimage.length !== 0) {
			formData.append('banar2', secondimage[0]?.file || null);
		}
		if (thirdimage.length !== 0) {
			formData.append('banar3', thirdimage[0]?.file || null);
		}
		formData.append('banarstatus1', bannerstatus1 ? 'active' : 'not_active');
		formData.append('banarstatus2', bannerstatus2 ? 'active' : 'not_active');
		formData.append('banarstatus3', bannerstatus3 ? 'active' : 'not_active');
		axios
			.post(`https://backend.atlbha.com/api/Store/banarUpdate`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Template');
					setReload(!reload);
				} else {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Template');
					setReload(!reload);
				}
			});
	};

	const updateComments = () => {
		setLoadingTitle('جاري تعديل التعليقات والعملاء');
		let formData = new FormData();
		formData.append('commentstatus', commentStatus ? 'active' : 'not_active');
		formData.append('clientstatus', clientStatus ? 'active' : 'not_active');
		axios
			.post(`https://backend.atlbha.com/api/Store/commentUpdate`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Template');
					setReload(!reload);
				} else {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Template');
					setReload(!reload);
				}
			});
	};

	return (
		<Fragment>
			<div className='seo-weight-edit-box template-edit-box mb-4'>
				<div className='title'>
					<h4>
						الشعار <span>( تستطيع تغيير الشعار الذي يظهر في الهيدر في الصفحة الرئيسية )</span>
					</h4>
				</div>

				<FormControl variant='standard' className='py-4'>
					<div className='row'>
						<div className='col-12 p-4 '>
							<div className='input-bx'>
								{/** Upload Image  */}
								<ImageUploading value={logo} onChange={onChange} maxNumber={maxNumber} dataURLKey='data_url'>
									{({ onImageUpload, dragProps }) => (
										// Ui For Upload Log
										<Fragment>
											{/** Preview Image Box */}
											<div className='logo-preview-container'>
												{loading ? (
													<CircularLoading />
												) : (
													<>
														{!logo[0] && (
															<img
																style={{ objectFit: 'contain', borderRadius: 'inherit' }}
																className='w-100 h-100 logo-img-uploaded'
																src={fetchedData?.data?.Homepages[0]?.logo}
																alt={fetchedData?.data?.Homepages[0]?.logo}
															/>
														)}
														{logo[0] && <img style={{ objectFit: 'contain', borderRadius: 'inherit' }} src={logo[0]?.data_url} alt='' className='w-100 h-100 logo-img-uploaded' />}
													</>
												)}
											</div>

											{/** upload btn */}
											<div className='upload-files-input'>
												<button className=' d-flex justify-content-between align-items-center w-100' onClick={onImageUpload} {...dragProps}>
													<span> تحديث الشعار </span>
													<MdFileUpload />
												</button>
											</div>
										</Fragment>
									)}
								</ImageUploading>
							</div>
						</div>

						<div className='col-12 p-4'>
							<div className='btn-bx '>
								<Button onClick={() => updateLogo()} variant='contained'>
									حفظ
								</Button>
							</div>
						</div>
					</div>
				</FormControl>
			</div>

			<div className='seo-weight-edit-box template-edit-box mb-md-4 mb-3'>
				<div className='title'>
					<h4>
						البنرات الإعلانية <span> ( تستطيع تغيير الصورة التي تظهر كإعلانات في وسط الموقع وبين الأقسام )</span>
					</h4>
				</div>

				<FormControl variant='standard' className='px-4'>
					<div className='row'>
						<div className='col-12 p-4'>
							<div className='input-bx'>
								{/** preview banner here */}
								<div className=' banners-preview-container d-flex flex-column align-items-center justify-content-center'>
									{loading ? (
										<CircularLoading />
									) : (
										<>
											{!firstimage[0] && (
												<img
													style={{  borderRadius: 'inherit', width: '100%', height: '100%', maxWidth: '100%' }}
													src={fetchedData?.data?.Homepages[0]?.banar1}
													alt={fetchedData?.data?.Homepages[0]?.banar1}
												/>
											)}
											{firstimage[0] && <img style={{  borderRadius: 'inherit', width: '100%', height: '100%', maxWidth: '100%' }} src={previewImage[0]?.data_url} alt='preview-img' />}
										</>
									)}
								</div>
							</div>
						</div>
						<div className='col-12 mb-2'>
							<div className='add-banners-bts-wrapper mt-md-0 mt-3 px-md-0 px-2'>
								{/** Btn to upload banners */}
								<div className='add-banners'>
									<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
										<label htmlFor='add-banner-1'>بانر إعلاني رقم 1</label>
										<div className='wrapper'>
											<ImageUploading
												value={firstimage}
												onChange={(imageList) => {
													setFirstImage(imageList);
													setPreviewImage(imageList);
												}}
												maxNumber={2}
												dataURLKey='data_url'
												acceptType={['jpg', 'png', 'jpeg']}
											>
												{({ onImageUpload, dragProps }) => (
													<div className='upload-files-input mb-2'>
														<button className=' d-flex justify-content-between align-items-center w-100' onClick={onImageUpload} {...dragProps}>
															<span> تحديث البانر </span>
															<MdFileUpload />
														</button>
													</div>
												)}
											</ImageUploading>
											<div className='switches-group'>
												<Switch
													onChange={() => setBannerStatus1(!bannerstatus1)}
													sx={{
														width: '35px',
														padding: 0,
														height: '20px',
														borderRadius: '0.75rem',
														'& .MuiSwitch-thumb': {
															width: '12px',
															height: '12px',
														},
														'& .MuiSwitch-switchBase': {
															padding: '0',
															top: '4px',
															left: '4px',
														},
														'& .MuiSwitch-switchBase.Mui-checked': {
															left: '-4px',
														},
														'& .Mui-checked .MuiSwitch-thumb': {
															backgroundColor: '#FFFFFF',
														},
														'& .MuiSwitch-track': {
															height: '100%',
														},
														'&.MuiSwitch-root .Mui-checked+.MuiSwitch-track': {
															backgroundColor: '#3AE374',
															opacity: 1,
														},
													}}
													checked={bannerstatus1}
												/>
											</div>
										</div>
									</div>
									<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
										<label htmlFor='add-banner-1'>بانر إعلاني رقم 2</label>
										<div className='wrapper'>
											<ImageUploading
												value={secondimage}
												onChange={(imageList) => {
													setSecondImage(imageList);
													setPreviewImage(imageList);
												}}
												maxNumber={2}
												dataURLKey='data_url'
												acceptType={['jpg', 'png', 'jpeg']}
											>
												{({ onImageUpload, dragProps }) => (
													<div className='upload-files-input mb-2'>
														<button className=' d-flex justify-content-between align-items-center w-100' onClick={onImageUpload} {...dragProps}>
															<span> تحديث البانر </span>
															<MdFileUpload />
														</button>
													</div>
												)}
											</ImageUploading>
											<div className='switches-group'>
												<Switch
													onChange={() => setBannerStatus2(!bannerstatus2)}
													sx={{
														width: '35px',
														padding: 0,
														height: '20px',
														borderRadius: '0.75rem',
														'& .MuiSwitch-thumb': {
															width: '12px',
															height: '12px',
														},
														'& .MuiSwitch-switchBase': {
															padding: '0',
															top: '4px',
															left: '4px',
														},
														'& .MuiSwitch-switchBase.Mui-checked': {
															left: '-4px',
														},
														'& .Mui-checked .MuiSwitch-thumb': {
															backgroundColor: '#FFFFFF',
														},
														'& .MuiSwitch-track': {
															height: '100%',
														},
														'&.MuiSwitch-root .Mui-checked+.MuiSwitch-track': {
															backgroundColor: '#3AE374',
															opacity: 1,
														},
													}}
													checked={bannerstatus2}
												/>
											</div>
										</div>
									</div>
									<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
										<label htmlFor='add-banner-1'>بانر إعلاني رقم 3</label>
										<div className='wrapper'>
											<ImageUploading
												value={thirdimage}
												onChange={(imageList) => {
													setThirdImage(imageList);
													setPreviewImage(imageList);
												}}
												maxNumber={2}
												dataURLKey='data_url'
												acceptType={['jpg', 'png', 'jpeg']}
											>
												{({ onImageUpload, dragProps }) => (
													<div className='upload-files-input mb-2'>
														<button className=' d-flex justify-content-between align-items-center w-100' onClick={onImageUpload} {...dragProps}>
															<span> تحديث البانر </span>
															<MdFileUpload />
														</button>
													</div>
												)}
											</ImageUploading>
											<div className='switches-group'>
												<Switch
													onChange={() => setBannerStatus3(!bannerstatus3)}
													sx={{
														width: '35px',
														padding: 0,
														height: '20px',
														borderRadius: '0.75rem',
														'& .MuiSwitch-thumb': {
															width: '12px',
															height: '12px',
														},
														'& .MuiSwitch-switchBase': {
															padding: '0',
															top: '4px',
															left: '4px',
														},
														'& .MuiSwitch-switchBase.Mui-checked': {
															left: '-4px',
														},
														'& .Mui-checked .MuiSwitch-thumb': {
															backgroundColor: '#FFFFFF',
														},
														'& .MuiSwitch-track': {
															height: '100%',
														},
														'&.MuiSwitch-root .Mui-checked+.MuiSwitch-track': {
															backgroundColor: '#3AE374',
															opacity: 1,
														},
													}}
													checked={bannerstatus3}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-12 p-4'>
							<div className='btn-bx '>
								<Button onClick={() => updateBanners()} variant='contained'>
									حفظ
								</Button>
							</div>
						</div>
					</div>
				</FormControl>
			</div>

			<div className='seo-weight-edit-box template-edit-box '>
				<div className='title d-flex flex-md-row flex-column justify-content-between align-items-md-center flex-wrap gap-4'>
					<h4>
						التعليقات والعملاء <span> (تستطيع تفعيل وتعطيل العملاء المميزين والتعليقات )</span>
					</h4>
					<div className='view-more-btn mx-md-4 mt-md-0 mt-3'>
						<Link to='/Rating' variant='contained'>
							<span>عرض التفاصيل</span>
							<BsArrowLeft className='me-2' />
						</Link>
					</div>
				</div>

				<FormControl variant='standard' className='edit-robot-teat-area py-4'>
					<div className='row'>
						<div className='col-12 p-4'>
							<div className='input-bx'>
								<div className='switch-widget mb-2 d-flex justify-content-between align-items-center'>
									<div className='widget-text'>
										<Client className='client-icon' />
										<span className='me-3'>العملاء المميزن</span>
									</div>
									<div className='switch-btn'>
										<Switch
											onChange={() => setClientStatus(!clientStatus)}
											sx={{
												width: '35px',
												padding: 0,
												height: '20px',
												borderRadius: '0.75rem',
												'& .MuiSwitch-thumb': {
													width: '12px',
													height: '12px',
												},
												'& .MuiSwitch-switchBase': {
													padding: '0',
													top: '4px',
													left: '4px',
												},
												'& .MuiSwitch-switchBase.Mui-checked': {
													left: '-4px',
												},
												'& .Mui-checked .MuiSwitch-thumb': {
													backgroundColor: '#FFFFFF',
												},
												'& .MuiSwitch-track': {
													height: '100%',
												},
												'&.MuiSwitch-root .Mui-checked+.MuiSwitch-track': {
													backgroundColor: '#3AE374',
													opacity: 1,
												},
											}}
											checked={clientStatus}
										/>
									</div>
								</div>
								<div className='switch-widget d-flex justify-content-between align-items-center'>
									<div className='widget-text'>
										<CommentIcon />
										<span className='me-3'> تعليقات العملاء</span>
									</div>
									<div className='switch-btn'>
										<Switch
											onChange={() => setCommentStatus(!commentStatus)}
											sx={{
												width: '35px',
												padding: 0,
												height: '20px',
												borderRadius: '0.75rem',
												'& .MuiSwitch-thumb': {
													width: '12px',
													height: '12px',
												},
												'& .MuiSwitch-switchBase': {
													padding: '0',
													top: '4px',
													left: '4px',
												},
												'& .MuiSwitch-switchBase.Mui-checked': {
													left: '-4px',
												},
												'& .Mui-checked .MuiSwitch-thumb': {
													backgroundColor: '#FFFFFF',
												},
												'& .MuiSwitch-track': {
													height: '100%',
												},
												'&.MuiSwitch-root .Mui-checked+.MuiSwitch-track': {
													backgroundColor: '#3AE374',
													opacity: 1,
												},
											}}
											checked={commentStatus}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='col-12 p-4'>
							<div className='btn-bx '>
								<Button onClick={() => updateComments()} variant='contained'>
									حفظ
								</Button>
							</div>
						</div>
					</div>
				</FormControl>
			</div>
		</Fragment>
	);
};

export default TemplateUpdate;
