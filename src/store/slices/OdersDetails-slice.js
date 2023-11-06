import { createSlice } from "@reduxjs/toolkit";

import { ReactComponent as CheckMark } from "../../data/Icons/icon-24- true.svg";
import { ReactComponent as FileIcon } from "../../data/Icons/icon-24- uncomplete order.svg";
import { ReactComponent as PageIcon } from "../../data/Icons/icon-3.svg";
import { ReactComponent as Product } from "../../data/Icons/icon-32-product.svg";

const ordersDetailsData = [
	{
		id: 1,
		icon: <CheckMark />,
		title: "طلبات مكتمله ",
		numbers: "240",
		color: "#3ae374",
	},
	{
		id: 2,
		icon: <FileIcon />,
		title: "طلبات ملغيه ",
		numbers: "37",
		color: "#ff9f1a",
	},
	{
		id: 3,
		icon: <PageIcon />,
		title: " طلبات جديدة",
		numbers: "18",
		color: "#02466a",
	},
	{
		id: 4,
		icon: <Product />,
		title: "اجمالي الطلبات",
		numbers: "259",
		color: "#b6be34",
	},
];

const ordersDetails = createSlice({
	name: "dashboardDetails",
	initialState: ordersDetailsData,
	reducers: {},
});

export const {} = ordersDetails.actions;
export default ordersDetails.reducer;
