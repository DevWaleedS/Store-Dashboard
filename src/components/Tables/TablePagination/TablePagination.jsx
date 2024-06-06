import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";

const TablePagination = ({
	pageCount,
	setPageTarget,
	currentPage,
	setRowsCount,
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const rowsPerPagesCount = [10, 20, 30, 50, 100];

	const handleChange = (event, value) => {
		setPageTarget(value);
		localStorage.setItem("notificationPageTarget", value);
	};

	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChangeRowsPerPage = (rowsPerPage) => {
		setRowsCount(rowsPerPage);
		localStorage.setItem("notificationRowsCount", rowsPerPage);
		setPageTarget(1);
		handleClose();
	};

	return (
		<div className='d-flex flex-md-row flex-column-reverse justify-content-between align-items-center'>
			<Stack
				spacing={2}
				className='d-flex align-items-center justify-content-center my-3 m-md-auto'
				style={{ direction: "ltr" }}>
				<Pagination
					color='secondary'
					sx={{
						"& .MuiPaginationItem-root": {
							"&.Mui-selected": {
								color: "#fff",
								backgroundColor: "#0077ff",
							},
							width: "28px",
							minWidth: "28px",
							height: "28px",
						},
					}}
					count={pageCount}
					page={currentPage || 1}
					onChange={handleChange}
				/>
			</Stack>

			<div
				className='d-flex align-items-center gap-2 px-3 py-1'
				style={{ border: "1px solid #2D62ED", borderRadius: "0.375rem" }}>
				<Menu
					id='basic-menu'
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						"aria-labelledby": "basic-button",
					}}>
					{rowsPerPagesCount.map((rowsPer, index) => (
						<MenuItem
							key={index}
							onClick={() => handleChangeRowsPerPage(rowsPer)}
							sx={{
								width: "2.8rem",
								pr: "9px",
								pl: "9px",
								backgroundColor: "#FFFFF",
								"ul:has(&)": {
									p: 0,
								},
								"ul:has(&) li:hover": {
									backgroundColor: "#C6E1F0",
								},
							}}>
							{rowsPer}
						</MenuItem>
					))}
				</Menu>
				<h2 style={{ color: "#0077FF", fontSize: "20px", fontWeight: "500" }}>
					عدد الصفوف
				</h2>

				<div
					id='basic-button'
					aria-controls={open ? "basic-menu" : undefined}
					aria-haspopup='true'
					aria-expanded={open ? "true" : undefined}
					onClick={handleRowsClick}
					className='d-flex justify-content-center align-items-center'
					style={{
						backgroundColor: "#c6e1f0",
						cursor: "pointer",
						borderRadius: "0.125rem",
						width: "2.8rem",
						height: "2.8rem",
					}}>
					<MdOutlineKeyboardArrowDown color='#0099FB' fontSize='1.5rem' />
				</div>
			</div>
		</div>
	);
};

TablePagination.propTypes = {
	pageCount: PropTypes.number.isRequired,
	setPageTarget: PropTypes.func.isRequired,
	currentPage: PropTypes.number.isRequired,
	setRowsCount: PropTypes.func.isRequired,
};

export default TablePagination;
