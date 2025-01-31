import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFetch from "../Hooks/UseFetch";
import Switch from "@mui/material/Switch";

import { IoMdAdd } from "react-icons/io";
import { BsGift } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from "moment";
import Context from "../Context/context";
import { CircularLoading } from "../HelperComponents";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

const Offers = () => {
	const storeToken = localStorage.getItem("storeToken");
	const { fetchedData, loading, reload, setReload } = useFetch("offer");
	const navigate = useNavigate();
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// change category status
	const changeOfferStatus = (id) => {
		axios
			.get(`changeOfferStatus/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${storeToken}`,
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
				<title>لوحة تحكم اطلبها | العروض الخاصة</title>
			</Helmet>
			<section className='offers-page p-lg-3'>
				<Breadcrumb currentPage={"العروض الخاصة"} parentPage={"التسويق"} />

				<div className='row mb-md-5 mb-4'>
					<div className='add-offer-btn-wrapper d-flex justify-content-end '>
						<button
							type='button'
							className='add-offer-btn'
							onClick={() => {
								navigate("AddOffer");
							}}>
							<IoMdAdd />
							انشاء عرض
						</button>
					</div>
				</div>

				<div className='row'>
					<div className='offers-table'>
						{loading ? (
							<CircularLoading />
						) : (
							<table className='table'>
								<thead>
									<tr>
										<th scope='col'>
											<div className='tb-offer-title d-flex  justify-content-start align-items-center'>
												<BsGift />
												<h4 className='mx-3 mb-0'>العروض الخاصة</h4>
												<p> ( {fetchedData?.data?.offers?.length} عروض)</p>
											</div>
										</th>
									</tr>
								</thead>
								<tbody>
									{fetchedData?.data?.offers?.map((offer, index) => (
										<>
											<tr key={index}>
												<th scope='row'>
													<div className='offer-content d-flex  justify-content-between align-items-center'>
														<div>
															<h5
																className='offer-heading'
																role='button'
																onClick={() =>
																	navigate(`OfferDetails/${offer?.id}`)
																}>
																{offer?.offer_title}
															</h5>
															{offer?.offer_type === "If_bought_gets" ? (
																<p className='offer-info'>
																	اذا اشترى العميل {offer?.purchase_quantity}{" "}
																	قطعة يحصل على {offer?.get_quantity} مجانا
																</p>
															) : offer?.offer_type === "fixed_amount" ? (
																<p className='offer-info'>
																	مبلغ ثابت من قيمة مشتريات العميل بقيمة{" "}
																	{offer?.discount_value_offer2} ريال
																</p>
															) : (
																<p className='offer-info'>
																	نسبة من قيمة مشتريات العميل بقيمة{" "}
																	{offer?.discount_value_offer3} %
																</p>
															)}
															<div className='offer-calender'>
																<FaRegCalendarAlt />
																<span>
																	ينتهي العرض بتاريخ-
																	{moment(offer?.end_at).format("YYYY-MM-DD")}
																</span>
															</div>
														</div>
														<div className='toggle-offer-switch'>
															<Switch
																onChange={() => changeOfferStatus(offer?.id)}
																checked={offer?.status === "نشط" ? true : false}
																sx={{
																	width: "50px",
																	"& .MuiSwitch-track": {
																		width: 26,
																		height: 14,
																		opacity: 1,
																		backgroundColor: "rgba(0,0,0,.25)",
																		boxSizing: "border-box",
																	},
																	"& .MuiSwitch-thumb": {
																		boxShadow: "none",
																		width: 10,
																		height: 10,
																		borderRadius: 5,
																		transform: "translate(6px,6px)",
																		color: "#fff",
																	},

																	"&:hover": {
																		"& .MuiSwitch-thumb": {
																			boxShadow: "none",
																		},
																	},

																	"& .MuiSwitch-switchBase": {
																		padding: 1,
																		"&.Mui-checked": {
																			transform: "translateX(11px)",
																			color: "#fff",
																			"& + .MuiSwitch-track": {
																				opacity: 1,
																				backgroundColor: "#3AE374",
																			},
																		},
																	},
																}}
															/>
														</div>
													</div>
												</th>
											</tr>
											<div className='padding'></div>
										</>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default Offers;
