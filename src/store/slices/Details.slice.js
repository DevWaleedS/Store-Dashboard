import { createSlice } from '@reduxjs/toolkit';
import { ReactComponent as Eye } from '../../data/Icons/icon-24-invisible.svg';
import { ReactComponent as User } from '../../data/Icons/icon-24-user.svg';
import { ReactComponent as Sales } from '../../data/Icons/icon-32-sales.svg';
import { ReactComponent as Product } from '../../data/Icons/icon-32-product.svg';

const details = [
	{
		id: 1,
		icon: <Eye />,
		title: 'اجمالي الزيارات',
		numbers: '3580',
		color: '#a5b2f8',
	},
	{
		id: 2,
		icon: <User />,
		title: 'اجمالي العملاء',
		numbers: '250',
		color: '#66adff',
	},
	{
		id: 3,
		icon: <Sales />,
		title: 'اجمالي المبيعات',
		numbers: 'SAR 11,892',
		color: '#02466a',
	},
	{
		id: 4,
		icon: <Product />,
		title: 'اجمالي المنتجات',
		numbers: '450',
		color: '#b6be34',
	},
];

const detailsSlice = createSlice({
	name: 'dashboardDetails',
	initialState: details,
	reducers: {},
});

export const {} = detailsSlice.actions;
export default detailsSlice.reducer;
