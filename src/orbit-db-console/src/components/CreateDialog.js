import React from 'react'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';


import { useStateValue, actions } from '../state'

export function CreateDialog ({ onCreate }) {
  const [appState, dispatch] = useStateValue()
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState('eventlog')
  const [permissions, setPermissions] = React.useState('creator')
  const [overwrite, setOverwrite] = React.useState(false)

  function handleSubmit (event) {
    if (event) event.preventDefault()
    if (name.length === 0) return
    console.log('Create:', name, type, permissions)
    onCreate({ name, type, permissions, overwrite })
    dispatch({ type: actions.DB.CLOSE_CREATEDB_DIALOG })
  }

  function handleNameChange (event) {
    if(!event.target.value.includes(" ")){
      setName(event.target.value)
    }
  }

  function handleTypeChange (event) {
    setType(event.target.value)
  }

  function handlePermissionsChange (event) {
    setPermissions(event.target.value)
  }

  function handleClose(){
    dispatch({ type: actions.DB.CLOSE_CREATEDB_DIALOG });
    setName('');
  }
  
  function handleOverwriteChange(event){
    setOverwrite(event.target.value === 'true')
  }

  return (
    <Dialog
      open={appState.createDBDialogOpen}
    >
      <DialogTitle>Create Database</DialogTitle>
      <DialogContent alignItems="center" justify="center" direction="column">
        <FormControl fullWidth>
          <TextField
            onChange={handleNameChange}
            name='name'
            value={name}
            placeholder='Database name'
            width='100%'
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Type:</InputLabel>
          <Select onChange={handleTypeChange}>
            <MenuItem value='eventlog'>Immutable Log</MenuItem>
            <MenuItem value='feed'>A list of entries</MenuItem>
            <MenuItem value='keyvalue'>Key-Value Store</MenuItem>
            <MenuItem value='docstore'>Document Store</MenuItem>
            <MenuItem value='counter'>Counter (CRDT)</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Write Permissions:</InputLabel>
          <Select onChange={handlePermissionsChange}>
            <MenuItem value='creator'>Creator-only: Only you can write, public read</MenuItem>
            <MenuItem value='public'>Public: Anybody can write and write</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Overwrite:</InputLabel>
          <Select onChange={handleOverwriteChange}>
            <MenuItem value='false'>No</MenuItem>
            <MenuItem value='true'>Yes</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}