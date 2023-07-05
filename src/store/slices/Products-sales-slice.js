import { createSlice } from '@reduxjs/toolkit';

// import table images
import car from '../../data/Icons/image car.png';
import shose from '../../data/Icons/image shose.png';
import camera from '../../data/Icons/image camera.png';



const productSalesDataTable = [
	{
		id: 1,
		productNumberTitle: 'رقم المنتج',
		nameTitle: ' الاسم',
		categoryTitle: 'التصنيف ',
		PriceTitle: 'السعر ',
		totalSalesTile: 'احمالي المبيعات',

		icon: shose,
		ProductNumber: ' 150',
		productName: ' حذاء نايك',
		category: '  أحذية',
		price: '35',
		totalSales: '9830',
	},
	{
		id: 2,
		icon: camera,
		ProductNumber: ' 150',
		productName: '    كاميرا شت',
		category: '  الكترونيات',
		price: '35',
		totalSales: '9830',
	},
	{
		id: 3,
		icon: shose,
		ProductNumber: ' 150',
		productName: 'نظارة شمسية',
		category: '  اكسسوارات',
		price: '35',
		totalSales: '9830',
	},
	{
		id: 4,
		icon: car,
		ProductNumber: ' 150',
		productName: '   سيارة انتيكا',
		category: '  هدايا',
		price: '35',
		totalSales: '9830',
	},
	{
		id: 5,
		icon: car,
		ProductNumber: ' 150',
		productName: '   سيارة انتيكا',
		category: '  هدايا',
		price: '35',
		totalSales: '9830',
	},
];

// slices
const salesProductsDataSlice = createSlice({
	name: 'ordersDataTable',
	initialState: productSalesDataTable,
	reducers: {},
});

export const {} = salesProductsDataSlice.actions;
export default salesProductsDataSlice.reducer;
