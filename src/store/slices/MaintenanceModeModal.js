import { createSlice } from '@reduxjs/toolkit';


const initialValueState = {
	isOpenMaintenanceModeModal: false,
};
// slices
const MaintenanceModeModal = createSlice({
	name: 'MaintenanceModeModal',
	initialState: initialValueState,
	reducers: {
		openMaintenanceModeModal: (state, action) => {
			state.isOpenMaintenanceModeModal = true;
		},
		closeMaintenanceModeModal: (state, action) => {
			state.isOpenMaintenanceModeModal = false;
		},
	},
});

export const { openMaintenanceModeModal, closeMaintenanceModeModal } = MaintenanceModeModal.actions;
export default MaintenanceModeModal.reducer;
