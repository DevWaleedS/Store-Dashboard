import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpenCelebrityMarketingModal: false,
};
// slices
const CelebrityMarketingModal = createSlice({
	name: 'CelebrityMarketingModal',
	initialState: initialValueState,
	reducers: {
		OpenCelebrityMarketingModal: (state, action) => {
			state.isOpenCelebrityMarketingModal = true;
		},
		closeCelebrityMarketingModal: (state, action) => {
			state.isOpenCelebrityMarketingModal = false;
		},
	},
});

export const { OpenCelebrityMarketingModal, closeCelebrityMarketingModal } = CelebrityMarketingModal.actions;
export default CelebrityMarketingModal.reducer;
