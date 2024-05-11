import React from "react";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// Icon
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
const TablePagination = ({
	pageCount,
	setPageTarget,
	currentPage,
	setRowsCount,
}) => {
	const handleChange = (event, value) => {
		setPageTarget(value);

		// im add this to use it in notifications menu
		localStorage.setItem("notificationPageTarget", value);
	};

	// Handel Select row per page
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsCount(parseInt(event.target.value));

		localStorage.setItem("notificationRowsCount", event.target.value);
		setPageTarget(1);
	};

	return (
		<div className='d-flex flex-md-row flex-column-reverse justify-content-between align-items-center'>
			{/*  pagination  */}
			<Stack
				spacing={2}
				className='d-flex align-items-center justify-content-center  my-3 m-md-auto'
				style={{ direction: "ltr" }}>
				<Pagination
					color='secondary'
					sx={{
						"& .MuiPaginationItem-root": {
							"&.Mui-selected ": {
								color: "#fff",
								backgroundColor: "#0077ff",
							},
							width: "28px",
							minWidth: "28px",
							height: "28px",
						},
					}}
					count={pageCount}
					page={currentPage}
					onChange={handleChange}
				/>
			</Stack>

			{/* Select page rows Count */}
			<div
				className='d-flex align-items-center gap-2  px-3 py-1'
				style={{ border: "1px solid #2D62ED", borderRadius: "0.375rem" }}>
				<Menu
					id='basic-menu'
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						"aria-labelledby": "basic-button",
					}}>
					{rowsPerPagesCount.map((rowsPer, rowsIdx) => {
						return (
							<MenuItem
								value={rowsPer}
								onClick={(e) => {
									handleChangeRowsPerPage(e);
									handleClose();
								}}
								key={rowsIdx}
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
						);
					})}
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
					className={"d-flex justify-content-center align-items-center "}
					style={{
						backgroundColor: " #c6e1f0",
						cursor: "pointer",
						borderRadius: "0.125rem",
						width: "2.8rem",
						height: "2.8rem",
					}}>
					<MdOutlineKeyboardArrowDown
						color='#0099FB'
						fontSize={"1.5rem"}></MdOutlineKeyboardArrowDown>
				</div>
			</div>
		</div>
	);
};
export default TablePagination;
