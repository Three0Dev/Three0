import React from 'react'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	MenuItem,
	Select,
	InputLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useStateValue, actions } from '../state'

const classes = {
	root: {
		width: '100%',
		marginTop: 2,
		marginBottom: 2,
		overflowX: 'auto',
		justifyContent: 'center',
		display: 'flex',
	},
	actionContainer: {
		margin: 1,
	},
}

export default function CreateDialog({ onCreate }) {
	const [appState, dispatch] = useStateValue()
	const [name, setName] = React.useState('')
	const [type, setType] = React.useState('')
	const [permissions, setPermissions] = React.useState('')
	const [overwrite, setOverwrite] = React.useState()

	function handleSubmit(event) {
		if (event) event.preventDefault()
		if (name.length === 0) return
		console.log('Create:', name, type, permissions)
		onCreate({ name, type, permissions, overwrite })
		dispatch({ type: actions.DB.CLOSE_CREATEDB_DIALOG })
	}

	function handleNameChange(event) {
		if (!event.target.value.includes(' ')) {
			setName(event.target.value)
		}
	}

	function handleTypeChange(event) {
		setType(event.target.value)
	}

	function handlePermissionsChange(event) {
		setPermissions(event.target.value)
	}

	function handleClose() {
		dispatch({ type: actions.DB.CLOSE_CREATEDB_DIALOG })
		setName('')
	}

	function handleOverwriteChange(event) {
		setOverwrite(event.target.value === 'true')
	}

	return (
		<Dialog open={appState.createDBDialogOpen} sx={classes.root}>
			<DialogTitle>Create Database</DialogTitle>
			<DialogContent>
				<TextField
					onChange={() => handleNameChange}
					name="name"
					value={name}
					placeholder="Database name"
					fullWidth
					variant="outlined"
				/>
				<InputLabel id="database-type">Type:</InputLabel>
				<Select
					variant="outlined"
					fullWidth
					labelId="database-type"
					onChange={() => handleTypeChange}
					value={type}
				>
					<MenuItem value="eventlog">Immutable Log</MenuItem>
					<MenuItem value="feed">A list of entries</MenuItem>
					<MenuItem value="keyvalue">Key-Value Store</MenuItem>
					<MenuItem value="docstore">Document Store</MenuItem>
					<MenuItem value="counter">Counter (CRDT)</MenuItem>
				</Select>
				<InputLabel id="write-permissions">Write Permissions:</InputLabel>
				<Select
					variant="outlined"
					fullWidth
					labelId="write-permissions"
					onChange={() => handlePermissionsChange}
					value={permissions}
				>
					<MenuItem value="creator">
						Creator-only: Only you can write, public read
					</MenuItem>
					<MenuItem value="public">
						Public: Anybody can write and write
					</MenuItem>
				</Select>
				<InputLabel id="overwrite">Overwrite:</InputLabel>
				<Select
					variant="outlined"
					fullWidth
					labelId="overwrite"
					onChange={() => handleOverwriteChange}
					value={overwrite}
				>
					<MenuItem value="false">No</MenuItem>
					<MenuItem value="true">Yes</MenuItem>
				</Select>
			</DialogContent>
			<DialogActions sx={classes.actionContainer}>
				<Button onClick={() => handleClose} color="error">
					Cancel
				</Button>
				<Button
					onClick={() => handleSubmit}
					color="primary"
					variant="contained"
					startIcon={<AddIcon />}
				>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	)
}
