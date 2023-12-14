import React, { useState, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import useFetch from "../../../Hooks/UseFetch";
import { useNavigate } from "react-router-dom";

// Context
import Context from "../../../Context/context";

// MUI
import { Menu, MenuItem } from "@mui/material";

// COMPONENTS
import { SouqOtlbhaProducts, ProductsFilterOperations, CartMenu } from "./index";

// ICONS
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { FilterIcon } from "../../../data/Icons";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
	MdOutlineArrowBackIosNew,
	MdOutlineArrowForwardIos,
} from "react-icons/md";
import { TopBarSearchInput } from "../../../global";

const SouqOtlobha = () => {
	const navigate = useNavigate();
	const { fetchedData: cartData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/showImportCart"
	);

	const [showFilteringOptions, setShowFilteringOptions] = useState(false);
	const contextStore = useContext(Context);
	const { productsData } = contextStore;

	const [showCart, setShowCart] = useState(false);

	/**
	 *------------------------------------------------------------------------
	 * TO CREATE PAGINATION
	 *------------------------------------------------------------------------
	 */
	const [page, setPage] = useState(0);
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const allRows = () => {
		const num = Math.ceil(productsData?.length / rowsPerPage);
		const arr = [];
		for (let index = 0; index < num; index++) {
			arr.push(index + 1);
		}
		return arr;
	};
	// ---------------------------------------------------------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | سوق أطلبها</title>
			</Helmet>
			<section className='souqOtlobha-page'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='souqOtlobha-wrapper p-md-4'>
					<div className='row mb-md-4 mb-3'>
						<div className='col-lg-6 col-12 mb-lg-0 mb-3'>
							<div className='total-products'>
								<div className="shipping-icon" onClick={() => setShowCart(!showCart)}>
									<LocalMallOutlinedIcon />
									<span className="number">{loading ? 0 : cartData?.data?.cart?.count ? cartData?.data?.cart?.count : 0}</span>
								</div>
								<span className="text">المنتجات التي تمت اضافتها لسلة الاستيراد</span>
								{showCart && <CartMenu data={cartData?.data?.cart} reload={reload} setReload={setReload} />}
							</div>
							{showCart && <div className='cart-menu-layout' onClick={() => setShowCart(false)} />}
						</div>
						<div className='col-lg-6 col-12'>
							<div className='btn-group d-flex gap-4 me-0 me-lg-5'>
								<button
									className='d-flex justify-content-center align-items-center'
									onClick={() =>
										setShowFilteringOptions(!showFilteringOptions)
									}>
									<FilterIcon />
									<span>فرز</span>
								</button>
								<button
									className='d-flex justify-content-center align-items-center'
									onClick={() => {
										navigate("/Products");
									}}>
									العودة الى لوحة التحكم
								</button>
							</div>
						</div>
					</div>
					<div className='mb-md-5 mb-3'>
						<ProductsFilterOperations
							showFilteringOptions={showFilteringOptions}
						/>
					</div>
					<div className='mb-3'>
						<SouqOtlbhaProducts
							data={productsData}
							loading={loading}
							page={page}
							rowsPerPage={rowsPerPage}
						/>
					</div>
					{/** Pagination */}
					{productsData?.length !== 0 && !loading && (
						<div className='pagination-box d-flex flex-md-row flex-column justify-content-center align-items-center'>
							<div
								className='d-flex align-items-center justify-content-center  my-3 m-md-auto'
								style={{ gap: "1rem" }}>
								<MdOutlineArrowForwardIos
									style={{
										visibility: page + 1 === allRows()?.length && "hidden",
										cursor: "pointer",
									}}
									onClick={() => {
										setPage(page + 1);
									}}
								/>
								<div className='d-flex flex-row-reverse gap-2'>
									{allRows().map((item, itemIdx) => {
										if (
											(itemIdx < 1 ||
												(itemIdx >= page - 1 && itemIdx <= page + 1)) &&
											(Math.ceil(productsData?.length) <= 3 ||
												(Math.ceil(productsData?.length) > 3 &&
													itemIdx < allRows()?.length - 1))
										) {
											return (
												<div
													key={itemIdx}
													className='d-flex justify-content-center align-items-center'
													style={{
														width: "1.7rem",
														height: "1.9rem",
														cursor: "pointer",
														fontWight: "500",
														lineHeight: "1.7rem",
														borderRadius: "10px",
														backgroundColor: item === page + 1 && "#508FF4",
														color: item === page + 1 && "#fff",
													}}
													onClick={() => {
														setPage(itemIdx);
													}}>
													{item}
												</div>
											);
										}
										return null;
									})}
									{Math.ceil(productsData?.length / rowsPerPage) > 3 && (
										<div>...</div>
									)}
									{Math.ceil(productsData?.length / rowsPerPage) > 1 && (
										<div
											className='d-flex justify-content-center align-items-center'
											style={{
												width: "1.7rem",
												height: "1.9rem",
												cursor: "pointer",
												fontWight: "500",
												lineHeight: "1.7rem",
												borderRadius: "10px",
												backgroundColor:
													Math.ceil(productsData?.length / rowsPerPage) ===
													page + 1 && "#508FF4",
												color:
													Math.ceil(productsData?.length / rowsPerPage) ===
													page + 1 && "#fff",
											}}
											onClick={() => {
												setPage(
													Math.ceil(productsData?.length / rowsPerPage) - 1
												);
											}}>
											{Math.ceil(productsData?.length / rowsPerPage)}
										</div>
									)}
								</div>
								<MdOutlineArrowBackIosNew
									style={{
										visibility: page === 0 && "hidden",
										cursor: "pointer",
									}}
									onClick={() => {
										setPage(page - 1);
									}}
								/>
							</div>

							<div
								className='d-flex align-items-center gap-2  px-3 py-1'
								style={{
									border: "1px solid #2D62ED",
									borderRadius: "0.375rem",
								}}>
								<Menu
									id='basic-menu'
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}>
									{rowsPerPagesCount.map((rowsPer, rowsIdx) => {
										return (
											<MenuItem
												value={rowsPer}
												onClick={(e) => {
													handleChangeRowsPerPage(e);
													handleClose();
												}}
												key={rowsIdx}
												sx={{
													width: "2.8rem",
													pr: "9px",
													pl: "9px",
													backgroundColor: "#FFFFF",
													"ul:has(&)": {
														p: 0,
													},
													"ul:has(&) li:hover": {
														backgroundColor: "#C6E1F0",
													},
												}}>
												{rowsPer}
											</MenuItem>
										);
									})}
								</Menu>
								<h2
									style={{
										color: "#0077FF",
										fontSize: "20px",
										fontWeight: "500",
									}}>
									عدد الصفوف
								</h2>

								<div
									id='basic-button'
									aria-controls={open ? "basic-menu" : undefined}
									aria-haspopup='true'
									aria-expanded={open ? "true" : undefined}
									onClick={handleRowsClick}
									className='d-flex justify-content-center align-items-center '
									style={{
										backgroundColor: " #c6e1f0",
										cursor: "pointer",
										borderRadius: "0.125rem",
										width: "2.8rem",
										height: "2.8rem",
									}}>
									<MdOutlineKeyboardArrowDown
										color='#0099FB'
										fontSize={"1.5rem"}></MdOutlineKeyboardArrowDown>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default SouqOtlobha;
