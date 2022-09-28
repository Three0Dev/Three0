import React from 'react'
import { Typography, CircularProgress, Box } from '@mui/material'
import { useLocation, Navigate, useParams } from 'react-router-dom'
import { useStateValue, actions, loadingState } from '../../state/DatabaseState'
import { getAllDatabases, removeDatabase } from '../../services/database'
import ProgramList from '../../components/db-components/DatabaseList'

function useQuery() {
	return new URLSearchParams(useLocation().search)
}

export default function SearchResultsView() {
	const [appState, dispatch] = useStateValue()

	const query = useQuery().get('q')
	const queryOk = query.length >= 1

	if (!queryOk) return <Navigate to="/" />

	let { programs } = appState
	if (query) {
		programs = programs.filter(
			({
				payload: {
					value: { name, type, address },
				},
			}) =>
				name.includes(query) ||
				type.includes(query) ||
				address.toString().includes(query)
		)
	}

	const params = useParams()

	async function fetchDatabases() {
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
		const program = await getAllDatabases(params.pid)
		dispatch({
			type: actions.PROGRAMS.SET_PROGRAMS,
			programs: program.reverse(),
		})
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
		return program
	}

	const handleRemoveDatabase = (hash, program) => {
		console.log('Remove database...', hash, program)
		removeDatabase(hash).then(() => {
			console.log('Removed')
			fetchDatabases().then((data) => {
				console.log('Loaded programs', data)
			})
		})
	}

	return (
		<Box display="flex" justifyContent="center">
			<Box flex="1" elevation={1} background="white" margin={6} padding={4}>
				<Box borderBottom="default">
					<Typography variant="body1" align="left">
						{programs.length} programs found
					</Typography>
				</Box>
				{programs !== loadingState ? (
					<ProgramList programs={programs} onRemove={handleRemoveDatabase} />
				) : (
					<CircularProgress marginX="auto" marginY={120} />
				)}
			</Box>
		</Box>
	)
}
