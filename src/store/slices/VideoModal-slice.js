import { createSlice } from '@reduxjs/toolkit';

const initialValueState = {
	isOpenVideoModal: false,
	currentVideo: null,
};

const VideoModalSlice = createSlice({
	name: 'VideoModal',
	initialState: initialValueState,
	reducers: {
		openModal: (state, action) => {
			state.isOpenVideoModal = true;
			state.currentVideo = action.payload;
		},
		closeModal: (state) => {
			state.isOpenVideoModal = false;
			state.currentVideo = null;
		},
	},
});

export const { openModal, closeModal } = VideoModalSlice.actions;
export default VideoModalSlice.reducer;
