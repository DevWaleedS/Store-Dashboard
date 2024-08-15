import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";
import "./TablePagination.css";

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

			<div className='d-flex align-items-center gap-2 px-2 px-lg-3 py-2 pagination_menu'>
				<Menu
					id='basic-menu'
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}>
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

								"@media(max-width:1400px)": {
									width: "2.1rem",
								},
							}}>
							{rowsPer}
						</MenuItem>
					))}
				</Menu>
				<p className='pagination_row_count'>عدد الصفوف</p>

				<div
					id='basic-button'
					aria-controls={open ? "basic-menu" : undefined}
					aria-haspopup='true'
					aria-expanded={open ? "true" : undefined}
					onClick={handleRowsClick}
					className='d-flex justify-content-center align-items-center pagination_arrow'>
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
