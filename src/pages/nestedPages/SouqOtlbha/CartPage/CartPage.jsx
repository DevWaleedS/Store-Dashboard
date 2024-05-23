import React, { useState, useEffect, useContext } from "react";
// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Context
import Context from "../../../../Context/context";
import { LoadingContext } from "../../../../Context/LoadingProvider";

// Components
import OptionsModal from "./OptionsModal";
import { Breadcrumb } from "../../../../components";
import CircularLoading from "../../../../HelperComponents/CircularLoading";

// Icons
import { Cross10 } from "../../../../data/Icons";

// RTK Query
import {
	useDeleteItemFromCartMutation,
	useImportProductToStoreProductsMutation,
	useShowImportProductsCartDataQuery,
} from "../../../../store/apiSlices/souqOtlobhaProductsApi";

function CartPage() {
	// Show import products cart data
	const { data: showImportProductsCartData, isLoading: isCartLoading } =
		useShowImportProductsCartDataQuery();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const [productInfo, setProductInfo] = useState([]);
	const [newproductInfo, setNewProductInfo] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState(null);

	useEffect(() => {
		if (showImportProductsCartData?.cartDetail) {
			setProductInfo(showImportProductsCartData?.cartDetail);
			setNewProductInfo(showImportProductsCartData?.cartDetail);
		}
	}, [showImportProductsCartData?.cartDetail]);

	const updateQtyValue = (index, e) => {
		const temp = newproductInfo?.map((item, idx) => {
			if (index === idx) {
				return { ...item, [e.target.name]: e.target.value.replace(/^0+/, "") };
			} else {
				return item;
			}
		});
		setNewProductInfo(temp);
	};

	const handleIncrement = (index) => {
		const temp = newproductInfo?.map((item, idx) => {
			if (index === idx) {
				return { ...item, qty: Number(item?.qty) + 1 };
			} else {
				return item;
			}
		});
		setNewProductInfo(temp);
	};

	const handleDecrement = (index) => {
		const temp = newproductInfo?.map((item, idx) => {
			if (index === idx) {
				return {
					...item,
					qty:
						Number(item?.qty) !== 1 ? Number(item?.qty) - 1 : Number(item?.qty),
				};
			} else {
				return item;
			}
		});
		setNewProductInfo(temp);
	};

	// delete item from cart function
	const [deleteImportCart, { isLoading }] = useDeleteItemFromCartMutation();
	const handleDeleteItemFromCart = async (id) => {
		try {
			await deleteImportCart({ id })
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					} else {
						setEndActionTitle(data?.message?.ar);
					}
				});
		} catch (err) {
			console.error("Failed to delete the deleteImportCart", err);
		}
	};

	const findMatchingSubArray = (nestedArray, array) => {
		for (let i = 0; i < nestedArray?.length; i++) {
			const subArray = nestedArray[i];
			const subArrayValue = subArray?.name?.ar;
			if (array?.every((value) => subArrayValue?.includes(value))) {
				return {
					id: subArray?.id,
				};
			}
		}

		return null;
	};

	// Handle Update Cart
	const [importProductToStoreProducts, { isUpdateCartIsLoading }] =
		useImportProductToStoreProductsMutation();

	const handleUpdateCart = async () => {
		setLoadingTitle("جاري تحديث السلة");

		// data that send to api..
		let formData = new FormData();
		for (let i = 0; i < newproductInfo?.length; i++) {
			formData.append([`data[${i}][id]`], newproductInfo?.[i]?.product?.id);
			formData.append(
				[`data[${i}][price]`],
				Number(newproductInfo?.[i]?.price)
			);
			formData.append([`data[${i}][qty]`], newproductInfo?.[i]?.qty);
			const optionNames = newproductInfo?.[i]?.product?.options?.map(
				(option) => option
			);
			const matchingSubArray = findMatchingSubArray(
				optionNames,
				newproductInfo?.[i]?.options
			);
			if (
				matchingSubArray &&
				matchingSubArray.id !== undefined &&
				matchingSubArray.id !== null
			) {
				formData.append(`data[${i}][option_id]`, matchingSubArray.id);
			}
		}

		// make request...
		try {
			const response = await importProductToStoreProducts({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				setEndActionTitle("تم تحديث السلة بنجاح");
			} else {
				setLoadingTitle("");
				toast.error(response?.data?.message?.ar, {
					theme: "light",
				});

				toast.error(response?.data?.message?.en?.["data.0.price"]?.[0], {
					theme: "light",
				});
				toast.error(response?.data?.message?.en?.["data.0.qty"]?.[0], {
					theme: "light",
				});
				toast.error(response?.data?.message?.en?.["data.0.option"]?.[0], {
					theme: "light",
				});
			}
		} catch (error) {
			console.error("Error changing handleUpdateCart:", error);
		}
	};

	const updateCartDisabled = productInfo?.every((item) =>
		newproductInfo?.some(
			(product) => Number(product?.qty) === Number(item?.qty)
		)
	);

	const openOptionSModal = (item) => {
		setOpenModal(true);
		setModalData(item);
	};

	const colseOptionModal = () => {
		setOpenModal(false);
		setModalData(null);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | سلة الاستيراد </title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<Breadcrumb
					parentPage={"سوق اطلبها"}
					route={"/Products/SouqOtlobha"}
					currentPage={"سلة الاستيراد"}
				/>

				<div className='cart-page'>
					<h3>سلة استيراد منتجات سوق اطلبها</h3>
					<div className='block'>
						<div className='container'>
							{isCartLoading ? (
								<CircularLoading />
							) : showImportProductsCartData ? (
								<>
									<div className='table-responsive'>
										<table className='cart-table'>
											<thead>
												<tr>
													<th style={{ width: "1px" }}>الصورة</th>
													<th style={{ textAlign: "justify" }}>اسم المنتج</th>
													<th>السعر</th>
													<th>الكمية</th>
													<th>الإجمالي</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												{newproductInfo?.map((product, index) => (
													<tr key={product?.id}>
														<td>
															<div className='image'>
																<Link
																	to={`/Products/SouqOtlobha/ProductRefund/${product?.product?.id}`}>
																	<img
																		src={product?.product?.cover}
																		alt='product-img'
																	/>
																</Link>
															</div>
														</td>
														<td className='name'>
															<Link
																to={`/Products/SouqOtlobha/ProductRefund/${product?.product?.id}`}>
																{product?.product?.name}
															</Link>
															{product?.options && (
																<ul className='options'>
																	{product?.options?.map((option, index) => (
																		<li
																			key={index}
																			onClick={() =>
																				openOptionSModal(product)
																			}>{`${
																			index === 0 ? `${option}` : `/ ${option}`
																		}`}</li>
																	))}
																</ul>
															)}
														</td>
														<td>{Number(product?.price)} ر.س</td>
														<td>
															<div className='qty'>
																<button
																	onClick={() => {
																		if (
																			Number(product?.qty) + 1 >
																			Number(product?.stock)
																		) {
																			toast.error(
																				`الكمية المتوفرة ${
																					+product?.stock === 1
																						? "قطعة واحدة "
																						: +product?.stock === 2
																						? " قطعتين "
																						: ` ${+product?.stock} قطع`
																				} فقط `
																			);
																		} else {
																			handleIncrement(index);
																		}
																	}}>
																	+
																</button>
																<input
																	type='number'
																	min={1}
																	name='qty'
																	value={Number(product?.qty)}
																	onChange={(e) => {
																		if (
																			e.target.value > Number(product?.stock)
																		) {
																			toast.error(
																				`الكمية المتوفرة ${
																					+product?.stock === 1
																						? "قطعة واحدة "
																						: +product?.stock === 2
																						? " قطعتين "
																						: ` ${+product?.stock} قطع`
																				} فقط `
																			);
																		} else if (
																			Number(e.target.value) <
																			Number(product?.less_qty)
																		) {
																			toast.error(
																				`أقل كمية للطلب هي ${+product?.less_qty}`
																			);
																		} else {
																			updateQtyValue(index, e);
																		}
																	}}
																/>
																<button
																	onClick={(e) => {
																		if (
																			Number(product?.qty) - 1 <
																			Number(product?.less_qty)
																		) {
																			toast.error(
																				`أقل كمية للطلب هي ${+product?.less_qty}`
																			);
																		} else {
																			handleDecrement(index);
																		}
																	}}
																	disabled={Number(product?.qty) <= 0}>
																	-
																</button>
															</div>
														</td>
														<td>
															{Number(product?.price) * Number(product?.qty)}{" "}
															ر.س
														</td>
														<td>
															<button
																disabled={isLoading}
																className='remove'
																onClick={() =>
																	handleDeleteItemFromCart(product?.id)
																}>
																<Cross10 />
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
									<div className='actions'>
										<div className='buttons update-cart-btn'>
											<Link to='/Products/SouqOtlobha'>العودة لسوق اطلبها</Link>
											<button
												onClick={() => handleUpdateCart()}
												type='button'
												className='update'
												disabled={updateCartDisabled || isUpdateCartIsLoading}>
												تحديث السلة
											</button>
										</div>
									</div>
									<div className='row justify-content-end pt-md-5 pt-4'>
										<div className='col-12 col-md-7 col-lg-6 col-xl-5'>
											<div className='card'>
												<div className='card-body'>
													<h3>إجمالي السلة</h3>
													<table>
														<thead>
															<tr>
																<th style={{ textAlign: "justify" }}>السعر</th>
																<td>
																	{showImportProductsCartData?.subtotal} ر.س
																</td>
															</tr>
														</thead>
														<tbody>
															<tr>
																<th>الضريبة</th>
																<td>{showImportProductsCartData?.tax} ر.س</td>
															</tr>
															{showImportProductsCartData?.overweight_price !==
																null &&
																showImportProductsCartData?.overweight_price !==
																	0 && (
																	<tr>
																		<th>
																			قيمة الوزن الزائد (
																			{showImportProductsCartData?.overweight}{" "}
																			kg)
																		</th>
																		<td>
																			{
																				showImportProductsCartData?.overweight_price
																			}{" "}
																			ر.س
																		</td>
																	</tr>
																)}
															<tr>
																<th>الشحن</th>
																<td>
																	{showImportProductsCartData?.shipping_price}{" "}
																	ر.س
																</td>
															</tr>

															{showImportProductsCartData?.discount_total ? (
																<tr>
																	<th>
																		الخصم
																		{showImportProductsCartData?.discount_type ===
																		"percent" ? (
																			<span
																				style={{
																					fontSize: "0.85rem",
																					color: "#7e7e7e",
																				}}>
																				(
																				{
																					showImportProductsCartData?.discount_value
																				}
																				%)
																			</span>
																		) : null}
																	</th>
																	<td>
																		{showImportProductsCartData?.discount_total}{" "}
																		ر.س
																	</td>
																</tr>
															) : null}
														</tbody>
														<tfoot>
															<tr>
																<th>
																	الإجمالي{" "}
																	<span className='tax-text'>
																		(شامل الضريبة)
																	</span>
																</th>
																<td>{showImportProductsCartData?.total} ر.س</td>
															</tr>
														</tfoot>
													</table>
													<Link
														to='/Products/SouqOtlobha/Checkout'
														className='checkout-btn'>
														الاستمرار إلى الدفع
													</Link>
												</div>
											</div>
										</div>
									</div>
								</>
							) : (
								<div className='empty'>
									<span>سلة الاستيراد الخاصة بك فارغة!</span>
									<Link to='/Products/SouqOtlobha'>العودة إلى سوق اطلبها</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
			<OptionsModal
				modalData={modalData}
				openModal={openModal}
				colseOptionModal={colseOptionModal}
			/>
		</>
	);
}

export default CartPage;
