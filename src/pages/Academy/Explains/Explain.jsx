import React, { useState } from "react";

//Third party
import { useNavigate } from "react-router-dom";
import useFetch from "../../../Hooks/UseFetch";

// Components
import CircularLoading from "../../../HelperComponents/CircularLoading";

// icons

import {
	MdOutlineArrowBackIosNew,
	MdOutlineArrowForwardIos,
	MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { BsPlayCircle } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";

const Explain = ({ searchExplain }) => {
	const navigate = useNavigate();
	// to get all  data from server
	const { fetchedData, loading } = useFetch(
		"https://backend.atlbha.com/api/Store/explainVideos"
	);
	let explainvideos = fetchedData?.data?.explainvideos;

	if (searchExplain !== "") {
		explainvideos = fetchedData?.data?.explainvideos?.filter((item) =>
			item?.title?.includes(searchExplain)
		);
	} else {
		explainvideos = fetchedData?.data?.explainvideos;
	}

	/**
	 * -------------------------------------------------------------
	 * TO CREATE PAGINATION
	 * -------------------------------------------------------------
	 */

	const [page, setPage] = useState(0);
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const allRows = () => {
		const num = Math.ceil(explainvideos?.length / rowsPerPage);
		const arr = [];
		for (let index = 0; index < num; index++) {
			arr.push(index + 1);
		}
		return arr;
	};
	// ---------------------------------------------------------------------------------------------

	return (
		<div className='row'>
			{loading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : explainvideos?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				<div className='explain-boxes'>
					{explainvideos
						?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						?.map((lesson) => (
							<div className='box' key={lesson?.id}>
								<figure className='course-figure'>
									<div className='course-prev-image'>
										<img
											src={lesson?.thumbnail}
											className='img-fluid rounded'
											alt={lesson?.title}
										/>
										<div className='play-video-icon'>
											<BsPlayCircle
												onClick={() => {
													navigate(`ExplainDetails/${lesson?.id}`);
												}}
											/>
										</div>
									</div>
									<figcaption className='figure-caption'>
										{lesson?.title}{" "}
									</figcaption>
								</figure>
								{/** to play video  */}
							</div>
						))}
				</div>
			)}

			{/** Pagination */}
			{explainvideos?.length !== 0 && !loading && (
				<div className='pagination-box d-flex flex-md-row flex-column justify-content-center align-items-center'>
					<div
						className='d-flex align-items-center justify-content-center  my-3 m-md-auto'
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
									(itemIdx < 1 ||
										(itemIdx >= page - 1 && itemIdx <= page + 1)) &&
									(Math.ceil(explainvideos?.length) <= 3 ||
										(Math.ceil(explainvideos?.length) > 3 &&
											itemIdx < allRows()?.length - 1))
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
							{Math.ceil(explainvideos?.length / rowsPerPage) > 3 && (
								<div>...</div>
							)}
							{Math.ceil(explainvideos?.length / rowsPerPage) > 1 && (
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
											Math.ceil(explainvideos?.length / rowsPerPage) ===
												page + 1 && "#508FF4",
										color:
											Math.ceil(explainvideos?.length / rowsPerPage) ===
												page + 1 && "#fff",
									}}
									onClick={() => {
										setPage(Math.ceil(explainvideos?.length / rowsPerPage) - 1);
									}}>
									{Math.ceil(explainvideos?.length / rowsPerPage)}
								</div>
							)}
						</div>

						<MdOutlineArrowBackIosNew
							style={{
								visibility: page === 0 && "hidden",
								cursor: "pointer",
							}}
							onClick={() => {
								setPage(page - 1);
							}}
						/>
					</div>

					<div
						className='d-flex align-items-center gap-2  px-3 py-1'
						style={{
							border: "1px solid #2D62ED",
							borderRadius: "0.375rem",
						}}>
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
						<h2
							style={{
								color: "#0077FF",
								fontSize: "20px",
								fontWeight: "500",
							}}>
							عدد الصفوف
						</h2>

						<div
							id='basic-button'
							aria-controls={open ? "basic-menu" : undefined}
							aria-haspopup='true'
							aria-expanded={open ? "true" : undefined}
							onClick={handleRowsClick}
							className='d-flex justify-content-center align-items-center '
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
			)}
		</div>
	);
};

export default Explain;
