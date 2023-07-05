import { createSlice } from '@reduxjs/toolkit';

// import table image
import person from '../../data/Icons/person.jpg';
// ICON
import { BsThreeDotsVertical } from 'react-icons/bs';

const ordersDataTable = [
	{
		id: 1,
		icon: person,
		number: ' 0052',
		name: 'أسيل عبد الرحمن',
		stats: ' قيد التنفيذ',
		location: 'الرياض',
		actionIcon: <BsThreeDotsVertical />,
		bgColor: '#d4ebf7',
		color: '#0077ff',
	},
	{
		id: 2,
		icon: person,
		number: ' 0052',
		name: '  خالد الأحمدي',
		stats: '  بانتظار الدفع',
		location: 'الرياض',
		actionIcon: <BsThreeDotsVertical />,
		bgColor: '#ffc5001c',
		color: '#fae100',
	},

	{
		id: 3,
		icon: person,
		number: ' 0052',
		name: '  ولاء محمد المحمدي',
		stats: ' قيد المراجعة',
		location: 'الرياض',
		actionIcon: <BsThreeDotsVertical />,
		bgColor: '#ffecd1c7',
		color: '#ff9f1a',
	},
	{
		id: 4,
		icon: person,
		number: ' 0052',
		name: 'أسيل عبد الرحمن',
		stats: ' قيد التنفيذ',
		location: 'الرياض',
		actionIcon: <BsThreeDotsVertical />,
		bgColor: '#d8f9e3',
		color: '#3ae374',
	},
	{
		id: 5,
		icon: person,
		number: ' 0052',
		name: '      سامح حسين',
		stats: '   جاري التوصيل',
		location: 'الرياض',
		actionIcon: <BsThreeDotsVertical />,
		bgColor: '#b29eff36',
		color: '#ab1aff',
	},
];

// slices
const OrdersTablesDataSlice = createSlice({
	name: 'ordersDataTable',
	initialState: ordersDataTable,
	reducers: {},
});

export const {} = OrdersTablesDataSlice.actions;
export default OrdersTablesDataSlice.reducer;
