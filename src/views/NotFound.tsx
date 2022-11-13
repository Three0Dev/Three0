import React from 'react'
import { Typography } from '@mui/material'
import NotFoundPhoto from '../assets/notfound.svg'

export default function NotFound() {
	return (
		<>
			<img src={NotFoundPhoto} alt="WIP" className="majorImg" />
			<Typography
				variant="h3"
				style={{
					textAlign: 'center',
					color: '#81C784',
					fontWeight: 'bold',
				}}
			>
				Page Not Found
			</Typography>
		</>
	)
}
