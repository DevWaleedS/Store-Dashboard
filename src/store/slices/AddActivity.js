import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	activity: []
};
// slices
const AddActivitySlice = createSlice({
	name: 'AddActivity',
	initialState: initialValueState,
	reducers: {
		addActivity: (state, action) => {
			state.activity = action.payload;
		},
		resetActivity: (state) => {
			state.activity = [];
		}
	},
});

export const { addActivity, resetActivity} = AddActivitySlice.actions;
export default AddActivitySlice.reducer;
