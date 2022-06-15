import React from 'react'
import {
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
} from '@mui/material'

export default function CreateProjectDialog() {
	return (
		<>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<TextField
					name="name"
					placeholder="Project Name"
					variant="outlined"
					id="project-name"
				/>
			</FormControl>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<InputLabel id="blockchain-type">Type:</InputLabel>
				<Select
					variant="outlined"
					label="Type:"
					labelId="blockchain-type"
					id="blockchain-type"
				>
					<MenuItem value="NEAR_TESTNET">NEAR Testnet</MenuItem>
				</Select>
			</FormControl>
		</>
	)
}
