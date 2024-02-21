import * as React from "react";

// ICONS
import { BsArrowLeft } from "react-icons/bs";

// third party
import { useNavigate } from "react-router-dom";

const ProductsTableData = ({ productsDetails }) => {
	const navigate = useNavigate();

	return (
		<div className='new-products-table'>
			<div className='row mb-3'>
				<div className='col-12'>
					<div className='comp-title d-flex justify-content-between '>
						<h4> المنتجات الأكثر مبيعاً </h4>
						<BsArrowLeft
							className='arrow-style'
							onClick={() => navigate("Products")}
						/>
					</div>
				</div>
			</div>

			<div className='row'>
				<div
					className='table-wrapper table-responsive'
					style={{ minHeight: "470px" }}>
					{productsDetails?.length === 0 ? (
						<div className='d-flex justify-content-center align-items-center h-100'>
							لا يوجد منتجات حتى الآن
						</div>
					) : (
						<table className='table  table-borderless products-table text-center'>
							<thead>
								<tr>
									<th
										scope='col'
										className='pr-rad-right '
										style={{
											whiteSpace: "nowrap",
											width: "240px",
											background: "#E6F5F6",
											color: "#52575D",
											textAlign: "right",
											paddingRight: "60px",
										}}>
										الاسم
									</th>
									<th
										scope='col'
										className=' text-center'
										style={{
											whiteSpace: "nowrap",
											width: "190px",
											textAlign: "center",
											background: "#E6F5F6",
											color: "#52575D",
										}}>
										النشاط
									</th>
									<th
										scope='col'
										className=' text-center'
										style={{ background: "#E6F5F6", color: "#52575D" }}>
										السعر
									</th>
									<th
										scope='col'
										className=' text-center pr-rad-left'
										style={{
											whiteSpace: "normal",
											width: "90px",
											background: "#E6F5F6",
											color: "#52575D",
										}}>
										إجمالي المبيعات
									</th>
								</tr>
							</thead>
							<tbody>
								{productsDetails?.map((product) => (
									<React.Fragment key={product?.id}>
										<tr>
											{/* Product name */}
											<td>
												<div
													style={{
														width: "240px",
														display: "flex",
														justifyContent: "flex-start",
														alignItems: "center",
														gap: "0.5rem",
													}}>
													{/* product cover*/}
													<div style={{ whiteSpace: "nowrap", width: "40px" }}>
														<img
															style={{ borderRadius: "50%", width: "100%" }}
															className='rounded-circle img_icons'
															src={product?.cover}
															alt=''
														/>
													</div>

													{/* Product name */}
													<div
														style={{
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
														}}>
														{product?.name}
													</div>
												</div>
											</td>

											<td
												style={{
													whiteSpace: "nowrap",
													width: "190px",
													textAlign: "center",
												}}>
												{product?.category?.name}
											</td>
											<td> {product?.selling_price}</td>
											<td
												className=' text-center'
												style={{ whiteSpace: "nowrap", width: "90px" }}>
												{product?.getOrderTotal}
											</td>
										</tr>
									</React.Fragment>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductsTableData;
