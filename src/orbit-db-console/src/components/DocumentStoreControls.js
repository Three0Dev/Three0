import React, { useState } from 'react'
import {Box, Button, TextField, InputLabel} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

import { useStateValue, actions } from '../state'
const short = require('short-uuid');

export function DocumentStoreControls () {
  const [appState, dispatch] = useStateValue()
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

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

    if (db.type !== 'docstore') {
      throw new Error('This component can only handle Document databases')
    }

    if(key.length === 0) {
      setKey(short.generate());
    }

    await db.put({_id: key, value})

    const entries = db.query(e => e !== null, {fullOp: true}).reverse()
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
  <Box>
    <InputLabel>Entry</InputLabel>
    <TextField
      id='key'
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
      Put
    </Button>
  </Box>
  )
}