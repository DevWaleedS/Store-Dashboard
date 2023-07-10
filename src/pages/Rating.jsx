import React, { useContext, useState } from 'react';
import { Helmet } from "react-helmet";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Import link from react router dom
import { Link } from 'react-router-dom';

// Import icons
import howIcon from '../data/Icons/icon_24_home.svg';
import { GrFormFilter } from 'react-icons/gr';

import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';
import RatingWeight from '../components/RatingWeight';
import { ReactComponent as StoreIcon } from '../data/Icons/icon-24-store.svg';
import { ReactComponent as ProductIcon } from '../data/Icons/product-24.svg';
import { AiOutlineSearch } from 'react-icons/ai';
import { SendReplayModal } from '../components';
import useFetch from '../Hooks/UseFetch';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Context from '../Context/context';

const Rating = () => {
	const [cookies] = useCookies(['access_token']);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(`https://backend.atlbha.com/api/Store/comment`);
	// to get current comment status
	const commentActivation = fetchedData?.data?.commentActivation;
	const [commentDetails, setCommentDetails] = React.useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	// const filters = [
	// 	{
	// 		id: 1,
	// 		title: 'comment_of_store',
	// 		name: 'تقييم المتجر',
	// 		icon: <StoreIcon />,
	// 	},
	// 	{
	// 		id: 2,
	// 		title: 'comment_of_products',
	// 		name: 'تقييم المنتجات',
	// 		icon: <ProductIcon />,
	// 	},
	// ];

	// <FormControl sx={{ width: '100%' }}>
	// 								<Select
	// 									name='filter-rating'
	// 									value={filterSelected}
	// 									onChange={(e) => {
	// 										setFilterSelected(e.target.value);
	// 									}}
	// 									sx={{
	// 										fontSize: '20',
	// 										'& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
	// 										{
	// 											paddingRight: '25px',
	// 											marginTop: '5px',
	// 											fontSize: '20px',
	// 											'@media(max-width:768px)': {
	// 												fontSize: '16px',
	// 											},

	// 											display: 'flex',
	// 											justifyContent: 'flex-start',
	// 											alignItems: 'center',
	// 										},
	// 										'& .MuiOutlinedInput-root': {
	// 											'& :hover': {
	// 												border: 'none',
	// 											},
	// 										},
	// 										'& .MuiOutlinedInput-notchedOutline': {
	// 											border: 'none',
	// 										},
	// 										'& .MuiSelect-icon': {
	// 											right: '0',
	// 											width: '24px',
	// 											height: '24px',
	// 										},
	// 										'@media(max-width:768px)': {
	// 											'& .MuiSelect-icon': {
	// 												top: '15px',
	// 												width: '20px',
	// 												height: '20px',
	// 											},
	// 										},
	// 										'& .css-10q54uo-MuiSelect-icon, .MuiSelect-iconOpen': {
	// 											right: '0',
	// 											transform: 'rotate(0deg)',
	// 										},
	// 										'& .MuiSelect-nativeInput': {
	// 											display: 'none',
	// 										},
	// 									}}
	// 									IconComponent={GrFormFilter}
	// 									displayEmpty
	// 									inputProps={{ 'aria-label': 'Without label' }}
	// 									renderValue={(selected) => {
	// 										if (filterSelected === '') {
	// 											return (
	// 												<>
	// 													<GrFormFilter />
	// 													<span>فلتر</span>
	// 												</>
	// 											);
	// 										}
	// 										const result = filters?.filter((item) => item?.id === parseInt(selected)) || '';
	// 										return result[0]?.name;
	// 									}}
	// 								>
	// 									{filters?.map((filter, index) => {
	// 										return (
	// 											<MenuItem key={index} value={filter?.id}>
													
	// 											</MenuItem>
	// 										);
	// 									})}
	// 								</Select>
	// </FormControl>
	// const [filterSelected, setFilterSelected] = useState(1);

	// const handleClick = (event) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };
	const allRows = () => {
		const num = Math.ceil(fetchedData?.data?.comment_of_store?.length / rowsPerPage);
		const arr = [];
		for (let index = 0; index < num; index++) {
			arr.push(index + 1);
		}
		return arr;
	};

	// change Comment Status
	const changeCommentActivation = (id) => {
		axios
			.get(`https://backend.atlbha.com/api/Store/commentActivation`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الأسئلة والتقييمات </title>
			</Helmet>
			<section className='rating-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input type='text' name='search' id='search' className='input' placeholder='أدخل كلمة البحث' />
					</div>
				</div>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									الأسئلة والتقييمات
								</li>
							</ol>
						</nav>
					</div>
				</div>
				<div className='row d-flex align-items-center title-page-row mb-md-5 mb-3'>
					<div className='col-md-5'>
						<h4 className='page-tile'>الأسئلة والتقييمات</h4>
					</div>
					<div className='col-md-6 col-12'>
						<div className='row rating-filter-box d-flex justify-content-md-end justify-content-between  align-items-center '>
							<div className='col-5 d-flex justify-content-md-end justify-content-start'>
								<div className='check-box'>
									<FormControlLabel
										sx={{
											marginRight: 0,
											'& .MuiFormControlLabel-label ': {
												alignSelf: 'end',
												fontSize: '20px',
												letterSpacing: '0.2px',
												color: ' #011723',
												'@media(max-width:768px)': {
													fontSize: '16px',
													marginRight: '10px',
												},
											},
										}}
										control={
											<Switch
												onChange={() => changeCommentActivation()}
												checked={commentActivation === 'active' ? true : false}
												sx={{
													'& .MuiSwitch-track': {
														width: 36,
														height: 22,
														opacity: 1,
														backgroundColor: 'rgba(0,0,0,.25)',
														boxSizing: 'border-box',
														borderRadius: 20,
													},
													'& .MuiSwitch-thumb': {
														boxShadow: 'none',
														backgroundColor: '#EBEBEB',
														width: 16,
														height: 16,
														borderRadius: 4,
														transform: 'translate(6px,7px)',
													},
													'&:hover': {
														'& .MuiSwitch-thumb': {
															boxShadow: 'none',
														},
													},

													'& .MuiSwitch-switchBase': {
														'&:hover': {
															boxShadow: 'none',
															backgroundColor: 'none',
														},
														padding: 1,
														'&.Mui-checked': {
															transform: 'translateX(12px)',
															color: '#fff',
															'& + .MuiSwitch-track': {
																opacity: 1,
																backgroundColor: '#3AE374',
															},
															'&:hover': {
																boxShadow: 'none',
																backgroundColor: 'none',
															},
														},
													},
												}}
											/>
										}
										label='تفعيل التقييمات'
									/>
								</div>
							</div>
							
						</div>
					</div>
				</div>
				<div className='rating-wrapper'>
					<div className='rating-bx mb-md-5 mb-3'>
						<RatingWeight  setCommentDetails={setCommentDetails} fetchedData={fetchedData} loading={loading} reload={reload} setReload={setReload} />
					</div>
					{fetchedData?.data?.comment_of_products?.length !== 0 ?
						<div className='pagination-box'>
							<div className='d-flex align-items-center justify-content-center mt-3 mt-md-0' style={{ gap: '1rem' }}>
								<MdOutlineArrowForwardIos
									style={{ visibility: page + 1 === allRows().length && 'hidden', cursor: 'pointer' }}
									onClick={() => {
										setPage(page + 1);
									}}
								/>
								<div className='d-flex flex-row-reverse gap-2'>
									{allRows().map((item, itemIdx) => {
										return (
											<div
												key={itemIdx}
												className='d-flex justify-content-center align-items-center'
												style={{
													width: '1.7rem',
													height: '1.9rem',
													cursor: 'pointer',
													fontWight: '500',
													lineHeight: '1.7rem',
													borderRadius: '10px',
													backgroundColor: item === page + 1 && '#508FF4',
													color: item === page + 1 && '#fff',
												}}
												onClick={() => {
													setPage(itemIdx);
												}}
											>
												{item}
											</div>
										);
									})}
								</div>
								<MdOutlineArrowBackIosNew
									style={{ visibility: page === 0 && 'hidden', cursor: 'pointer' }}
									onClick={() => {
										setPage(page - 1);
									}}
								/>
							</div>
						</div>
						: ''
					}

					{/* send rating replay component */}
					<SendReplayModal fetchedData={fetchedData} loading={loading} reload={reload} setReload={setReload} commentDetails={commentDetails} />
				</div>
			</section>
		</>
	);
};

export default Rating;
