import React, { useState } from 'react'

import { Box, Button, TextField, InputLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { useStateValue, actions } from '../../state'

export default function CounterStoreControls() {
	const [appState, dispatch] = useStateValue()
	const [value, setValue] = useState(1)

	function handleValueChange(event) {
		setValue(event.target.value)
	}

	const addToDB = async () => {
		const { db } = appState

		if (db.type !== 'counter') {
			throw new Error('This component can only handle Counter databases')
		}

		const val = parseInt(value, 10) || 0

		if (val > 0) {
			await db.inc(val)
		}

		const entries = [{ payload: { value: db.value } }]
		dispatch({ type: actions.DB.SET_DB, db, entries })
	}

	function handleAdd(event) {
		if (event) event.preventDefault()
		if (value.length === 0) return
		addToDB()
	}

	return (
		<Box>
			<InputLabel>Number</InputLabel>
			<TextField
				onChange={handleValueChange}
				name="value"
				value={value}
				placeholder="Value"
			/>

			<Button
				onClick={handleAdd}
				variant="contained"
				sx={{ marginLeft: 2 }}
				startIcon={<AddIcon />}
			>
				Increment
			</Button>
		</Box>
	)
}
