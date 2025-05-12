import React, { useState, useEffect, useRef } from "react";

// Third party
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

// Components
import OrderInfo from "./OrderInfo";
import ExportOrder from "./ExportOrder";
import RefundOrder from "./RefundOrder";
import CustomerInfo from "./CustomerInfo";
import OrderItemsInfo from "./OrderItemsInfo";
import AddStoreAddress from "./AddStoreAddress";
import { TopBarSearchInput } from "../../../../global/TopBar";
import SelectShippingStatus from "./SelectShippingStatus";
import PrintShippingSticker from "./PrintShippingSticker";
import Breadcrumb from "../../../../components/Breadcrumb/Breadcrumb";
import { CircularLoading } from "../../../../HelperComponents";
import RefundAmountModal from "./RefundAmountModal";

// RTK Query
import { useGetOrderByIdQuery } from "../../../../store/apiSlices/ordersApiSlices/ordersApi";
import { useGetShippingCitiesQuery } from "../../../../store/apiSlices/selectorsApis/selectShippingCitiesApi";

const OrderDetails = () => {
	// Handle print this page as pdf file
	const componentRef = useRef();

	// get current order by id
	const { id } = useParams();
	const { data: currentOrder, isFetching } = useGetOrderByIdQuery(id);
	// get shipping cities data
	const [shippingId, setShippingId] = useState(null);

	const { data: shippingCitiesData } = useGetShippingCitiesQuery(shippingId);

	// to handle set date rang of shipping
	const [value, setValue] = useState(null);
	const [shipping, setShipping] = useState({
		district: "",
		city: "",
		address: "",
		pickup_date: "",
	});

	// Handle errors
	const [error, setError] = useState({
		district: "",
		city: "",
		address: "",
		pickup_date: "",
	});
	const resetError = () => {
		setError({
			district: "",
			city: "",
			address: "",
			pickup_date: "",
		});
	};

	function removeDuplicates(arr) {
		const unique = arr?.filter((obj, index) => {
			return (
				index ===
				arr?.findIndex((o) => obj?.region?.name_en === o?.region?.name_en)
			);
		});
		return unique;
	}

	const getCityFromProvince =
		shippingCitiesData?.cities?.filter(
			(obj) => obj?.region?.name_en === shipping?.district
		) || [];

	function translateCityName(name) {
		const unique = shippingCitiesData?.cities?.filter(
			(obj) => obj?.name_en === name
		);

		return unique?.[0]?.name || name;
	}

	const translateProvinceName = (name) => {
		const matchingCity = shippingCitiesData?.cities?.find(
			(city) => city?.region?.name_en === name
		);

		return matchingCity?.region?.name || name;
	};

	useEffect(() => {
		if (currentOrder?.orders?.shippingtypes) {
			setShippingId(currentOrder?.orders?.shippingtypes?.id);
		}
	}, [currentOrder?.orders?.shippingtypes]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تفاصيل الطلب</title>
			</Helmet>

			<section className='order-details-page orders-pages p-md-3' id='report'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<section ref={componentRef}>
					{/* Order Details Header */}
					<div className='head-category mb-3 pt-md-4'>
						<div className='row '>
							<div className='col-md-6 col-12'>
								<Breadcrumb
									icon={"arrowRight"}
									pageTile={"تفاصيل الطلب"}
									currentPage={"تفاصيل الطلب"}
									parentPage={"جدول الطلبات"}
									route={"/Orders"}
								/>
							</div>
							<div className='col-md-5 col-12 d-flex justify-content-end  order__number'>
								<div className='order-number'>
									<div className='title'>
										<h5>رقم الطلب</h5>
									</div>
									<div className='number'>
										{isFetching ? 0 : currentOrder?.orders?.order_number}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* order-details-body */}
					{isFetching ? (
						<section>
							<CircularLoading />
						</section>
					) : (
						<section className='order-details-body'>
							<div className='mb-md-5 mb-4'>
								{/* order info */}
								<OrderInfo currentOrder={currentOrder} />

								{/* order items info */}
								<div className='mb-md-5 mb-4'>
									<OrderItemsInfo currentOrder={currentOrder} />
								</div>

								{/* customer info */}
								<div className='mb-md-5 mb-4'>
									<CustomerInfo
										currentOrder={currentOrder}
										translateCityName={translateCityName}
										translateProvinceName={translateProvinceName}
									/>
								</div>
							</div>

							{/* add Store address */}
							{!currentOrder?.orders?.is_service &&
							(currentOrder?.orders?.status !== "ملغي" ||
								currentOrder?.orders?.status !== "مكتمل") ? (
								<div className='mb-md-5 mb-4'>
									<AddStoreAddress
										value={value}
										error={error}
										shipping={shipping}
										setValue={setValue}
										resetError={resetError}
										setShipping={setShipping}
										currentOrder={currentOrder}
										removeDuplicates={removeDuplicates}
										shippingCitiesData={shippingCitiesData}
										getCityFromProvince={getCityFromProvince}
										translateProvinceName={translateProvinceName}
									/>
								</div>
							) : null}
						</section>
					)}
				</section>

				{/* Order options */}
				<section className={`${isFetching ? "d-none" : "order-details-body"}`}>
					<div className='mb-md-5 mb-4'>
						<div className='order-details-box'>
							<div className='px-md-3'>
								{/* select shipping status */}
								{currentOrder?.orders?.status !== "ملغي" ||
								currentOrder?.orders?.status !== "مكتمل" ? (
									<SelectShippingStatus
										id={id}
										error={error}
										value={value}
										shipping={shipping}
										setValue={setValue}
										setError={setError}
										resetError={resetError}
										currentOrder={currentOrder}
									/>
								) : null}

								{/* Return order */}

								{!currentOrder?.orders?.is_service ? (
									<RefundOrder currentOrder={currentOrder} id={id} />
								) : null}

								{/* Export order */}
								<ExportOrder componentRef={componentRef} />

								{/* Print Shipping Sticker */}
								{!currentOrder?.orders?.is_service ? (
									<PrintShippingSticker currentOrder={currentOrder} />
								) : null}
							</div>
						</div>
					</div>
				</section>
			</section>

			{/*Refund Amount Modal */}
			<RefundAmountModal currentOrder={currentOrder} id={id} />
		</>
	);
};

export default OrderDetails;
