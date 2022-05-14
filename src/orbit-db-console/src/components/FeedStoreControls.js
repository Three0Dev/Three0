import React from 'react'

import {Box, Button, TextField, Typography} from '@material-ui/core'
import AddIcon from '@mui/icons-material/Add';

import { useStateValue, actions } from '../state'

export function FeedStoreControls () {
  const [appState, dispatch] = useStateValue()
  const [value, setValue] = React.useState('')

  function handleValueChange (event) {
    setValue(event.target.value)
  }

  function handleAdd (event) {
    if (event) event.preventDefault()
    if (value.length === 0) return
    addToDB()
  }

  const addToDB = async () => {
    const db = appState.db

    if (db.type !== 'feed') {
      throw new Error('This component can only handle Feed databases')
    }

    await db.add(value)

    const entries = await db.iterator({ limit: 10 }).collect().reverse()
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
    <Box>
    <Typography>Add an entry to the feed</Typography>
    <TextField
      onChange={handleValueChange}
      name='value'
      placeholder='Value'
      height={24}
      width='30%'
    ></TextField>
    <Button
      height={24}
      onClick={handleAdd}
      variant="outlined"
    >
      <AddIcon />
      Add
    </Button>
  </Box>
  )
}