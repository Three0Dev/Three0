import React from 'react'
import { Backdrop as MuiBackdrop, CircularProgress, Box } from '@mui/material'

export default function Backdrop(props) {
	return (
		<MuiBackdrop
			open={props.loading}
			sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				height={400}
			>
				<CircularProgress color="inherit" />
			</Box>
		</MuiBackdrop>
	)
}
