import { createSlice } from '@reduxjs/toolkit';
import { categoriesThunk } from '../Thunk/CategoryTableThunk';

// initial State
const initCategoriesData = {
	loading: true,
	reload: false,
	categoriesData: [],
};

// slices
const CategoriesTablesDataSlice = createSlice({
	name: 'categoriesData',
	initialState: initCategoriesData,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(categoriesThunk.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(categoriesThunk.fulfilled, (state, action) => {
			state.loading = false;
			state.categoriesData = action.payload.data;
			state.reload = true;
		});
		builder.addCase(categoriesThunk.rejected, (state, action) => {
			console.log('err');
		});
	},
});

// export const {} = CategoriesTablesDataSlice.actions;
export default CategoriesTablesDataSlice.reducer;
