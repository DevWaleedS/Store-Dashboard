import { createSlice } from '@reduxjs/toolkit';

// import table image
import person from '../../data/Icons/person.jpg';

const ordersDataTable = [
	{
		id: '01',
		number: ' 0052',
		icon: person,
		name: 'أسيل عبد الرحمن',
		stats: ' جديد',
		location: 'الرياض',
		price: 12,
		total: 84,

		bgColor: '#d4ebf7',
		color: '#0077ff',
	},
	{
		id: '02',
		number: ' 0052',
		icon: person,
		name: '  خالد الأحمدي',
		stats: '  جاري التجهيز',
		location: 'جدة',
		price: 12,
		total: 84,

		bgColor: '#ffecd1c7',
		color: '#ff9f1a',
	},
	{
		id: '03',
		number: ' 0052',
		icon: person,
		name: '  خالد الأحمدي',
		stats: '  جاري التجهيز',
		location: 'الدمام',
		price: 12,
		total: 84,

		bgColor: '#ffecd1c7',
		color: '#ff9f1a',
	},

	{
		id: '04',
		number: ' 0052',
		icon: person,
		name: '  ولاء محمد المحمدي',
		stats: ' جاهز',
		location: 'الرياض',
		price: 12,
		total: 84,

		bgColor: '#e8f8f8',
		color: '#46c7ca',
	},
	{
		id: '05',
		number: ' 0052',
		icon: person,
		name: 'أسيل عبد الرحمن',
		stats: ' جاري	التوصيل',
		location: 'الرياض',
		price: 12,
		total: 84,

		bgColor: '#f3f3fb',
		color: '#928fd5',
	},
	{
		id: '06',
		number: ' 0052',
		icon: person,
		name: '     محمود ابراهيم',
		stats: ' مكتمل',
		location: 'الرياض',
		price: 12,
		total: 84,

		bgColor: '#ebfcf1',
		color: '#9df1ba',
	},
	{
		id: '07',
		number: ' 0052',
		icon: person,
		name: '     محمود ابراهيم',
		stats: ' ملغي',
		location: 'جدة',
		price: 52,
		total: 124,

		bgColor: '#ffebeb',
		color: '#ff7b7b',
	},
	{
		id: '08',
		number: ' 0052',
		icon: person,
		name: '     محمود ابراهيم',
		stats: ' ملغي',
		location: 'جدة',
		price: 52,
		total: 124,

		bgColor: '#ffebeb',
		color: '#ff7b7b',
	},
];

// slices
const BigOrdersTableDataSlice = createSlice({
	name: 'ordersDataTable',
	initialState: ordersDataTable,
	reducers: {},
});

export const {} = BigOrdersTableDataSlice.actions;
export default BigOrdersTableDataSlice.reducer;
