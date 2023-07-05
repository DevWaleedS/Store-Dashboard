import { createSlice } from '@reduxjs/toolkit';

const commentsDataTable = [
	{
		id: '01',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '02',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',

		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
	{
		id: '03',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '04',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',

		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
	{
		id: '05',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '06',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',

		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
	{
		id: '07',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '08',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',

		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
	{
		id: '09',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '10',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',

		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
	{
		id: '11',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '12',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',

		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
	{
		id: '13',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '14',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',

		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
	{
		id: '15',
		userName: 'عبد العزيز محمد',
		city: ' الرياض',
		comment: ' منصة رائعة وشاملة وجهودكم عظيمة في دعم المتاجر الصغيرة والكبيرة',
		status: 'مفعل',
		isActive: true,
		bgcolor: '#e0ffea',
		color: '#3ae374',
	},
	{
		id: '16',
		userName: 'خالد عبدالله حسين ',
		city: ' الدمام',
		comment: 'جهود ممتازة',
		status: 'غير مفعل ',
		isActive: false,
		bgcolor: '#ebebeb',
		color: '#a7a7a7',
	},
];

// slices
const CommentsTableDataSlice = createSlice({
	name: 'CommentsTableTable',
	initialState: commentsDataTable,
	reducers: {},
});

export const {} = CommentsTableDataSlice.actions;
export default CommentsTableDataSlice.reducer;
