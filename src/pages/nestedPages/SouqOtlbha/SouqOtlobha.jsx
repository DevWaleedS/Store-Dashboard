import React, { useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import useFetch from "../../../Hooks/UseFetch";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import {
	SouqOtlbhaProducts,
	ProductsFilterOperations,
	CartMenu,
} from "./index";

// ICONS
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { FilterIcon } from "../../../data/Icons";

import { TopBarSearchInput } from "../../../global";
import SuccessMessageModal from "../../CheckoutPage/SuccessMessageModal";
import { useDispatch, useSelector } from "react-redux";
import { SouqOtlobhaThunk } from "../../../store/Thunk/SouqOtlobhaThunk";
import { TablePagination } from "../../../components/Tables/TablePagination";

const SouqOtlobha = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = React.useState(1);
	const [rowsCount, setRowsCount] = React.useState(10);
	const { products, categories, currentPage, pageCount } = useSelector(
		(state) => state.SouqOtlobhaSlice
	);

	/** get contact data */
	React.useEffect(() => {
		dispatch(SouqOtlobhaThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);
	/** ------------------------------------------------------------ */

	const {
		fetchedData: cartData,
		loading,
		reload,
		setReload,
	} = useFetch("showImportCart");

	const [showFilteringOptions, setShowFilteringOptions] = useState(false);

	const [showCart, setShowCart] = useState(false);

	// ---------------------------------------------------------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | سوق اطلبها</title>
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
								<div
									className='shipping-icon'
									onClick={() => setShowCart(!showCart)}>
									<LocalMallOutlinedIcon />
									<span className='number'>
										{loading
											? 0
											: cartData?.data?.cart?.count
											? cartData?.data?.cart?.count
											: 0}
									</span>
								</div>
								<span className='text'>
									المنتجات التي تمت اضافتها لسلة الاستيراد
								</span>
								{showCart && (
									<CartMenu
										data={cartData?.data?.cart}
										reload={reload}
										setReload={setReload}
									/>
								)}
							</div>
							{showCart && (
								<div
									className='cart-menu-layout'
									onClick={() => setShowCart(false)}
								/>
							)}
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
									العودة إلى لوحة التحكم
								</button>
							</div>
						</div>
					</div>
					<div className='mb-md-5 mb-3'>
						<ProductsFilterOperations
							showFilteringOptions={showFilteringOptions}
							categories={categories}
							products={products}
						/>
					</div>
					<div className='mb-3'>
						<SouqOtlbhaProducts data={products} loading={loading} />
					</div>

					{/** Pagination */}
					{products?.length !== 0 && !loading && (
						<TablePagination
							page={products}
							pageCount={pageCount}
							currentPage={currentPage}
							pageTarget={pageTarget}
							rowsCount={rowsCount}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
						/>
					)}
				</div>
			</section>

			{/* This will be open after checkout */}
			<SuccessMessageModal />
		</>
	);
};

export default SouqOtlobha;
