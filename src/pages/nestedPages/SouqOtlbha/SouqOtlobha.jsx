import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import { TopBarSearchInput } from "../../../global";
import SuccessMessageModal from "../../CheckoutPage/SuccessMessageModal";
import { TablePagination } from "../../../components/Tables/TablePagination";
import {
	SouqOtlbhaProducts,
	ProductsFilterOperations,
	CartMenu,
} from "./index";

// Icons
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { FilterIcon } from "../../../data/Icons";

// RTK Query
import {
	useGetSouqOtlobhaProductsQuery,
	useShowImportProductsCartDataQuery,
} from "../../../store/apiSlices/souqOtlobhaProductsApi";

const SouqOtlobha = () => {
	const navigate = useNavigate();
	const [showCart, setShowCart] = useState(false);
	const [pageTarget, setPageTarget] = React.useState(1);
	const [rowsCount, setRowsCount] = React.useState(10);
	const [souqOtlobhaProductsData, setSouqOtlobhaProductsData] = useState([]);
	const [showFilteringOptions, setShowFilteringOptions] = useState(false);

	/** get Soqu otlobha products data */
	const { data: souqOtlobhaProducts, isLoading } =
		useGetSouqOtlobhaProductsQuery({
			page: pageTarget,
			number: rowsCount,
		});

	/** ------------------------------------------------------------ */
	// Show import products cart data
	const { data: showImportProductsCartData, isLoading: isCartLoading } =
		useShowImportProductsCartDataQuery();

	// ---------------------------------------------------------------------------------------------
	// display Products by tapSelect
	useEffect(() => {
		if (souqOtlobhaProducts?.products) {
			setSouqOtlobhaProductsData(souqOtlobhaProducts?.products);
		}
	}, [souqOtlobhaProducts]);

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
										{isCartLoading
											? 0
											: showImportProductsCartData?.count
											? showImportProductsCartData?.count
											: 0}
									</span>
								</div>
								<span className='text'>
									المنتجات التي تمت اضافتها لسلة الاستيراد
								</span>
								{showCart && <CartMenu data={showImportProductsCartData} />}
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
							page={pageTarget}
							products={souqOtlobhaProducts?.products}
							number={rowsCount}
							showFilteringOptions={showFilteringOptions}
							categories={souqOtlobhaProducts?.categories}
							setSouqOtlobhaProductsData={setSouqOtlobhaProductsData}
						/>
					</div>
					<div className='mb-3'>
						<SouqOtlbhaProducts
							products={souqOtlobhaProductsData}
							loading={isLoading}
						/>
					</div>

					{/** Pagination */}
					{souqOtlobhaProductsData?.length !== 0 && !isLoading && (
						<TablePagination
							page={souqOtlobhaProductsData}
							pageCount={souqOtlobhaProducts?.page_count}
							currentPage={souqOtlobhaProducts?.current_page}
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
