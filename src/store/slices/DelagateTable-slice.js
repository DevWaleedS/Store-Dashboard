import { createSlice } from '@reduxjs/toolkit';

// ICON

import person from '../../data/Icons/person.jpg';
import { ReactComponent as star } from '../../data/Icons/icon-20-star.svg';
import { ReactComponent as HalfStar } from '../../data/Icons/icon-20-star_half.svg';

const DelegateDataTable = [
	{
		id: '01',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '9665151233',
		city: 'الرياض',
	
		halfStar: <HalfStar />,
	},
	{
		id: '02',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '966444852',
		city: 'جدة',
		
		halfStar: <HalfStar />,
	},

	{
		id: '03',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '9665151233',
		city: 'الدمام',
	
		halfStar: <HalfStar />,
	},
	{
		id: '04',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '966444852',
		city: 'القصيم',
		
		halfStar: <HalfStar />,
	},
	{
		id: '05',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '9665151233',
		city: 'الرياض',
	
		halfStar: <HalfStar />,
	},
	{
		id: '06',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '9665151233',
		city: 'جدة',
		
		halfStar: <HalfStar />,
	},
	{
		id: '07',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '966444852',
		city: 'الدمام',
	
		halfStar: <HalfStar />,
	},

	{
		id: '08',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '9665151233',
		city: 'القصيم',
		star: star,
		halfStar: <HalfStar />,
	},
	{
		id: '09',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '966444852',
		city: 'الرياض',
	
		halfStar: <HalfStar />,
	},
	{
		id: '10',
		customerImage: person,
		clientName: 'محمد عبد الرحمن',
		phoneNumber: '9665151233',
		city: 'جدة',
	
		halfStar: <HalfStar />,
	},
];

// slices
const DelegateTableDataSlice = createSlice({
	name: 'DelegateTable',
	initialState: DelegateDataTable,
	reducers: {},
});

export const {} = DelegateTableDataSlice.actions;
export default DelegateTableDataSlice.reducer;
