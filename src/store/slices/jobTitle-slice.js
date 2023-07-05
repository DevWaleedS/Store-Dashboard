import { createSlice } from '@reduxjs/toolkit';

const jobTitle = [
	{
		id: 1,
		title: 'آدمن',
	},
	{
		id: 2,
		title: 'سوبر آدمن',
	},
	{
		id: 3,
		title: 'دعم فني',
	},
	{
		id: 4,
		title: 'خدمات العملاء',
	},
	{
		id: 5,
		title: 'تسويق',
	},
];
// slices
const jobTitleDataSlice = createSlice({
	name: 'jobTitleData',
	initialState: jobTitle,
	reducers: {},
});

export const {} = jobTitleDataSlice.actions;
export default jobTitleDataSlice.reducer;
