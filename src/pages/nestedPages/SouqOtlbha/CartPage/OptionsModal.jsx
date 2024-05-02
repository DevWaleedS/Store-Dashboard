import React, { useEffect, useState, useContext } from "react";
// Third party
import { Modal } from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";
// Context
import Context from "../../../../Context/context";
import { LoadingContext } from "../../../../Context/LoadingProvider";
// Components
import ProductOptions from "../ProductOptions";
// Icons
import Close from "@mui/icons-material/Close";

function OptionsModal({
	modalData,
	openModal,
	colseOptionModal,
	reload,
	setReload,
}) {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const [selectedValues, setSelectedValues] = useState([]);
	const getItemOptions = (item) => {
		const product = selectedValues?.find((x) => x?.id === item?.id);
		return product ? product?.options : item?.options;
	};

	const [newQty, setNewQty] = useState(Number(modalData?.qty));
	const [optionID, setOptionID] = useState(null);
	const [productPrice, setProductPrice] = useState(Number(modalData?.price));
	const [productStock, setProductStock] = useState(Number(modalData?.stock));
	const [productLessQty, setProductLessQty] = useState(
		Number(modalData?.less_qty)
	);

	useEffect(() => {
		setNewQty(Number(modalData?.qty));
		setSelectedValues(getItemOptions(modalData));
	}, [modalData]);

	const handleIncrement = () => {
		setNewQty(Number(newQty) + 1);
	};

	const handleDecrement = () => {
		setNewQty(Number(newQty) !== 1 ? Number(newQty) - 1 : Number(newQty));
	};

	const updateQtyValue = (e) => {
		setNewQty(Number(e.target.value.replace(/^0+/, "")));
	};

	const handleChangeOptions = (e, index) => {
		const { value } = e.target;
		setSelectedValues((prevSelectedValues) => {
			const updatedValues = [...prevSelectedValues];
			updatedValues[index] = value;
			return updatedValues;
		});
	};

	const findMatchingSubArray = (nestedArray, array) => {
		for (let i = 0; i < nestedArray?.length; i++) {
			const subArray = nestedArray[i];
			const subArrayValue = subArray?.name?.ar;
			if (array?.every((value) => subArrayValue?.includes(value))) {
				return {
					id: subArray?.id,
					price: subArray?.price,
					less_qty: subArray?.less_qty,
					quantity: subArray?.quantity,
				};
			}
		}

		return null;
	};

	useEffect(() => {
		if (
			selectedValues?.filter((value) => value !== "")?.length > 0 &&
			modalData?.product?.amount === 1
		) {
			const optionNames = modalData?.product?.options?.map((option) => option);
			const matchingSubArray = findMatchingSubArray(
				optionNames,
				selectedValues?.filter((value) => value !== "")
			);
			setOptionID(Number(matchingSubArray?.id));
			setProductPrice(Number(matchingSubArray?.price));
			setProductStock(Number(matchingSubArray?.quantity));
			setProductLessQty(Number(matchingSubArray?.less_qty));
		}
	}, [selectedValues, modalData?.product]);

	const handleQut = (less_qty) => {
		if (less_qty === 1) {
			return "قطعة واحدة";
		} else if (less_qty === 2) {
			return "قطعتين";
		} else if (less_qty >= 3 && less_qty <= 10) {
			return `${less_qty} قطع `;
		} else if (less_qty > 10) {
			return `${less_qty} قطعة `;
		}
	};

	// Handle Update Cart
	const updateCart = () => {
		setLoadingTitle("جاري تحديث السلة");
		let formData = new FormData();
		formData.append("data[0][id]", modalData?.product?.id);
		formData.append("data[0][price]", productPrice);
		formData.append("data[0][qty]", newQty);
		formData.append([`data[0][item]`], Number(modalData?.id));
		if (optionID !== null) {
			formData.append("data[0][option_id]", optionID);
		}
		axios
			.post(`addImportCart`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (
					res?.data?.success === true &&
					res?.data?.message?.en === "Cart Added successfully"
				) {
					setLoadingTitle("");
					setReload(!reload);
					setEndActionTitle("تم تحديث السلة بنجاح");
					colseOptionModal();
				} else {
					setLoadingTitle("");
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
				}
			});
	};

	return (
		<Modal isOpen={openModal} toggle={colseOptionModal} centered size='md'>
			<div className='quickview'>
				<button className='close' type='button' onClick={colseOptionModal}>
					<Close />
				</button>
				<div className='product-price'>
					{productPrice} <span className='tax-currency'> ر.س </span>
					<span className='tax-text'>السعر شامل الضريبة</span>
				</div>
				{modalData?.product?.product_has_options === 1 && (
					<ProductOptions
						product={modalData?.product}
						attributes={modalData?.product?.attributes}
						selectedValues={selectedValues}
						updateSelectOptions={handleChangeOptions}
						itemProduct={modalData}
					/>
				)}
				<div className='form-product-option'>
					<label htmlFor='product-quantity'>
						الكمية :<span>أقل كمية للطلب ({handleQut(productLessQty)})</span>
					</label>
					<div className='product-actions m-0'>
						<button
							type='button'
							onClick={() => {
								if (newQty < productLessQty) {
									toast.error(`أقل كمية للطلب هي ${+productLessQty}`);
									setNewQty(productLessQty);
								} else {
									updateCart();
								}
							}}
							disabled={Number(modalData?.qty) === Number(newQty)}>
							تحديث السلة
						</button>
						<div className='quantity'>
							<button
								className='add'
								onClick={() => {
									if (newQty + 1 > Number(productStock)) {
										toast.error(
											`الكمية المتوفرة ${
												+productStock === 1
													? "قطعة واحدة "
													: +productStock === 2
													? " قطعتين "
													: ` ${+productStock} قطع`
											} فقط `
										);
									} else {
										handleIncrement();
									}
								}}>
								+
							</button>
							<input
								type='number'
								min={1}
								name='qty'
								value={newQty}
								onChange={(e) => {
									if (e.target.value > Number(productStock)) {
										toast.error(
											`الكمية المتوفرة ${
												+productStock === 1
													? "قطعة واحدة "
													: +productStock === 2
													? " قطعتين "
													: ` ${+productStock} قطع`
											} فقط `
										);
									} else if (Number(e.target.value) < Number(productLessQty)) {
										toast.error(`أقل كمية للطلب هي ${+productLessQty}`);
									} else {
										updateQtyValue(e);
									}
								}}
							/>
							<button
								className='sub'
								onClick={() => {
									if (newQty - 1 < Number(productLessQty)) {
										toast.error(`أقل كمية للطلب هي ${+productLessQty}`);
										setNewQty(productLessQty);
									} else {
										handleDecrement();
									}
								}}
								disabled={Number(newQty) <= 0}>
								-
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export default OptionsModal;
