import React from "react";

// icons
import { FaCity } from "react-icons/fa";
import { FaMountainCity, FaSignsPost } from "react-icons/fa6";
import { User, Location, Message, Phone } from "../../../../data/Icons";

const CustomerInfo = ({
	currentOrder,
	translateProvinceName,
	translateCityName,
}) => {
	return (
		<div className='order-details-box'>
			<div className='title mb-4'>
				<h5>بيانات العميل</h5>
			</div>
			<div className='order-details-data pt-md-4 pb-md-4'>
				<div className='row d-flex flex-md-row flex-column justify-content-center'>
					<div className='col-lg-2 col-12 mb-lg-0 mb-3'>
						<div className='client-date'>
							<div className='img mb-2'>
								<img
									alt=''
									loading={"lazy"}
									className=' img-fluid'
									src={currentOrder?.orders?.user?.image}
								/>
							</div>
						</div>
					</div>
					<div className='col-lg-10 col-12'>
						<div className='row mb-md-4 mb-3'>
							<div className='col-md-6 col-12 mb-3'>
								<h6 className='mb-2'>اسم العميل</h6>
								<div className='info-box'>
									<User className='client-icon' />
									<span className=' text-overflow'>
										{`${currentOrder?.orders?.user?.name} ${currentOrder?.orders?.user?.lastname}`}
									</span>
								</div>
							</div>
							<div className='col-md-6 col-12 mb-3'>
								<h6 className='mb-2'>رقم الهاتف</h6>
								<div className='info-box'>
									<Phone />
									<span style={{ direction: "ltr" }}>
										{currentOrder?.orders?.user?.phonenumber?.startsWith("+966")
											? currentOrder?.orders?.user?.phonenumber?.slice(4)
											: currentOrder?.orders?.user?.phonenumber?.startsWith(
													"00966"
											  )
											? currentOrder?.orders?.user?.phonenumber?.slice(5)
											: currentOrder?.orders?.user?.phonenumber}
									</span>
								</div>
							</div>
						</div>
						<div className='row'>
							<div
								className={`mb-3 ${
									currentOrder?.orders?.is_service
										? "col-12 "
										: "col-md-6 col-12 "
								}`}>
								<h6 className='mb-2'>البريد الالكتروني</h6>
								<div
									className='info-box'
									style={{
										justifyContent: "flex-start",
										gap: "30px",
									}}>
									<Message />

									<span className='text-overflow '>
										{currentOrder?.orders?.user?.email}
									</span>
								</div>
							</div>
							{!currentOrder?.orders?.is_service ? (
								<>
									{" "}
									<div className='col-md-6 col-12 mb-3'>
										<h6 className='mb-3'>المنطقة</h6>
										<div className='info-box'>
											<FaCity
												style={{
													width: "24px",
													height: "24px",
													fill: "#1dbbbe",
												}}
											/>
											<span style={{ whiteSpace: "normal" }}>
												{translateProvinceName(
													currentOrder?.orders?.OrderAddress?.district
												)}
											</span>
										</div>
									</div>
									<div className='col-md-6 col-12 mb-3'>
										<h6 className='mb-3'>المدينة</h6>

										<div className='info-box'>
											<FaMountainCity
												style={{
													width: "24px",
													height: "24px",
													fill: "#1dbbbe",
												}}
											/>
											<span style={{ whiteSpace: "normal" }}>
												{translateCityName(
													currentOrder?.orders?.OrderAddress?.city
												)}
											</span>
										</div>
									</div>
									{currentOrder?.orders?.OrderAddress?.postal_code && (
										<div className='col-md-6 col-12 mb-3'>
											<h6 className='mb-3'>الرمز البريدي</h6>
											<div className='info-box'>
												<FaSignsPost
													style={{
														width: "24px",
														height: "24px",
														fill: "#1dbbbe",
													}}
												/>
												<span style={{ whiteSpace: "normal" }}>
													{currentOrder?.orders?.OrderAddress?.postal_code}
												</span>
											</div>
										</div>
									)}
									<div className='col-12 mb-3'>
										<h6 className='mb-3'>العنوان</h6>
										<div className='info-box'>
											<Location />
											<span style={{ whiteSpace: "normal" }}>
												{currentOrder?.orders?.OrderAddress?.street_address}
											</span>
										</div>
									</div>
								</>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerInfo;
