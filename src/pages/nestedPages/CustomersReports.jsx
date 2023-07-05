import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
	{
		name: 'week 1',
		'الموقع الرئيسي': 50,
		جوجل: 100,
		'زيارة مباشرة': 250,
	},
	{
		name: 'week 2',
		'الموقع الرئيسي': 50,
		جوجل: 120,
		'زيارة مباشرة': 400,
	},
	{
		name: 'week 3',
		'الموقع الرئيسي': 90,
		جوجل: 120,
		'زيارة مباشرة': 320,
	},
	{
		name: 'week 4',
		'الموقع الرئيسي': 120,
		جوجل: 150,
		'زيارة مباشرة':300,
	},
	{
		name: 'week 5',
		'الموقع الرئيسي': 80,
		جوجل: 180,
		'زيارة مباشرة': 290,
	},
	{
		name: 'week 6',
		'الموقع الرئيسي': 100,
		جوجل: 150,
		'زيارة مباشرة': 600,
	},
];

const CustomersReports = () => {
	return (
		<section className='customers-reports-data'>
			<div className='report-head mb-2'>
				<h4>العملاء</h4>
			</div>
			<div className='report-body'>
				<div className='row'>
					<div className='col-12'>
						<h5>مصادر الزيارات</h5>
					</div>
				</div>
				<div className='customers-BarChart'>
					<ResponsiveContainer width='100%' height={'100%'}>
						<BarChart
							width={500}
							height={300}
							data={data}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray='' />
							<XAxis dataKey='name' axisLine={false} tickLine={false} />
							<YAxis tickMargin={28}  axisLine={false} tickLine={false} align='right' />
							<Tooltip />
							<Legend verticalAlign='top' height={80} iconSize={18} align='right' radius={'20'} />
							<Bar dataKey='الموقع الرئيسي' stackId='a' fill='#5fe3a1' barSize={30}  />
							<Bar dataKey='جوجل' stackId='a' fill='#56d9fe' />
							<Bar dataKey='زيارة مباشرة' stackId='a' fill='#8884d8' />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</section>
	);
};

export default CustomersReports;
