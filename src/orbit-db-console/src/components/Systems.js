import React from 'react'
import { initIPFS, initOrbitDB, getAllDatabases } from '../database'
import { actions, useStateValue } from '../state'
import { Box, Typography, Stack, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';

export function Systems () {
  const [appState, dispatch] = useStateValue()
  
  const {pid} = useParams()

  React.useEffect(() => {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })

    initIPFS().then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started' })

      initOrbitDB(ipfs).then(async () => {
        dispatch({ type: actions.SYSTEMS.SET_ORBITDB, orbitdbStatus: 'Started' })
        // console.log(projectDetails)
        const programs = await getAllDatabases(pid)
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
      })
    })
  }, [dispatch])

  return (
      <Box display='flex' flexDirection='row' width='100%' padding='1%'>
        <Typography
          display='flex'
          alignItems='center'
          fontWeight='600'
        >
          Status: &nbsp;
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="IPFS" color={appState.ipfsStatus === 'Started' ? 'success' : 'warning'} />
          <Chip label="OrbitDB" color={appState.orbitdbStatus === 'Started' ? 'success' : 'warning'} />
        </Stack>
      </Box>
  )
}