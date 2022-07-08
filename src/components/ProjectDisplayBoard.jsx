import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Pagination,
	Typography,
	Toolbar,
	Box,
	AppBar,
	Card,
	CardContent,
	CardMedia,
} from '@mui/material'
import Search from './templates/Search'
import Backdrop from './templates/Backdrop'
import NearIcon from '../assets/near_icon_nm.svg'
import { getContractRelativeDate } from '../utils'

const LIMIT_NUM = 4

const classes = {
	root: {
		width: '100%',
		marginTop: 2,
		marginBottom: 2,
		overflowX: 'auto',
		justifyContent: 'center',
		display: 'flex',
	},
	logos: { width: '80px !important', margin: '2%' },
	container: {
		width: '75%',
		margin: '2% auto',
		zIndex: 2,
		position: 'relative',
	},
	background: {
		position: 'fixed',
		bottom: 0,
		zIndex: 1,
	},
}

const logos = {
	NEAR_TESTNET: NearIcon,
}

export default function ProjectDisplayBoard() {
	const navigate = useNavigate()
	const [projects, setProjects] = React.useState({ num: 0, entries: [] })
	const [loading, setLoading] = React.useState(false)

	const [off, setPage] = React.useState(0)
	const updatePage = (e, val) => setPage((val - 1) * LIMIT_NUM)

	function getProjects() {
		window.contract
			.get_all_projects({
				owner: window.accountId,
				offset: 0,
				limit: LIMIT_NUM,
			})
			.then((res) => setProjects(res))
			.catch((err) => console.error(err))
	}

	async function searchProject(val) {
		setLoading(true)

		try {
			const projectsSearch = await window.contract.get_project({
				contract_address: val,
				account_id: window.accountId,
			})
			setProjects(projectsSearch)
		} catch (e) {
			setProjects({ num: 0, entries: [] })
			console.error(e)
		}

		setLoading(false)
	}

	React.useEffect(() => {
		getProjects()
	}, [off])

	return (
		<>
			<Backdrop loading={loading} />
			<Box sx={classes.container}>
				<Box sx={{ flexGrow: 1 }}>
					<AppBar color="primary" position="static" sx={{ borderRadius: 5 }}>
						<Toolbar>
							<Typography
								variant="h6"
								noWrap
								component="div"
								sx={{
									flexGrow: 1,
									display: { xs: 'none', sm: 'block' },
								}}
							>
								Projects
							</Typography>
							<Search
								placeholder="Search…"
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										searchProject(e.target.value)
									}
								}}
								onChange={(e) => {
									if (e.target.value === '') {
										getProjects()
									}
								}}
							/>
						</Toolbar>
					</AppBar>
				</Box>

				{projects.entries.map((project) => (
					<Card
						key={project.contract_address}
						sx={{ display: 'flex', margin: '2% auto' }}
						onClick={() => navigate(`/${project.contract_address}/`)}
					>
						<CardMedia
							component="img"
							sx={classes.logos}
							image={logos[project.chain_type]}
							alt={project.chain_type}
						/>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<CardContent sx={{ flex: '1 0 auto' }}>
								<Typography component="div" variant="h5">
									{project.contract_address}
								</Typography>
								<Typography
									variant="subtitle1"
									color="text.secondary"
									component="div"
								>
									{`${getContractRelativeDate(project.created_at)} ago`}
								</Typography>
							</CardContent>
						</Box>
					</Card>
				))}

				<Pagination
					sx={classes.root}
					defaultPage={1}
					count={Math.floor(projects.num / LIMIT_NUM) + 1}
					boundaryCount={2}
					onChange={updatePage}
				>
					{' '}
				</Pagination>
			</Box>
		</>
	)
}
