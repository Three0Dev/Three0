/* eslint-disable no-console */
import React from 'react'
import { Typography, Button, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { UploadSystem } from '../components/hosting-components'
import { addHosting as addNearHosting } from '../services/NEAR'
import nohosting from '../assets/nohosting.svg'
import Backdrop from '../components/templates/Backdrop'

export default function Hosting() {
	const [loading, setLoading] = React.useState(true)
	const [hostingAccount, setHostingAccount] = React.useState('')
	const [backdrop, setBackdrop] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	const MySwal = withReactContent(Swal)

	React.useEffect(() => {
		if (Object.keys(projectContract).length !== 0) {
			projectContract
				.get_hosting()
				.then((account: string) => {
					setHostingAccount(account)
					setLoading(false)
				})
				.catch(() => {
					setHostingAccount('')
					setLoading(false)
				})
		}
	}, [projectContract])

	async function addHosting() {
		setBackdrop(true)
		try {
			await addNearHosting(projectContract)
			setHostingAccount(`hosting.${projectDetails.pid}`)
		} catch (error: any) {
			if (error.type === 'NotEnoughBalance') {
				MySwal.fire({
					title: 'Not enough balance',
					text: `Your project account ${error.signer_id} needs an additional ${(
						(error.cost - error.balance) *
						0.000000000000000000000001
					).toPrecision(3)} NEAR to cover the hosting subaccount creation`,
					icon: 'error',
					confirmButtonText: 'Ok',
				})
			} else if (error.type === 'LackBalanceForState') {
				MySwal.fire({
					title: 'Not enough balance',
					text: `Your project account ${
						error.kind.signer_id
					} needs an additional ${(
						error.amount * 0.000000000000000000000001
					).toPrecision(3)} NEAR to cover the storage for contract deployment`,
					icon: 'error',
					confirmButtonText: 'Ok',
				})
			}
		}
		setBackdrop(false)
	}

	return loading ? (
		<Backdrop loading={loading} />
	) : (
		<>
			{hostingAccount !== '' && (
				<UploadSystem
					hostingAccount={hostingAccount}
					pid={projectDetails.pid}
				/>
			)}
			{hostingAccount === '' && (
				<>
					<Backdrop loading={backdrop} />
					<img alt="nohosting" src={nohosting} className="majorImg" />
					<Typography
						variant="h3"
						style={{ textAlign: 'center', fontWeight: 'bold' }}
					>
						No Hosting Contract Deployed
					</Typography>

					<Box sx={{ marginTop: '20px', textAlign: 'center' }}>
						<Button>Get Documentation</Button>
						&nbsp;&nbsp;&nbsp;
						<Button onClick={() => addHosting()} variant="contained">
							<AddIcon />
							Add Hosting
						</Button>
					</Box>
				</>
			)}
		</>
	)
}
