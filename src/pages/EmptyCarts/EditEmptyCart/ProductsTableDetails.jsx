import React from "react";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function EnhancedTableHead({ is_service }) {
	return (
		<TableHead sx={{ backgroundColor: "#cce4ff38" }}>
			<TableRow>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					م
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					{is_service ? " اسم الخدمة" : " المنتج"}
				</TableCell>

				{is_service ? (
					<TableCell />
				) : (
					<TableCell align='right' sx={{ color: "#02466a" }}>
						الكمية
					</TableCell>
				)}

				<TableCell align='right' sx={{ color: "#02466a" }}>
					الإجمالي
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

const ProductsTableDetails = ({ tableData, is_service }) => {
	return (
		<div
			className='userData-container overflow-hidden'
			style={{ borderBottom: "none" }}>
			<div className='container-title d-flex justify-content-between align-items-center'>
				<div className='tit-box'>
					{is_service ? (
						<span>تفاصيل الخدمات</span>
					) : (
						<>
							<span>تفاصيل المنتجات</span>
							<span className='product-count me-2'>
								({tableData?.count} منتج)
							</span>
						</>
					)}
				</div>
			</div>

			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
					<EnhancedTableHead is_service={is_service} />
					<TableBody>
						{tableData?.cartDetail?.map((row, index) => (
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
											className='me-3'
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
									{is_service ? null : (
										<div className='text-center'>
											<span>{row?.qty}</span>
										</div>
									)}
								</TableCell>
								<TableCell align='center'>
									<span className='table-price_span'>{row?.sum} ر.س</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default ProductsTableDetails;
