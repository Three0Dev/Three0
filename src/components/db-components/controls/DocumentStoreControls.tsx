import React, { useState } from 'react'
import { Box, Button, TextField, InputLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useStateValue, actions } from '../../../state/DatabaseState'

const short = require('short-uuid')

export default function DocumentStoreControls() {
	const [appState, dispatch] = useStateValue()
	const [key, setKey] = useState('')
	const [value, setValue] = useState('')

	function handleValueChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setValue(event.target.value)
	}

	function handleKeyChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setKey(event.target.value)
	}

	const addToDB = async () => {
		const { db } = appState

		if (db.type !== 'docstore') {
			throw new Error('This component can only handle Document databases')
		}

		if (key.length === 0) {
			setKey(short.generate())
		}

		await db.put({ _id: key, value })

		const entries = db.query((e: any) => e !== null, { fullOp: true }).reverse()
		dispatch({ type: actions.DB.SET_DB, db, entries })
	}

	function handleAdd(event: React.MouseEvent<HTMLButtonElement>) {
		if (event) event.preventDefault()
		if (value.length === 0) return
		if (key.length === 0) return
		addToDB()
	}

	return (
		<Box>
			<InputLabel>Entry</InputLabel>
			<TextField
				id="key"
				onChange={(e) => handleKeyChange(e)}
				name="key"
				value={key}
				placeholder="Key"
			/>
			<TextField
				onChange={(e) => handleValueChange(e)}
				name="value"
				value={value}
				placeholder="Value"
			/>
			<Button
				onClick={(e) => handleAdd(e)}
				variant="contained"
				sx={{ marginLeft: 2 }}
				startIcon={<AddIcon />}
			>
				Put
			</Button>
		</Box>
	)
}
