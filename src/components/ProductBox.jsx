import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";
import { ReactComponent as CurrencyIcon } from "../data/Icons/icon-24-Currency.svg";
import CircularLoading from "../HelperComponents/CircularLoading";

const ProductBox = ({ data, loading }) => {
	const navigate = useNavigate();
	return loading ? (
		<CircularLoading />
	) : (
		<Fragment>
			{data?.length === 0 ? (
				<div>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				data?.map((product, index) => (
					<div className='product-box mb-md-4 mb-3' key={index}>
						<div className='row'>
							<div className='col-sm-3 col-12 mb-sm-0 mb-3'>
								<div className='row align-items-sm-start align-items-center'>
									<div className='col-sm-2 col-4'>
										<div className='d-flex flex-column gap-3  align-items-center'>
											{product?.special === "مميز" ? (
												<span className='star-icon-bg d-flex justify-content-center align-items-center'>
													<BsStarFill className='star-icon' />
												</span>
											) : (
												""
											)}
										</div>
									</div>
									<div className='col-sm-10 col-8'>
										<img
											src={product?.cover}
											alt='product'
											loading='lazy'
											className='img-fluid'
											style={{ borderRadius: "4px" }}
										/>
									</div>
								</div>
							</div>
							<div className='col-sm-9 col-12'>
								<div className=' d-flex justify-content-between mb-4'>
									<div className='product-name text-overflow d-flex align-items-center p-3'>
										<span>{product?.name}</span>
									</div>
									<div className='product-category text-overflow d-flex align-items-center justify-content-center '>
										{product?.category?.name}
									</div>
								</div>

								<div className=' d-flex justify-content-between align-items-center flex-wrap'>
									<div className='product-price '>
										<div className='label mb-1'>سعر الشراء</div>
										<div className='input d-flex justify-content-center align-items-center'>
											<div className='price-icon d-flex  p-2 gap-3'>
												<CurrencyIcon />
												<div className='price'>{product?.purchasing_price}</div>
											</div>

											<div className='currency d-flex justify-content-center align-items-center'>
												ريال
											</div>
										</div>
									</div>
									<div className='product-price'>
										<div className='label mb-1'> الكمية في المخزن</div>
										<div className='input d-flex justify-content-center align-items-center'>
											<div className='count'>{product?.stock}</div>
										</div>
									</div>
									<div className='recovery-button'>
										<button
											className='d-flex justify-content-center align-items-center mt-sm-4 mt-2'
											onClick={() => {
												navigate(`ProductRefund/${product.id}`);
											}}>
											استيراد المنتج
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				))
			)}
		</Fragment>
	);
};

export default ProductBox;
