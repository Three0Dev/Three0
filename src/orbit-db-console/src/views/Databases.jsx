import React from 'react'
import { 
  majorScale,
  Button,
  PlusIcon,
  Pane,
  Spinner,
  Overlay,
  toaster,
  Text
} from 'evergreen-ui'

import { useStateValue, actions } from '../state'

import { getAllDatabases, 
  // addDatabase, 
  removeDatabase, createDatabase } from '../database'

import {ProgramList} from '../components/DatabaseList'
import {CreateDialog} from '../components/CreateDialog'
// import {AddDialog} from '../components/AddDialog'

import { useParams } from 'react-router-dom'

export function DatabasesView () {
  const [appState, dispatch] = useStateValue()
  const [loading, setLoading] = React.useState(false)

  const params = useParams()

  async function fetchDatabases () {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    const programs = await getAllDatabases(params.pid)
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
    return programs
  }

  const handleCreateDatabase = () => {
    dispatch({ type: actions.DB.OPEN_CREATEDB_DIALOG })
  }

  const createDB = (args) => {
    console.log("Create database...", args)
    setLoading(true)
    createDatabase(args.name, args.type, args.permissions, params.pid, args.overwrite).then((hash) => {
      console.log("Created", hash)
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    }).catch((err) => {
      console.error("Error", err)
      toaster.danger(err.toString())
    }).finally(() => setLoading(false))
  }

  // const handleAddDatabase = (args) => {
  //   dispatch({ type: actions.DB.OPEN_ADDDB_DIALOG })
  // }

  // const addDB = (args) => {
  //   console.log("Add database...", args)
  //   addDatabase(args.address).then((hash) => {
  //     console.log("Added", args.address)
  //     fetchDatabases().then((data) => {
  //       console.log("Loaded programs", data)
  //     })
  //   })
  // }

  const handleRemoveDatabase = (hash, program) => {
    console.log("Remove database...", hash, program)
    setLoading(true)
    removeDatabase(hash, program, params.pid).then(() => {
      console.log("Removed")
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    }).finally(() => setLoading(false))
  }

  return (
    <>
    <Pane marginX={majorScale(6)}>
    </Pane>
    <Pane 
      display='flex' 
      flexDirection='row'
      marginX={majorScale(6)}
      marginTop={majorScale(2)}
      marginBottom={majorScale(1)}
    >
      <Button
        iconBefore='document'
        appearance='default'
        height={24}
        isLoading={loading}
        onClick={handleCreateDatabase}
      >
        <div style={{marginRight: "8%"}}><PlusIcon /></div>
        Create
      </Button>
      {/* <Button
        iconBefore='plus'
        appearance='default'
        height={24}
        marginLeft={minorScale(1)}
        onClick={handleAddDatabase}
      >
        Open
      </Button> */}
    </Pane>
    <Pane display='flex' justifyContent='center' overflow='auto'>
      <CreateDialog onCreate={createDB}/>
      {/* <AddDialog onAdd={addDB}/> */}
      <Pane
        flex='1'
        overflow='auto'
        elevation={1}
        background='white'
        marginX={majorScale(6)}
      >
        {!appState.loading.programs 
          ? (<ProgramList
              programs={appState.programs}
              onRemove={handleRemoveDatabase}
            />)
          : (<Pane
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              marginTop={majorScale(3)}
              marginBottom={majorScale(1)}
            >
              <Spinner size={24}/>
              <Text marginY={majorScale(1)}>Loading...</Text>
            </Pane>)
        }

      </Pane>
    </Pane>
    <Overlay isShown={loading}>
      <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
        <Spinner />
      </Pane>
    </Overlay>
    </>
  )
}