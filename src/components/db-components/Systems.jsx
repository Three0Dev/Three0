import React from 'react'
import { Box, Typography, Stack, Chip } from '@mui/material'
import { useParams } from 'react-router-dom'
import { initIPFS, initOrbitDB, getAllDatabases } from '../../services/database'
import { actions, useStateValue } from '../../state'

export function Systems() {
	const [appState, dispatch] = useStateValue()

	const { pid } = useParams()

	React.useEffect(() => {
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })

		initIPFS().then((ipfs) => {
			dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started' })

			initOrbitDB(ipfs).then(() => {
				dispatch({
					type: actions.SYSTEMS.SET_ORBITDB,
					orbitdbStatus: 'Started',
				})
				getAllDatabases(pid).then((programs) => {
					dispatch({
						type: actions.PROGRAMS.SET_PROGRAMS,
						programs: programs.reverse(),
					})
					dispatch({
						type: actions.PROGRAMS.SET_PROGRAMS_LOADING,
						loading: false,
					})
				})
			})
		})
	}, [dispatch])

	return (
		<Box display="flex" flexDirection="row" width="100%" padding="1%">
			<Typography display="flex" alignItems="center" fontWeight="600">
				Status: &nbsp;
			</Typography>
			<Stack direction="row" spacing={1}>
				<Chip
					label="IPFS"
					color={appState.ipfsStatus === 'Started' ? 'success' : 'warning'}
				/>
				<Chip
					label="OrbitDB"
					color={appState.orbitdbStatus === 'Started' ? 'success' : 'warning'}
				/>
			</Stack>
		</Box>
	)
}
