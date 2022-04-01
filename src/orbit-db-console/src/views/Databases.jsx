import React from 'react'
import { 
  // majorScale,
  // Button,
  // PlusIcon,
  // Pane,
  // Spinner,
  // Overlay,
  // toaster,
  // Text
} from 'evergreen-ui'
import Swal from 'sweetalert'
import withReactContent from 'sweetalert2-react-content';


import {Typography, Container, Progress, Box, Snackbar, IconButton, CloseIcon, Button, Backdrop} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import AddIcon from '@mui/icons-material/Add';

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
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  }
  const handleToggle = () => {
    setOpen(!open);
  }

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
      Swal("Database  Created!", "You can now access the database", {
        button: "OK!",
        });
    }).catch((err) => {
      console.error("Error", err)
      Swal("Oops...", "Something went wrong!", "error");
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
      Swal("Database  Deleted!",{
        button: "OK!",
        });
    }).catch((err) => {
      console.error("Error", err)
      Swal("Oops...", "Something went wrong!", "error");
    }).finally(() => setLoading(false))
  }

  return (
  <>
    {/* <Pane marginX={6}></Pane> */}
    <Box 
      display='flex' 
      flexDirection='row'
      marginX={6}
      marginTop={2}
      marginBottom={1}
    >
      <Button
        variant="outlined" startIcon={<AddIcon fontSize='small'/>}
        iconBefore='document'
        appearance='default'
        height={24}
        isLoading={loading}
        onClick={handleCreateDatabase}
      >
        {/* <div style={{marginRight: "8%"}}></div> */}
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
    </Box>
    <Box display='flex' justifyContent='center' overflow='auto'>
      <CreateDialog onCreate={createDB}/>
      {/* <AddDialog onAdd={addDB}/> */}
      <Box
        flex='1'
        overflow='auto'
        elevation={1}
        background='white'
        marginX={6}
      >
        {!appState.loading.programs 
          ? (<ProgramList
              programs={appState.programs}
              onRemove={handleRemoveDatabase}
            />)
          : (<Box
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              marginTop={3}
              marginBottom={1}
            >
              <CircularProgress size={24}/>
              {/* <Text marginY={1}>Loading...</Text> */}
              <Typography variant='body1' color='textSecondary'>Loading...</Typography>
            </Box>)
        }

      </Box>
    </Box>
    <Backdrop open={loading}>
      <Box display="flex" alignItems="center" justifyContent="center" height={400}>
        <CircularProgress color='inherit'/>
        
      </Box>
    </Backdrop>
  </>
  )
}