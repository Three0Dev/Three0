import React, { useState } from 'react'
import {Box, Button, TextField, Typography} from '@material-ui/core'
import AddIcon from '@mui/icons-material/Add';

import { useStateValue, actions } from '../state'

export function KeyValueStoreControls () {
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

    if (db.type !== 'keyvalue') {
      throw new Error('This component can only handle Key-Value databases')
    }

    await db.set(key, value)

    const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
    <Box>
    <Typography>Set a value for a key</Typography>
    <TextField
        onChange={handleKeyChange}
        name='key'
        placeholder='key'
        height={24}
        width='20%'
      ></TextField>
      <TextField
        onChange={handleValueChange}
        name='value'
        placeholder='value'
        height={24}
        width='20%'
      ></TextField>
    <Button
      height={24}
      onClick={handleAdd}
      variant="outlined"
    >
      <AddIcon />
      Set
    </Button>
  </Box>
  )
}
