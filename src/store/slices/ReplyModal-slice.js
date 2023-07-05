import { createSlice } from '@reduxjs/toolkit';

const initialValueState = {
	isOpenReplyModal: false,
};

// slices
const ReplyModalSlice = createSlice({
	name: 'ReplyModalSlice',
	initialState: initialValueState,
	reducers: {
		openReplyModal: (state, action) => {
			state.isOpenReplyModal = true;
		},
		closeReplyModal: (state, action) => {
			state.isOpenReplyModal = false;
		},
	},
});

export const { openReplyModal, closeReplyModal } = ReplyModalSlice.actions;
export default ReplyModalSlice.reducer;

