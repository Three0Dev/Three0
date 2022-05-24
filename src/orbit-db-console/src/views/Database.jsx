import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {Typography, CircularProgress, Paper, Box, IconButton } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import {TableHeader, Table, TableContainer, TableBody, TableCell, TableRow} from '../../../components/templates/Table'

import {LogStoreControls} from '../components/LogStoreControls'
import {FeedStoreControls} from '../components/FeedStoreControls'
import {KeyValueStoreControls} from '../components/KeyValueStoreControls'
import {DocumentStoreControls} from '../components/DocumentStoreControls'
import {CounterStoreControls} from '../components/CounterStoreControls'
import Divider from '@mui/material/Divider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getDB } from '../database'
import { useStateValue, actions } from '../state'

const colors = {
   eventlog: '#47B881',
   feed: '#14B5D0',
   keyvalue: '#1070CA',
   docstore: '#D9822B',
   counter: '#735DD0',
}

export function ProgramView () {
  const { programName, dbName } = useParams()
  const [appState, dispatch] = useStateValue()
  const navigate = useNavigate()
  const [index, setIndex] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [address] = React.useState(`/orbitdb/${programName}/${dbName}`)

  const handleSelect = (idx) => {
    setIndex(idx !== index ? idx : null)
  }

  const handleBack = () => {
    if (appState.db) {
      appState.db.close().then(() => {
        dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program: null })
        dispatch({ type: actions.DB.SET_DB, db: null, entries: [] })
        navigate(-1)
      })
    }
  }

  const fetchDB = async (address) => {
    setLoading(true)
    const db = await getDB(address)

    if (db) {
      let entries
      if (db.type === 'eventlog' || db.type === 'feed')
        entries = await db.iterator({ limit: 10 }).collect().reverse()
      else if (db.type === 'counter')
        entries = [{ payload: { value: db.value } }]
      else if (db.type === 'keyvalue')
        entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
      else if (db.type === 'docstore')
        entries = db.query(e => e !== null, {fullOp: true}).reverse()
      else
        entries = [{ payload: { value: "TODO" } }]

      dispatch({ type: actions.DB.SET_DB, db, entries })
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDB(address)
    const program = appState.programs.find(p => p.payload.value.address === address)
    dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program })
  }, [dispatch, address, appState.programs]) // eslint-disable-line

  function getValuesTitle() {
    const db = appState.program ? appState.program.payload.value : null
    if (!db) return

    if (db.type === 'eventlog')
      return "Latest 10 events"
    else if (db.type === 'feed')
      return "Latest 10 entries"
    else if (db.type === 'docstore')
      return "All Documents"
    else if (db.type === 'keyvalue')
      return "Keys and Values"
    else if (db.type === 'counter')
      return "Count"
    else
      return <Typography variant="body2" color="textSecondary">No input controls found for '{db.type}'</Typography>
  }

  function renderProgram () {
    const program = appState.program ? appState.program.payload.value : null
    return (
        <>
          <Box component={Paper}>
           <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHeader headers={["Name", "Type", "Permissions", "Entries"]} />
              <TableBody>
                <TableRow>
                  <TableCell>
                  <Typography>{program ? program.name : '-'}</Typography>
                  </TableCell>
                  <TableCell>
                  {program
                    ? <Typography variant="h8" color={colors[program.type]}>{program.type}</Typography>
                    : <Typography variant="h8" color="textSecondary">-</Typography>
                  }
                  </TableCell>
                  <TableCell>
                  {appState.db
                    ? <Typography variant="h8" color="textSecondary">{appState.db.access.write}</Typography>
                    : <Typography variant="h8" color="textSecondary">-</Typography>
                  }
                  </TableCell>
                  <TableCell>
                  {appState.db
                    ? <Typography variant="h8" color="textSecondary">{appState.db._oplog?.length}</Typography>
                    : <Typography variant="h8" color="textSecondary">-</Typography>
                  }
                  </TableCell>
                 </TableRow> 
              </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box flex='1' marginY={2}>
              <Typography sx={{ fontWeight: 'bold' }} variant="h7" color="textPrimary">{getValuesTitle()}</Typography>
            {loading
              ? <CircularProgress
                  size={2}
                  delay={100}
                  marginy={2}
                />
              : appState.entries.map((e, idx) => {
                  idx += 1
                  return (
                    <div key={idx} style={{wordBreak: "break-word"}}>
                      <Box>
                        <Typography userSelect='none' cursor='pointer' onClick={() => handleSelect(idx)}>{JSON.stringify(e.payload.value, null, 2)}</Typography>
                      </Box>
                      <Box>
                        {index && idx === index
                          ? 
                          <Typography variant="body" color="textSecondary">{JSON.stringify(e, null, 2)}</Typography>
                          : ''}
                      </Box>
                    </div>
                  )
                })
            }
          </Box>
        </>
    )
  }

  function renderDatabaseControls() {
    const db = appState.db
    if (!db) return

    if (db.type === 'eventlog')
      return <LogStoreControls />
    else if (db.type === 'feed')
      return <FeedStoreControls />
    else if (db.type === 'docstore')
      return <DocumentStoreControls />
    else if (db.type === 'keyvalue')
      return <KeyValueStoreControls />
    else if (db.type === 'counter')
      return <CounterStoreControls />
    else
      // return <Text intent='danger'>No input controls found for '{db.type}'</Text>
      return <Typography variant="body2" color="textSecondary">No input controls found for '{db.type}'</Typography>
  }

  return (
  <Box component={Paper}>
    <Box
      display='flex'
      flexDirection='row'
      alignItems='baseline'
    >
      <IconButton onClick={handleBack}>  
        <KeyboardBackspaceIcon/>
      </IconButton>
    </Box>
    <Box display='flex'>
      <Box
        flex='1'
        overflow='auto'
        elevation={1}
        padding={4}
        marginX={2}
        paddingTop={0}
      >
        <Box borderBottom='default' style={{display: "flex"}}>
            <Typography sx={{ fontWeight: 'bold' }} style={{margin: "revert"}} size={500} borderBottom='default' overflow='auto'>
              /orbitdb/{programName}/{dbName}
            </Typography>
            <IconButton onClick={() => navigator.clipboard.writeText(`/orbitdb/${programName}/${dbName}`)}>
              <ContentCopyIcon/>
            </IconButton>
        </Box>
          {renderProgram()}
          <Divider variant='middle' />
          {appState.program ? (renderDatabaseControls()) : ''}
      </Box>
    </Box>
  </Box>
  )
}