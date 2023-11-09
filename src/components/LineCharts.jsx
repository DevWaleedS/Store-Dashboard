import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const LineCharts = ({
	array_sales_daily,
	array_sales_weekly,
	array_sales_monthly,
}) => {
	const [sales_daily, setSales_daily] = useState([{ name: "", sales: 0 }]);
	const [sales_weekly, setSales_weekly] = useState([{ name: "", sales: 0 }]);
	const [sales_monthly, setSales_monthly] = useState([{ name: "", sales: 0 }]);

	// We use this effect to avoid the errors
	useEffect(() => {
		if (array_sales_daily && array_sales_monthly && array_sales_weekly) {
			// TO Convert the object of array_sales_daily to array
			const dailySales = Object.entries(array_sales_daily);
			const weeklySales = Object.entries(array_sales_weekly);
			const monthlySales = Object.entries(array_sales_monthly);
			// create empty array
			const arrayOfDaysSales = [];
			const arrayOfWeeklySales = [];
			const arrayOfMonthlySales = [];
			// for of looping to get all days and sales from dailySales array
			for (const [days, sales] of dailySales) {
				// push this data into new array
				arrayOfDaysSales.push({ name: days, sales: Number(sales) });
			}

			for (const [weeks, sales] of weeklySales) {
				// push this data into new array
				arrayOfWeeklySales.push({ name: weeks, sales: Number(sales) });
			}

			for (const [month, sales] of monthlySales) {
				// push this data into new array
				arrayOfMonthlySales.push({ name: month, sales: Number(sales) });
			}
			setSales_daily(arrayOfDaysSales);
			setSales_weekly(arrayOfWeeklySales);
			setSales_monthly(arrayOfMonthlySales);
		}
	}, [array_sales_daily, array_sales_weekly, array_sales_monthly]);

	return (
		<div className='line-charts'>
			<div className='row mb-3'>
				<div className='col-md-4 col-12 mb-md-0 mb-2'>
					<div className='comp-title'>
						<h4>تحليلات المبيعات</h4>
					</div>
				</div>

				{/** tabs buttons */}
				<div className='col-md-8 col-12'>
					<ul
						className='nav nav-pills line-charts-tabs mb-3'
						id='pills-tab'
						role='tablist'>
						<li className='nav-item  ' role='presentation'>
							<button
								className='nav-link right-radius'
								id='pills-home-tab'
								data-bs-toggle='pill'
								data-bs-target='#pills-home'
								type='button'
								role='tab'
								aria-controls='pills-home'
								aria-selected='true'>
								يومي
							</button>
						</li>
						<li className='nav-item' role='presentation'>
							<button
								className='nav-link'
								id='pills-profile-tab'
								data-bs-toggle='pill'
								data-bs-target='#pills-profile'
								type='button'
								role='tab'
								aria-controls='pills-profile'
								aria-selected='false'>
								أسبوعي
							</button>
						</li>
						<li className='nav-item' role='presentation'>
							<button
								className='nav-link radius-left  active'
								id='pills-contact-tab'
								data-bs-toggle='pill'
								data-bs-target='#pills-contact'
								type='button'
								role='tab'
								aria-controls='pills-contact'
								aria-selected='false'>
								شهري
							</button>
						</li>
					</ul>
				</div>
			</div>

			<div className='line-chart'>
				{/**sales_daily */}
				<div
					className='tab-content line-chart-tab-content'
					id='pills-tabContent'>
					<div
						className='tab-pane line-chart-tab-pane fade '
						id='pills-home'
						role='tabpanel'
						aria-labelledby='pills-home-tab'
						tabIndex='0'>
						{/**sales_daily */}
						<ResponsiveContainer>
							<LineChart
								data={sales_daily}
								margin={{
									top: 5,
									right: 10,
									left: 30,
									bottom: 5,
								}}>
								<XAxis
									dataKey='name'
									fontSize={14}
									fontWeight={600}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip />
								<Line
									type='monotone'
									dataKey='sales'
									stroke='#0bf1d1'
									strokeWidth='5'
									dot={{ stroke: "#b4edee", strokeWidth: 10 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
					{/**sales_weekly */}
					<div
						className='tab-pane line-chart-tab-pane fade '
						id='pills-profile'
						role='tabpanel'
						aria-labelledby='pills-profile-tab'
						tabIndex='0'>
						<ResponsiveContainer>
							<LineChart
								data={sales_weekly}
								margin={{
									top: 5,
									right: 10,
									left: 30,
									bottom: 5,
								}}>
								<XAxis
									dataKey='name'
									fontSize={14}
									fontWeight={600}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip />
								<Line
									type='monotone'
									dataKey='sales'
									stroke='#0bf1d1'
									strokeWidth='5'
									dot={{ stroke: "#b4edee", strokeWidth: 10 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
					{/**sales_monthly */}
					<div
						className='tab-pane line-chart-tab-pane fade show active'
						id='pills-contact'
						role='tabpanel'
						aria-labelledby='pills-contact-tab'
						tabIndex='0'>
						<ResponsiveContainer>
							<LineChart
								data={sales_monthly}
								margin={{
									top: 5,
									right: 10,
									left: 30,
									bottom: 5,
								}}>
								<XAxis
									dataKey='name'
									fontSize={14}
									fontWeight={600}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip />
								<Line
									type='monotone'
									dataKey='sales'
									stroke='#0bf1d1'
									strokeWidth='5'
									dot={{ stroke: "#b4edee", strokeWidth: 10 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LineCharts;
