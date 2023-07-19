import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetActivity } from "../store/slices/AddActivity";

// ICONS
import howIcon from "../data/Icons/icon_24_home.svg";

//components
import VerifayPage from "./VerifyStoreForms/VerifayPage";
import ActivityType from "./VerifyStoreForms/ActivityType";

const cursor = {
	cursor: "pointer",
};

const VerifyStore = () => {
	const verifayPageRef = useRef(null);
	const dispatch = useDispatch(true);
	const { activity } = useSelector((state) => state.AddActivity);
	const [showErr, setShowErr] = useState(false);

	// Use state to the next button
	const [page, setPage] = useState(1);

	// Set function to change between pages
	const handleNextPage = () => {
		const nextPage = page + 1;
		if (activity.length === 0) {
			setShowErr(true);
		} else {
			setShowErr(false);
			setPage(nextPage);
		}
	};

	// Function in the parent component that will be triggered by the child component
	const handleChildButtonClick = () => {
		if (verifayPageRef.current) {
			verifayPageRef.current.uploadVerifyStoreOrder();
		}
	};
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | توثيق المتجر</title>
			</Helmet>
			<section className='verify-store-page p-lg-3'>
				<div className='head-category mb-md-4 mb-2'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item ' aria-current='page'>
									بيانات المتجر
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									توثيق المتجر
								</li>
							</ol>
						</nav>
					</div>
				</div>
				{/** current step */}
				<div className='page-wrapper'>
					<div className='row mb-4'>
						<div className='page-tabs'>
							<div className='row d-flex justify-content-start gap-md-5'>
								<div className='col-md-3 col-6'>
									<div
										onClick={() => {
											setPage(1);
											dispatch(resetActivity());
										}}
										style={cursor}
										className={
											page === 1
												? "store-type verify-tab-bx active"
												: "store-type verify-tab-bx "
										}>
										<h5>نشاط المتجر</h5>
									</div>
								</div>
								<div className='col-md-3 col-6'>
									<div
										onClick={() => {
											activity?.length === 0 ? setShowErr(true) : setPage(2);
										}}
										style={cursor}
										className={
											page === 2
												? "national-id verify-tab-bx active"
												: "national-id verify-tab-bx "
										}>
										<h5> التوثيق </h5>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/** Form Wrapper */}
					<div className='row select-store-type form-row p-md-5 p-3'>
						<form className='px-md-2 px-0'>
							<div className='col-12'>
								<div className='form'>
									{page === 1 ? (
										<ActivityType showErr={showErr} setShowErr={setShowErr} />
									) : (
										<VerifayPage ref={verifayPageRef} />
									)}{" "}
								</div>
							</div>
							<div className='col-12 d-flex justify-content-center align-items-center gap-md-5 gap-3'>
								{page > 1 ? (
									<Button
										className='prev-btn'
										onClick={() => {
											setPage(1);
											dispatch(resetActivity());
										}}>
										السابق
									</Button>
								) : (
									""
								)}
								{page === 2 ? (
									<Button
										className='next-btn custom-width'
										onClick={handleChildButtonClick}>
										رفع الطلب
									</Button>
								) : (
									<Button
										className={page > 1 ? "next-btn custom-width" : "next-btn"}
										onClick={handleNextPage}>
										التالي
									</Button>
								)}
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	);
};

export default VerifyStore;
