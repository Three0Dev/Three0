import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Toolbar, AppBar } from '@mui/material'
import StorageIcon from '@mui/icons-material/Storage'
import Search from '../../../components/templates/Search'
import { useStateValue, actions, loadingState } from '../state'

import { getAllDatabases, removeDatabase, getDB } from '../database'

import { ProgramList } from '../components/DatabaseList'

const LIMIT_NUM = 4
export function Header() {
	const navigate = useNavigate()
	const [databases, setDatabases] = React.useState({ num: 0, entries: [] })
	const [loading, setLoading] = React.useState(false)


	function handleKeyUp(event) {
		if (event.keyCode === 13) {
			if (event.target.value.length > 0) {
				navigate(`./search?q=${event.target.value}`)
			} else {
				navigate('./')
			}
		}
	}
	function getDatabases() {
		window.contract
			.getAllDatabases({
				owner: window.accountId,
				offset: 0,
				limit: LIMIT_NUM,
			})
			.then((res) => setDatabases(res))
			.catch((err) => console.error(err))
	}
	async function searchDatabase(val) {
		setLoading(true)

		try {
			const databaseSearch = await window.contract.getDB({
				contract_address: val,
				account_id: window.accountId,
			})
			setDatabases(databaseSearch)
		} catch (e) {
			setDatabases({ num: 0, entries: [] })
			console.error(e)
		}

		setLoading(false)
	}
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
		const programs = await getAllDatabases(params.pid)
		dispatch({
			type: actions.PROGRAMS.SET_PROGRAMS,
			programs: programs.reverse(),
		})
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
		return programs
	}
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar color="primary" position="static" sx={{ borderRadius: 5 }}>
				<Toolbar>
					<StorageIcon />
					&nbsp;
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
						align="left"
					>
						Database
					</Typography>
					<Search
						placeholder="Search…"
						// onKeyPress={handleKeyUp}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								searchDatabase(e.target.value)
							}
						}}
						onChange={(e) => {
							if (e.target.value === '') {
								getDatabases()
							}
						}}
					/>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
