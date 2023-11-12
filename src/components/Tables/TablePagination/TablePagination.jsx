import React from "react";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";

// Icon
import {
	MdOutlineKeyboardArrowDown,
	MdOutlineArrowBackIosNew,
	MdOutlineArrowForwardIos,
} from "react-icons/md";
const TablePagination = ({
	data,
	open,
	page,
	setPage,
	allRows,
	anchorEl,
	rowsPerPage,
	handleClose,
	handleRowsClick,
	rowsPerPagesCount,
	handleChangeRowsPerPage,
}) => {
	return (
		<div className='d-flex flex-md-row flex-column-reverse justify-content-between align-items-center'>
			<div
				className='d-flex align-items-center mx-auto mt-3 mt-md-0'
				style={{ gap: "1rem" }}>
				<MdOutlineArrowForwardIos
					style={{
						visibility: page + 1 === allRows()?.length && "hidden",
						cursor: "pointer",
					}}
					onClick={() => {
						setPage(page + 1);
					}}
				/>
				<div className='d-flex flex-row-reverse gap-2'>
					{allRows().map((item, itemIdx) => {
						if (
							(itemIdx < 1 || (itemIdx >= page - 1 && itemIdx <= page + 1)) &&
							(Math.ceil(data) <= 3 ||
								(Math.ceil(data) > 3 && itemIdx < allRows()?.length - 1))
						) {
							return (
								<div
									key={itemIdx}
									className='d-flex justify-content-center align-items-center'
									style={{
										width: "1.7rem",
										height: "1.9rem",
										cursor: "pointer",
										fontWight: "500",
										lineHeight: "1.7rem",
										borderRadius: "10px",
										backgroundColor: item === page + 1 && "#508FF4",
										color: item === page + 1 && "#fff",
									}}
									onClick={() => {
										setPage(itemIdx);
									}}>
									{item}
								</div>
							);
						}
						return null;
					})}
					{Math.ceil(data / rowsPerPage) > 3 && <div>...</div>}
					{Math.ceil(data / rowsPerPage) > 1 && (
						<div
							className='d-flex justify-content-center align-items-center'
							style={{
								width: "1.7rem",
								height: "1.9rem",
								cursor: "pointer",
								fontWight: "500",
								lineHeight: "1.7rem",
								borderRadius: "10px",
								backgroundColor:
									Math.ceil(data / rowsPerPage) === page + 1 && "#508FF4",
								color: Math.ceil(data / rowsPerPage) === page + 1 && "#fff",
							}}
							onClick={() => {
								setPage(Math.ceil(data / rowsPerPage) - 1);
							}}>
							{Math.ceil(data / rowsPerPage)}
						</div>
					)}
				</div>
				<MdOutlineArrowBackIosNew
					style={{ visibility: page !== 1 && "hidden", cursor: "pointer" }}
					onClick={() => {
						setPage(page - 1);
					}}
				/>
			</div>

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
