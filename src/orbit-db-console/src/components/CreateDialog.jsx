import React from 'react'
import {
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControlLabel,
	Checkbox,
	FormControl,
} from '@mui/material'

export default function CreateDialog({ onCreate }) {
	const [name, setName] = React.useState('')
	const [type, setType] = React.useState('')
	const [permissions, setPermissions] = React.useState('')
	const [overwrite, setOverwrite] = React.useState(false)

	function handleNameChange(newName) {
		if (!newName.includes(' ')) {
			setName(newName)
		}
	}

	React.useEffect(
		() => onCreate({ name, type, permissions, overwrite }),
		[name, type, permissions, overwrite]
	)

	return (
		<>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<TextField
					onChange={(e) => handleNameChange(e.target.value)}
					name="name"
					value={name}
					placeholder="Database name"
					variant="outlined"
				/>
			</FormControl>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<InputLabel id="database-type">Type:</InputLabel>
				<Select
					variant="outlined"
					label="Type:"
					labelId="database-type"
					onChange={(e) => setType(e.target.value)}
					value={type}
				>
					<MenuItem value="eventlog">Immutable Log</MenuItem>
					<MenuItem value="feed">A list of entries</MenuItem>
					<MenuItem value="keyvalue">Key-Value Store</MenuItem>
					<MenuItem value="docstore">Document Store</MenuItem>
					<MenuItem value="counter">Counter (CRDT)</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth sx={{ margin: '2% 0' }}>
				<InputLabel id="write-permissions">Write Permissions:</InputLabel>
				<Select
					variant="outlined"
					label="Write Permissions:"
					labelId="write-permissions"
					onChange={(e) => setPermissions(e.target.value)}
					value={permissions}
				>
					<MenuItem value="creator">
						Creator-only: Only you can write, public read
					</MenuItem>
					<MenuItem value="public">
						Public: Anybody can write and write
					</MenuItem>
				</Select>
			</FormControl>
			<FormControl>
				<FormControlLabel
					control={
						<Checkbox
							checked={overwrite}
							onChange={(event) => setOverwrite(event.target.checked)}
						/>
					}
					label="Overwrite"
				/>
			</FormControl>
		</>
	)
}
