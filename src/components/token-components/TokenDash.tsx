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
	Button,
	TextField,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import RefreshIcon from '@mui/icons-material/Refresh'
import SendIcon from '@mui/icons-material/Send'
import { Contract, utils } from 'near-api-js'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
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
import ProjectDetailsContext from '../../state/ProjectDetailsContext'
import nousers from '../../assets/nousers.svg'

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

interface User {
	accountId: string
	registered: boolean
	balance: number
}

interface TokenDashProps {
	tokenAccount: string
	// parentAccount: Account
}

export default function TokenDash({ tokenAccount }: TokenDashProps) {
	const [profiles, setProfiles] = React.useState<User[]>([])
	const [projectAccount, setProjectAccount] = React.useState<User>()
	const [userNumber, setUserNum] = React.useState(0)
	const [balances, setBalances] = React.useState<number[]>([])
	const [page, setPage] = React.useState(1)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)
	const [loading, setLoading] = React.useState(false)

	const MySwal = withReactContent(Swal)

	const updatePage = (_e: any, val: number) => setPage((val - 1) * 10)

	const contract = new Contract(projectContract.account, tokenAccount, {
		// View methods are read only. They don't modify the state, but usually return some value.
		viewMethods: [
			'ft_metadata',
			'ft_balance_of',
			'ft_balance_of_batch',
			'ft_is_registered',
		],
		// Change methods can modify the state. But you don't receive the returned value when called.
		changeMethods: ['storage_deposit', 'ft_transfer', 'ft_transfer_call'],
	})

	function getUsers() {
		setLoading(true)

		projectContract
			.get_users({ offset: page, limit: 10 })
			.then((users: { entries: string[]; num: number }) => {
				const profileList = users.entries.map((user: any) => user.account_id)
				profileList.push(projectContract.account.accountId)
				// profileList.unshift(projectContract.account.accountId)
				setUserNum(users.num + 1)
				const range = Array.from(Array(users.num + 1).keys())
				contract
					.ft_balance_of_batch({ account_ids: profileList })
					.then((balanceList: number[]) => {
						contract
							.ft_is_registered({ account_ids: profileList })
							.then((registered: boolean[]) => {
								contract.ft_metadata().then((metadata: any) => {
									const digits = metadata.decimals
									const userProfiles = range.map((i: number) => ({
										accountId: profileList[i],
										balance: balanceList[i] / 10 ** digits,
										registered: registered[i],
									}))
									setProjectAccount(userProfiles.pop())
									setProfiles(userProfiles)
								})
							})
					})
			})
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
	}, [projectDetails, page])

	return (
		<>
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
							Users
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
			<>
				<Backdrop loading={loading} />
				<TableContainer sx={classes.root}>
					<Table style={{ margin: '2%' }}>
						<TableHeader
							headers={[
								<Typography>Account ID</Typography>,
								<Typography>Is Registered</Typography>,
								<Typography>Balance</Typography>,
								<Typography>Add Balance</Typography>,
							]}
						/>
						<TableBody>
							{projectAccount && (
								<TableRow key={projectAccount.accountId}>
									<TableCell>{projectAccount.accountId}</TableCell>
									<TableCell>
										<Badge
											sx={classes.Badge}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											color="success"
											variant="dot"
										/>
									</TableCell>
									<TableCell>{`${projectAccount.balance}`}</TableCell>
									<TableCell />
								</TableRow>
							)}
							{profiles.map((profile, index) => (
								<TableRow key={profile.accountId}>
									<TableCell>{profile.accountId}</TableCell>
									<TableCell>
										<Badge
											sx={classes.Badge}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											color={profile.registered ? 'success' : 'warning'}
											variant="dot"
										/>
										{!profile.registered && (
											<Button
												onClick={() => {
													setLoading(true)
													contract
														.storage_deposit({
															args: {
																account_id: profile.accountId,
															},
															amount: utils.format.parseNearAmount('0.00125'),
														})
														.then(() => {
															getUsers()
														})
														.catch((e: any) => {
															console.log(e)
														})
														.finally(() => {
															setLoading(false)
														})
												}}
											>
												Register
											</Button>
										)}
									</TableCell>
									<TableCell>{`${profile.balance}`}</TableCell>
									<TableCell>
										<TextField
											defaultValue={0}
											id={`add-balance-${profile.accountId}`}
											type="number"
											InputProps={{ inputProps: { min: 0 } }}
											disabled={!profile.registered}
											style={{ width: 100 }}
										/>
										<Button
											disabled={!profile.registered}
											onClick={() => {
												setLoading(true)
												// deposit
												contract
													.ft_transfer({
														args: {
															receiver_id: profile.accountId,
															amount: (
																document.getElementById(
																	`add-balance-${profile.accountId}`
																) as HTMLInputElement
															).value,
														},
														amount: '1',
													})
													.then(() => {
														setLoading(false)
														getUsers()
														MySwal.fire({
															title: 'Success!',
															text: 'Balance updated',
															icon: 'success',
															confirmButtonText: 'Cool',
														})
													})
													.catch((error: any) => {
														setLoading(false)
														MySwal.fire({
															title: 'Error!',
															text: error.kind.ExecutionError,
															icon: 'error',
															confirmButtonText: 'Cool',
														})
													})
											}}
										>
											<SendIcon />
										</Button>
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
			{/* {profiles.length === 0 && (
				<>
					<img alt="nousers" src={nousers} className="majorImg" />
					<Typography
						variant="h3"
						style={{ textAlign: 'center', fontWeight: 'bold' }}
					>
						No Users Yet!
					</Typography>
				</>
			)} */}
		</>
	)
}
