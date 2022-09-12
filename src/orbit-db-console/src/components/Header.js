import React from 'react'
// import { useNavigate } from 'react-router-dom'
import { Box, Typography, Toolbar, AppBar } from '@mui/material'
import StorageIcon from '@mui/icons-material/Storage'
import Search from '../../../components/templates/Search'
import { ProgramList } from '../components/DatabaseList'
import { ProjectDetailsContext } from '../../../ProjectDetailsContext'

// import { getDB } from '../database'

// import { useStateValue, actions, loadingState } from '../state'

import { getAllDatabases, removeDatabase, getDB } from '../database'

// import { useLocation, Navigate, useParams } from 'react-router-dom'
import { SearchResultsView } from '../views/SearchResults'

// function useQuery() {
// 	return new URLSearchParams(useLocation().search)
// }
const LIMIT_NUM = 4
export function Header() {
	// const navigate = useNavigate()
	const [databases, setDatabases] = React.useState({ num: 0, entries: [] })
	const [loading, setLoading] = React.useState(false)

	const [page, setPage] = React.useState(1)
	const { databaseDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	const updatePage = (_e, val) => setPage((val - 1) * 10)

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
		projectContract
			.getAllDatabases({ offset: page, limit: 10 })
			.then((dEntries) => setDatabases(dEntries))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false))
	}
	async function searchDatabase(val) {
		setLoading(true)

		projectContract
			.getDB({ account_id: val })
			.then((dEntries) => setDatabases([databaseSearch]))
			.catch((err) => {
				console.error(err)
			})
			.finally(() => setLoading(false))
	}

	React.useEffect(() => {
		getDatabases()
	}, [databaseDetails, page])
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
							placeholder="Search…"
						/>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
