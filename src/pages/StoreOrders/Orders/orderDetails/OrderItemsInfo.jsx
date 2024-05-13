import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

// The Table title
function EnhancedTableHead() {
	return (
		<TableHead sx={{ backgroundColor: "#cce4ff38" }}>
			<TableRow>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					م
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					المنتج
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					الكمية
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					الإجمالي
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

const OrderItemsInfo = ({ currentOrder }) => {
	return (
		<div className='order-details-box'>
			<div className='title mb-4 d-flex justify-content-between  align-content-center  flex-wrap'>
				<h5>تفاصيل المنتجات</h5>
				<div className='d-flex justify-content-between  align-content-center gap-1'>
					<h6>عدد القطع:</h6>
					<p style={{ fontSize: "14px", fontWight: "400" }}>
						{currentOrder?.orders?.totalCount === 1 && <>(قطعة واحده)</>}
						{currentOrder?.orders?.totalCount === 2 && <>(قطعتين)</>}
						{currentOrder?.orders?.totalCount > 2 && (
							<>({currentOrder?.orders?.totalCount} قطعة)</>
						)}
					</p>
				</div>
			</div>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
					<EnhancedTableHead />
					<TableBody>
						{currentOrder?.orders?.orderItem?.map((row, index) => (
							<TableRow hover tabIndex={-1} key={index}>
								<TableCell component='th' id={index} scope='row' align='right'>
									<div
										className='flex items-center'
										style={{
											display: "flex",
											justifyContent: "start",
											alignItems: "center",
											gap: "7px",
										}}>
										{(index + 1).toLocaleString("en-US", {
											minimumIntegerDigits: 2,
											useGrouping: false,
										})}
									</div>
								</TableCell>

								<TableCell align='right'>
									<div className='d-flex flex-row align-items-center'>
										<img
											className='rounded-circle img_icons'
											src={row?.product?.cover}
											alt='client'
										/>
										<span
											className='me-2'
											style={{
												minWidth: "400px",
												maxWidth: "550px",
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}>
											{row?.product?.name}
										</span>
									</div>
								</TableCell>
								<TableCell align='right' sx={{ width: "90px" }}>
									<div className='text-center'>
										<span>{row?.quantity}</span>
									</div>
								</TableCell>
								<TableCell align='center'>
									<span className='table-price_span'>{row?.sum} ر.س</span>
								</TableCell>
							</TableRow>
						))}
						<TableRow>
							<TableCell
								colSpan={3}
								component='th'
								scope='row'
								align='right'
								style={{ borderBottom: "none" }}>
								<span style={{ fontWeight: "700" }}>السعر</span>
							</TableCell>
							<TableCell align='center' style={{ borderBottom: "none" }}>
								<span
									className='table-price_span'
									style={{ fontWeight: "500" }}>
									{currentOrder?.orders?.subtotal} ر.س
								</span>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell
								colSpan={3}
								component='th'
								scope='row'
								align='right'
								style={{ borderBottom: "none" }}>
								<span style={{ fontWeight: "700" }}>الضريبة</span>
							</TableCell>
							<TableCell align='center' style={{ borderBottom: "none" }}>
								<span
									className='table-price_span'
									style={{ fontWeight: "500" }}>
									{currentOrder?.orders?.tax} ر.س
								</span>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell
								colSpan={3}
								component='th'
								scope='row'
								align='right'
								style={{ borderBottom: "none" }}>
								<span style={{ fontWeight: "700" }}>الشحن</span>
							</TableCell>
							<TableCell align='center' style={{ borderBottom: "none" }}>
								<span
									className='table-price_span'
									style={{ fontWeight: "500" }}>
									{currentOrder?.orders?.shipping_price} ر.س
								</span>
							</TableCell>
						</TableRow>
						{currentOrder?.orders?.codprice !== 0 && (
							<TableRow>
								<TableCell
									colSpan={3}
									component='th'
									scope='row'
									align='right'
									style={{ borderBottom: "none" }}>
									<span style={{ fontWeight: "700" }}>الدفع عند الإستلام</span>
								</TableCell>

								<TableCell align='center' style={{ borderBottom: "none" }}>
									<span
										className='table-price_span'
										style={{ fontWeight: "500" }}>
										{currentOrder?.orders?.codprice} ر.س
									</span>
								</TableCell>
							</TableRow>
						)}

						{currentOrder?.orders?.overweight !== 0 &&
							currentOrder?.orders?.overweight_price !== 0 && (
								<TableRow>
									<TableCell
										colSpan={3}
										component='th'
										scope='row'
										align='right'
										style={{ borderBottom: "none" }}>
										<span style={{ fontWeight: "700" }}>
											تكلفة الوزن الزائد ({currentOrder?.orders?.overweight}{" "}
											<span>kg</span>)
										</span>
									</TableCell>

									<TableCell align='center' style={{ borderBottom: "none" }}>
										<span
											className='table-price_span'
											style={{ fontWeight: "500" }}>
											{currentOrder?.orders?.overweight_price} ر.س
										</span>
									</TableCell>
								</TableRow>
							)}
						{currentOrder?.orders?.discount !== 0 && (
							<TableRow>
								<TableCell
									colSpan={3}
									component='th'
									scope='row'
									align='right'
									style={{ borderBottom: "none" }}>
									<span style={{ fontWeight: "700" }}>الخصم</span>
								</TableCell>
								<TableCell align='center' style={{ borderBottom: "none" }}>
									<span
										className='table-price_span'
										style={{ fontWeight: "500" }}>
										{currentOrder?.orders?.discount} ر.س
									</span>
								</TableCell>
							</TableRow>
						)}
						<TableRow>
							<TableCell
								colSpan={3}
								component='th'
								scope='row'
								align='right'
								style={{
									borderBottom: "none",
									backgroundColor: "#e1e1e1",
								}}>
								<span style={{ fontWeight: "700" }}>الإجمالي</span>
							</TableCell>
							<TableCell
								align='center'
								style={{
									borderBottom: "none",
									backgroundColor: "#e1e1e1",
								}}>
								<span
									className='table-price_span'
									style={{ fontWeight: "500" }}>
									{currentOrder?.orders?.total_price} ر.س
								</span>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default OrderItemsInfo;
