import React from 'react'
import {
	Box,
	Button,
	TextField,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useStateValue, actions } from '../../../state/DatabaseState'

export default function FeedStoreControls() {
	const [appState, dispatch] = useStateValue()
	const [value, setValue] = React.useState('')
	const [type, setType] = React.useState('string')

	function handleValueChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setValue(event.target.value)
	}

	const addToDB = async () => {
		const { db } = appState

		if (db.type !== 'feed') {
			throw new Error('This component can only handle Feed databases')
		}

		let entry: any = value

		switch (type) {
			case 'bool':
				entry = Boolean(value)
				break
			case 'number':
				entry = Number(value)
				break
			case 'array':
				entry = value.split(',')
				break
			case 'map':
				entry = JSON.parse(value)
				break
			default:
				break
		}

		await db.add(entry)

		const entries = await db.iterator({ limit: 10 }).collect().reverse()
		dispatch({ type: actions.DB.SET_DB, db, entries })
	}

	function handleAdd(event: React.MouseEvent<HTMLButtonElement>) {
		if (event) event.preventDefault()
		if (value.length === 0) return
		addToDB()
	}

	return (
		<Box>
			<InputLabel id="type">Type</InputLabel>
			<Select
				labelId="type"
				value={type}
				label="data-type"
				onChange={(e) => setType(e.target.value)}
			>
				<MenuItem value="string">String</MenuItem>
				<MenuItem value="number">Number</MenuItem>
				<MenuItem value="bool">Boolean</MenuItem>
				<MenuItem value="map">Map</MenuItem>
				<MenuItem value="array">Array</MenuItem>
			</Select>
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
				Add
			</Button>
		</Box>
	)
}
