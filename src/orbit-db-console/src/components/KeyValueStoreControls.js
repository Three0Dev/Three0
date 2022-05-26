import React, { useState } from 'react'
import {Box, Button, TextField, InputLabel, Select, MenuItem} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

import { useStateValue, actions } from '../state'

export function KeyValueStoreControls () {
  const [appState, dispatch] = useStateValue()
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [type, setType] = useState('string')

  function handleValueChange (event) {
    setValue(event.target.value)
  }

  function handleKeyChange (event) {
    setKey(event.target.value)
  }

  function handleAdd (event) {
    if (event) event.preventDefault()
    if (value.length === 0) return
    if (key.length === 0) return
    addToDB()
  }

  const addToDB = async () => {
    const db = appState.db

    if (db.type !== 'keyvalue') {
      throw new Error('This component can only handle Key-Value databases')
    }

    let entry = value;

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

    await db.set(key, entry)

    const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    dispatch({ type: actions.DB.SET_DB, db, entries })
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
      onChange={handleKeyChange}
      name='key'
      value={key}
      placeholder='Key'
    />
    <TextField
      onChange={handleValueChange}
      name='value'
      value={value}
      placeholder='Value'
    />
    <Button
      onClick={handleAdd}
      variant="contained"
      sx={{marginLeft: 2}}
    >
      <AddIcon />
      Set
    </Button>
  </Box>
  )
}
