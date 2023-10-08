import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	subActivities: []
};
// slices
const AddSubActivitySlice = createSlice({
	name: 'AddSubActivity',
	initialState: initialValueState,
	reducers: {
		addSubActivity: (state, action) => {
			state.subActivities = action.payload;
		},
		resetSubActivity: (state) => {
			state.subActivities = [];
		},
	},
});

export const { addSubActivity,resetSubActivity } = AddSubActivitySlice.actions;
export default AddSubActivitySlice.reducer;
