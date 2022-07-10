import React from 'react'
import {
	TextField,
	Select,
	InputLabel,
	FormControlLabel,
	Checkbox,
	FormControl,
} from '@mui/material'

export default function CreateDialog() {
	return (
		<>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<TextField
					name="name"
					placeholder="Database name"
					variant="outlined"
					id="database-name"
				/>
			</FormControl>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<InputLabel id="database-type-label">Type:</InputLabel>
				<Select
					native
					variant="outlined"
					label="Type:"
					id="database-type"
					labelId="database-type-label"
				>
					<option value="eventlog">Immutable Log</option>
					<option value="feed">A list of entries</option>
					<option value="keyvalue">Key-Value Store</option>
					<option value="docstore">Document Store</option>
					<option value="counter">Counter (CRDT)</option>
				</Select>
			</FormControl>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<InputLabel id="write-permissions-label">Write Permissions:</InputLabel>
				<Select
					native
					variant="outlined"
					label="Write Permissions:"
					labelId="write-permissions-label"
					id="database-permissions"
				>
					<option value="creator">
						Creator-only: Only you can write, public read
					</option>
					<option value="public">Public: Anybody can write and write</option>
				</Select>
			</FormControl>
			<FormControl>
				<FormControlLabel
					control={<Checkbox id="database-overwrite" />}
					label="Overwrite"
				/>
			</FormControl>
		</>
	)
}
