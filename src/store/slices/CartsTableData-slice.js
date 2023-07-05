import { createSlice } from '@reduxjs/toolkit';

// import table image
import person from '../../data/Icons/person.jpg';
// ICON


const cartsDataTable = [
	{
		id: '01',
		icon: person,
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/04',
		numOfProducts: 23,
		cartTotal: '5340 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '02',
		icon: person,
		name: 'خالد الأحمدي ',
		cartDate: '2022/Dec/04',
		numOfProducts: 82,
		cartTotal: '3450 ر.س',
		status: ' مكتمل',
	},

	{
		id: '03',
		icon: person,
		name: ' ولاء محمد المحمدي',
		cartDate: '2022/Jun/04',
		numOfProducts: 62,
		cartTotal: '120 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '04',
		icon: person,
		name: '  أحمد عبد العزيز داود',
		cartDate: '2022/Oct/20',
		numOfProducts: 32,
		cartTotal: '120 ر.س',
		status: ' مكتمل',
	},
	{
		id: '05',
		icon: person,
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/09',
		numOfProducts: 21,
		cartTotal: '500ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '06',
		icon: person,
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/04',
		numOfProducts: 23,
		cartTotal: '5340 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '07',
		icon: person,
		name: 'خالد الأحمدي ',
		cartDate: '2022/Dec/04',
		numOfProducts: 82,
		cartTotal: '3450 ر.س',
		status: ' مكتمل',
	},

	{
		id: '08',
		icon: person,
		name: ' ولاء محمد المحمدي',
		cartDate: '2022/Jun/04',
		numOfProducts: 62,
		cartTotal: '54 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '09',
		icon: person,
		name: '  أحمد عبد العزيز داود',
		cartDate: '2022/Oct/20',
		numOfProducts: 32,
		cartTotal: '120 ر.س',
		status: ' مكتمل',
	},
	{
		id: '10',
		icon: person,
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/09',
		numOfProducts: 21,
		cartTotal: '500 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '11',
		icon: person,
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/04',
		numOfProducts: 23,
		cartTotal: '5340 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '12',
		icon: person,
		name: 'خالد الأحمدي ',
		cartDate: '2022/Dec/04',
		numOfProducts: 82,
		cartTotal: '3450 ر.س',
		status: ' مكتمل',
	},

	{
		id: '13',
		icon: person,
		name: ' ولاء محمد المحمدي',
		cartDate: '2022/Jun/04',
		numOfProducts: 62,
		cartTotal: '54 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '14',
		icon: person,
		name: '  أحمد عبد العزيز داود',
		cartDate: '2022/Oct/20',
		numOfProducts: 32,
		cartTotal: '120 ر.س',
		status: ' مكتمل',
	},
	{
		id: '15',
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/09',
		numOfProducts: 21,
		cartTotal: '500 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '16',

		icon: person,
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/04',
		numOfProducts: 23,
		cartTotal: '5340 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '17',
		icon: person,
		name: 'خالد الأحمدي ',
		cartDate: '2022/Dec/04',
		numOfProducts: 82,
		cartTotal: '340 ر.س',
		status: ' مكتمل',
	},

	{
		id: '18',
		icon: person,
		name: ' ولاء محمد المحمدي',
		cartDate: '2022/Jun/04',
		numOfProducts: 62,
		cartTotal: '54 ر.س',
		status: 'غير مكتمل',
	},
	{
		id: '19',
		icon: person,
		name: '  أحمد عبد العزيز داود',
		cartDate: '2022/Oct/20',
		numOfProducts: 32,
		cartTotal: '120 ر.س',
		status: ' مكتمل',
	},
	{
		id: '20',
		icon: person,
		name: 'أسيل عبد الرحمن',
		cartDate: '2022/Sep/09',
		numOfProducts: 21,
		cartTotal: '500 ر.س',
		status: 'غير مكتمل',
	},
];

// slices
const CartsTablesDataSlice = createSlice({
	name: 'ordersDataTable',
	initialState: cartsDataTable,
	reducers: {},
});

export const {} = CartsTablesDataSlice.actions;
export default CartsTablesDataSlice.reducer;
