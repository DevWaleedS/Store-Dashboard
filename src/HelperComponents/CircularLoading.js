import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularLoading() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
			<span>جاري التحميل</span> <CircularProgress size='24px' />
		</Box>
	);
}
