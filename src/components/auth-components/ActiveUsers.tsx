/* eslint-disable dot-notation */
/* eslint-disable no-console */
import React from 'react'
import {
	Tooltip,
	Pagination,
	Badge,
	Typography,
	Toolbar,
	Box,
	AppBar,
	IconButton,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ProjectDetailsContext from '../../state/ProjectDetailsContext'
import Backdrop from '../templates/Backdrop'
import Search from '../templates/Search'
import {
	TableHeader,
	TableCell,
	Table,
	TableBody,
	TableContainer,
	TableRow,
} from '../templates/Table'
import nousers from '../../assets/nousers.svg'
import { getContractRelativeDate } from '../../utils'

const classes = {
	root: {
		width: '100%',
		marginBottom: 2,
		overflowX: 'auto',
		justifyContent: 'center',
		display: 'flex',
		borderRadius: '10px',
	},
	Badge: {
		margin: 1,
		borderRadius: '1px',
	},
}

export default function ActiveUsers() {
	const [profiles, setProfiles] = React.useState([])
	const [page, setPage] = React.useState(1)
	const { projectContract } = React.useContext(ProjectDetailsContext)
	const [loading, setLoading] = React.useState(false)
	const [userNumber, setUserNum] = React.useState(0)

	const updatePage = (_e: any, val: number) => setPage((val - 1) * 10)

	function getUsers() {
		if (Object.keys(projectContract).length === 0) return

		setLoading(true)

		projectContract
			.get_users({ offset: page, limit: 10 })
			.then(
				(users: {
					entries: React.SetStateAction<never[]>
					num: React.SetStateAction<number>
				}) => {
					setProfiles(users.entries)
					setUserNum(users.num)
				}
			)
			.catch(console.error)
			.finally(() => setLoading(false))
	}

	function searchUser(val: string) {
		setLoading(true)

		projectContract
			.get_user({ account_id: val })
			.then((user: any) => setProfiles(user))
			.catch((err: any) => {
				console.error(err)
				setProfiles([])
			})
			.finally(() => setLoading(false))
	}

	// Todo change users schema
	React.useEffect(() => {
		getUsers()
	}, [projectContract, page])

	return (
		<>
			<Backdrop loading={loading} />
			<Box sx={{ flexGrow: 1 }}>
				<AppBar color="primary" position="static" sx={{ borderRadius: 5 }}>
					<Toolbar>
						<AccountCircleIcon />
						&nbsp;
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{
								flexGrow: 1,
								display: { xs: 'none', sm: 'block' },
							}}
							align="left"
						>
							Active Users
						</Typography>
						<Tooltip title="Refresh">
							<IconButton
								color="inherit"
								onClick={() => {
									getUsers()
								}}
							>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
						<Search
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									searchUser((e.target as HTMLInputElement).value)
								}
							}}
							onChange={(e) => {
								if (e.target.value === '') {
									getUsers()
								}
							}}
							placeholder="Search…"
						/>
					</Toolbar>
				</AppBar>
			</Box>

			{profiles.length !== 0 && (
				<>
					<TableContainer sx={classes.root}>
						<Table style={{ margin: '2%' }}>
							<TableHeader
								headers={[
									<Typography>Online Status</Typography>,
									<Typography>Public Identifer</Typography>,
									<Typography>Account Created</Typography>,
									<Typography>Last Signed In</Typography>,
								]}
							/>
							<TableBody>
								{profiles.map((profile) => (
									<TableRow key={profile['account_id']}>
										<TableCell style={{ justifyContent: 'center' }}>
											<Badge
												sx={classes.Badge}
												anchorOrigin={{
													vertical: 'top',
													horizontal: 'right',
												}}
												color={profile['is_online'] ? 'success' : 'warning'}
												variant="dot"
											/>
										</TableCell>
										<TableCell>{profile['account_id']}</TableCell>
										<TableCell>
											{`${getContractRelativeDate(profile['created_at'])} ago`}
										</TableCell>
										<TableCell>
											{`${getContractRelativeDate(profile['last_online'])} ago`}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Pagination
						sx={classes.root}
						defaultPage={1}
						count={Math.floor(userNumber / 6) + 1}
						boundaryCount={2}
						onChange={updatePage}
					/>
				</>
			)}
			{profiles.length === 0 && (
				<>
					<img alt="nousers" src={nousers} className="majorImg" />
					<Typography
						variant="h3"
						style={{ textAlign: 'center', fontWeight: 'bold' }}
					>
						No Users Yet!
					</Typography>
				</>
			)}
		</>
	)
}
