import React, { useState } from "react";

// Components
import { CircularLoading } from "../../HelperComponents";

// REDUX
import { useSelector } from "react-redux";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";

// import icons
import { IoMdStar } from "react-icons/io";
import { useGetDelegateByCityIdQuery } from "../../store/apiSlices/requestDelegateApi";
import { TablePagination } from "./TablePagination";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#F4F5F7" }}>
			<TableRow>
				<TableCell align='left' sx={{ color: "#67747B", width: "100px" }}>
					م
				</TableCell>

				<TableCell align='center' sx={{ color: "#67747B", width: "350px" }}>
					اسم المندوب
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747Ba" }}>
					رقم الجوال
				</TableCell>

				<TableCell align='center' sx={{ color: "#67747B" }}>
					المدينة
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					التقييم
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	rowCount: PropTypes.number,
};

export default function DelegateTable({ cityId }) {
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	// handle request Delegate by city id
	const { data: delegate, isLoading } = useGetDelegateByCityIdQuery({
		cityId,
		page: pageTarget,
		number: rowsCount,
	});

	// Get Data From Redux Store
	const rows = useSelector((state) => state.CustomerTableData);

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead rowCount={rows?.length} />
						<TableBody>
							{cityId === "" ? (
								<TableCell className='text-center' colSpan={5}>
									يرجى اختيار مدينة أولا حتى يتم عرض المندوبين
								</TableCell>
							) : isLoading ? (
								<TableCell colSpan={5}>
									<CircularLoading />
								</TableCell>
							) : delegate?.marketers?.length === 0 ? (
								<TableCell className='text-center' colSpan={5}>
									لايوجد مندوبين لهذه المدينة
								</TableCell>
							) : (
								delegate?.marketers?.map((row, index) => (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										<TableCell
											component='th'
											scope='row'
											align='center'
											sx={{ width: "100px" }}>
											<div className='text-center'>
												{(index + 1).toLocaleString("en-US", {
													minimumIntegerDigits: 2,
													useGrouping: false,
												})}
											</div>
										</TableCell>

										<TableCell align='center'>
											<div
												className='cate-prim d-flex align-items-center justify-content-start'
												style={{ width: "350px", paddingRight: " 70px " }}>
												<img
													src={row?.image}
													alt='img'
													className='img_icons rounded-circle'
												/>
												<span className='me-3'>{row?.name}</span>
											</div>
										</TableCell>
										<TableCell align='center' dir='ltr'>
											{row?.phonenumber}
										</TableCell>

										<TableCell align='center'>{row?.city?.name}</TableCell>
										<TableCell align='right'>
											<div className='actions d-flex justify-content-center gap-1'>
												<IoMdStar
													style={{ color: "#B6BE34", fontSize: "20px" }}
												/>
												<IoMdStar
													style={{ color: "#B6BE34", fontSize: "20px" }}
												/>
												<IoMdStar
													style={{ color: "#B6BE34", fontSize: "20px" }}
												/>
												<IoMdStar
													style={{ color: "#B6BE34", fontSize: "20px" }}
												/>
												<IoMdStar
													style={{ color: "#B6BE34", fontSize: "20px" }}
												/>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{delegate?.marketers?.length !== 0 && !isLoading && (
				<TablePagination
					data={delegate?.marketers}
					pageCount={delegate?.page_count}
					currentPage={delegate?.current_page}
					pageTarget={pageTarget}
					rowsCount={rowsCount}
					setRowsCount={setRowsCount}
					setPageTarget={setPageTarget}
				/>
			)}
		</Box>
	);
}
