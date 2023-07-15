import * as React from "react";
import { BsArrowLeft } from "react-icons/bs";

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
					style={{ minHeight: "400px" }}>
					{productsDetails?.length === 0 ? (
						<div className='d-flex justify-content-center align-items-center h-100'>
							لا يوجد منتجات حتي الان
						</div>
					) : (
						<table className='table  table-borderless products-table text-center'>
							<thead>
								<tr>
									<th scope='col' className='pr-rad-right'></th>

									<th
										scope='col'
										style={{ whiteSpace: "nowrap", width: "245px" }}>
										الاسم
									</th>
									<th
										scope='col'
										className=' text-center'
										style={{
											whiteSpace: "nowrap",
											width: "195px",
											textAlign: "center",
										}}>
										التصنيف
									</th>
									<th scope='col' className=' text-center'>
										السعر
									</th>
									<th
										scope='col'
										className=' text-center pr-rad-left'
										style={{ whiteSpace: "nowrap", width: "90px" }}>
										اجمالي المبيعات
									</th>
								</tr>
							</thead>
							<tbody>
								{productsDetails?.map((product) => (
									<React.Fragment key={product?.id}>
										<tr>
											<td>
												<div style={{ whiteSpace: "nowrap", width: "40px" }}>
													<img
														style={{ borderRadius: "50%", width: "100%" }}
														className='rounded-circle'
														src={product?.cover}
														alt={product?.name}
													/>
												</div>
											</td>

											<td style={{ whiteSpace: "nowrap", width: "245px" }}>
												{" "}
												{product?.name}
											</td>
											<td
												style={{
													whiteSpace: "nowrap",
													width: "195px",
													textAlign: "center",
												}}>
												{" "}
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
