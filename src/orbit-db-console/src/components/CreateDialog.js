import React from 'react'
import {
  Dialog,
  FormField,
  Select,
  TextInput
} from 'evergreen-ui'

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
      isShown={appState.createDBDialogOpen}
      title='Create Database'
      onCloseComplete={handleClose}
      cancelLabel='Cancel'
      confirmLabel='Create'
      onConfirm={close => handleSubmit(null, close)}
    >
      <form onSubmit={handleSubmit}>
        <FormField label='Database Name:'>
          <TextInput
            onChange={handleNameChange}
            name='name'
            value={name}
            placeholder='Database name'
            width='100%'
          />
        </FormField>
        <FormField label='Type:'>
          <Select onChange={handleTypeChange}>
            <option value='eventlog' defaultValue>Immutable Log</option>
            <option value='feed'>A list of entries</option>
            <option value='keyvalue'>Key-Value Store</option>
            <option value='docstore'>Document Store</option>
            <option value='counter'>Counter (CRDT)</option>
          </Select>
        </FormField>
        <FormField label='Write Permissions'>
          <Select onChange={handlePermissionsChange}>
            <option value='creator'>Creator-only: Only you can write, public read</option>
            <option value='public'>Public: Anybody can write and write</option>
          </Select>
        </FormField>
        <FormField label='Overwrite'>
          <Select onChange={handleOverwriteChange}>
            <option value='false'>No</option>
            <option value='true'>Yes</option>
          </Select>
        </FormField>
      </form>
    </Dialog>
  )
}