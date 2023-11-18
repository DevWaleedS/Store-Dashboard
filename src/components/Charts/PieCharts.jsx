import React, { useState, useEffect } from "react";

import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { BsArrowDown, BsArrowUp } from "react-icons/bs";

const PieCharts = ({ fetchedData }) => {
	const [sales_monthly, setSales_monthly] = useState();
	const [sales_weekly, setSales_weekly] = useState();
	const [sales_avg, setSales_avg] = useState();

	// We use this effect to avoid the errors
	useEffect(() => {
		if (fetchedData) {
			function formatNumber(number) {
				if (number >= 1000) {
					const suffixes = ["", "K", "M", "B", "T"];
					const suffixIndex = Math.floor(Math.log10(number) / 3);
					const shortNumber = (number / Math.pow(1000, suffixIndex))?.toFixed(
						0
					);
					return shortNumber + suffixes[suffixIndex];
				}
				return number?.toString();
			}
			setSales_monthly(formatNumber(fetchedData?.data?.sales_monthly));
			setSales_weekly(formatNumber(fetchedData?.data?.sales_weekly));
			setSales_avg(formatNumber(fetchedData?.data?.sales_avg));
		}
	}, [fetchedData]);

	return (
		<div className='pie-charts'>
			<div className='row mb-4'>
				<div className='col-12'>
					<div className='comp-title'>
						<h4>معدل الشراء الأسبوعي</h4>
					</div>
				</div>
			</div>

			<div className='row'>
				<div className='pie-chart'>
					<div className='circle  m-auto' style={{ width: 200, height: 270 }}>
						<CircularProgressbar
							value={fetchedData?.data?.sales_percent || 0}
							text={`${fetchedData?.data?.sales_percent?.toFixed(0) || 0}%`}
							background={"#f5fbff"}
							// some style
							styles={buildStyles({
								textColor: "#000",
								trailColor: "#f5fbff",
								backgroundColor: "#f5fbff",
							})}
						/>
					</div>

					<div className='analyse-box'>
						<div className='row'>
							<div className='col-4'>
								<div className='month'>
									<h5> آخر شهر</h5>
									<div className='d-flex  align-items-center'>
										<p>
											{sales_monthly || 0}
											<span className='currency'>ر.س</span>
										</p>
										{fetchedData?.data?.sales_monthly_compare === 1 ? (
											<BsArrowUp />
										) : (
											<BsArrowDown className='red' />
										)}
									</div>
								</div>
							</div>
							<div className='col-4'>
								<div className='month'>
									<h5> آخر أسبوع</h5>
									<div className='d-flex  align-items-center'>
										<p>
											{sales_weekly || 0}
											<span className='currency'>ر.س</span>
										</p>
										{fetchedData?.data?.sales_weekly_compare === 1 ? (
											<BsArrowUp />
										) : (
											<BsArrowDown className='red' />
										)}
									</div>
								</div>
							</div>
							<div className='col-4'>
								<div className='month'>
									<h5> المتوسط الشهري</h5>
									<div className='d-flex  align-items-center'>
										<p>
											{sales_avg || 0}
											<span className='currency'>ر.س</span>
										</p>
										{fetchedData?.data?.sales_avg_compare === 1 ? (
											<BsArrowUp />
										) : (
											<BsArrowDown className='red' />
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PieCharts;
