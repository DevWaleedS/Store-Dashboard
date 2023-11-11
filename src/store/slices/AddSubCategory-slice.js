import { createSlice } from "@reduxjs/toolkit";
// import table images

const initialValueState = {
	isOpen: false,
};
// slices
const AddSubCategorySlice = createSlice({
	name: "AddSubCategory",
	initialState: initialValueState,
	reducers: {
		openAddSubCategory: (state, action) => {
			state.isOpen = true;
		},
		closeAddSubCategory: (state, action) => {
			state.isOpen = false;
		},
	},
});

export const { openAddSubCategory, closeAddSubCategory } =
	AddSubCategorySlice.actions;
export default AddSubCategorySlice.reducer;
