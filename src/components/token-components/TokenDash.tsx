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
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { Account, Contract, utils } from 'near-api-js'
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
	profile: string
	registered: boolean
	balance: number
}

interface TokenDashProps {
	tokenAccount: string
	// parentAccount: Account
}

export default function TokenDash({ tokenAccount }: TokenDashProps) {
	const [profiles, setProfiles] = React.useState<User[]>([])
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
				const profile_list = users.entries.map((user: any) => user.account_id)
				setUserNum(users.num)
				const range = Array.from(Array(users.num).keys())
				contract
					.ft_balance_of_batch({ account_ids: profile_list })
					.then((balances: number[]) => {
						setBalances(balances)
						contract
							.ft_is_registered({ account_ids: profile_list })
							.then((registered: boolean[]) => {
								setProfiles(
									range.map((i: number) => ({
										profile: profile_list[i],
										balance: balances[i],
										registered: registered[i],
									}))
								)
								console.log(profiles)
							})
					})

				setProfiles(profile_list)
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
	// console.log("Hey")
	// console.log(contract.ft_balance_of({ account_id: 'vlasp.testnet' }))

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
			{profiles.length !== 0 && (
				<>
					<Backdrop loading={loading} />
					<TableContainer sx={classes.root}>
						<Table style={{ margin: '2%' }}>
							<TableHeader
								headers={[
									<Typography>Public Identifer</Typography>,
									<Typography>Is Registered</Typography>,
									<Typography>Account Balance</Typography>,
								]}
							/>
							<TableBody>
								{profiles.map((profile, index) => (
									<TableRow key={profile.profile}>
										<TableCell>{profile.profile}</TableCell>
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
														contract.storage_deposit({
															args: {
																account_id: profile.profile,
															},
															amount: utils.format.parseNearAmount('0.00125'),
														})
													}}
												>
													Register
												</Button>
											)}
										</TableCell>
										<TableCell>
											<TextField
												defaultValue={profile.balance}
												type="number"
												InputProps={{ inputProps: { min: 0 } }}
												disabled={!profile.registered}
												onChange={(e) => {
													const newBalances = [...balances]
													newBalances[index] = parseInt(e.target.value, 10)
													setBalances(newBalances)
												}}
											/>
											<Button
												disabled={!profile.registered}
												onClick={() => {
													// determine if withdraw or deposit
													if (profile.balance - balances[index] > 0) {
														// withdraw
														// TODO: add withdraw function
													} else if (profile.balance - balances[index] < 0) {
														setLoading(true)
														// deposit
														contract
															.ft_transfer({
																args: {
																	receiver_id: profile.profile,
																	amount: `${
																		balances[index] - profile.balance
																	}`,
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
													} else {
														alert('No change in balance')
													}
												}}
											>
												<SyncAltIcon />
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
