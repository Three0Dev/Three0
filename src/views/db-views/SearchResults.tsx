/* eslint-disable no-console */
import React from 'react'
import { Typography, CircularProgress, Box } from '@mui/material'
import { useLocation, Navigate, useParams } from 'react-router-dom'
import ProgramList from '../../components/db-components/DatabaseList'
import { getAllDatabases, removeDatabase } from '../../services/database'
import { useStateValue, actions, loadingState } from '../../state/DatabaseState'

function useQuery() {
	return new URLSearchParams(useLocation().search)
}

export default function SearchResultsView() {
	const [appState, dispatch] = useStateValue()

	const query = useQuery().get('q')
	const queryOk = (query?.length as number) >= 1

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

	const handleRemoveDatabase = (contract: any, hash: any, program: any) => {
		console.log('Remove database...', hash, program)
		removeDatabase(contract, hash, program).then(() => {
			console.log('Removed')
			fetchDatabases().then((data) => {
				console.log('Loaded programs', data)
			})
		})
	}

	return (
		<Box display="flex" justifyContent="center">
			<Box>
				<Box borderBottom="default">
					<Typography variant="body1" align="left">
						{programs.length} programs found
					</Typography>
				</Box>
				{programs !== loadingState ? (
					<ProgramList programs={programs} onRemove={handleRemoveDatabase} />
				) : (
					<CircularProgress />
				)}
			</Box>
		</Box>
	)
}
