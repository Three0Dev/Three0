/* eslint-disable no-console */
import React from 'react'
import { Typography, Button, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FileManager from '../components/storage-components/FileManager'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { addStorage as addNearStorage } from '../services/NEAR'
import nostorage from '../assets/nostorage.svg'
import Backdrop from '../components/templates/Backdrop'

export default function Storage() {
	const [loading, setLoading] = React.useState(true)
	const [storageAccount, setStorageAccount] = React.useState('')
	const [backdrop, setBackdrop] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)
	const MySwal = withReactContent(Swal)

	React.useEffect(() => {
		if (Object.keys(projectContract).length !== 0) {
			projectContract
				.get_storage()
				.then((account: string) => {
					setStorageAccount(account)
					setLoading(false)
				})
				.catch(() => {
					setStorageAccount('')
					setLoading(false)
				})
		}
	}, [projectContract])

	async function addStorage() {
		setBackdrop(true)
		try {
			await addNearStorage(projectContract)
			setStorageAccount(`storage.${projectDetails.pid}`)
		} catch (error: any) {
			if (error.type === 'NotEnoughBalance') {
				MySwal.fire({
					title: 'Not enough balance',
					text: `Your project account ${error.signer_id} needs an additional ${(
						(error.cost - error.balance) *
						0.000000000000000000000001
					).toPrecision(3)} NEAR to cover the storage subaccount creation`,
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
			{storageAccount !== '' && <FileManager storageAccount={storageAccount} />}
			{storageAccount === '' && (
				<>
					<Backdrop loading={backdrop} />
					<img alt="nostorage" src={nostorage} className="majorImg" />
					<Typography
						variant="h3"
						style={{ textAlign: 'center', fontWeight: 'bold' }}
					>
						No Storage Contract Deployed
					</Typography>

					<Box sx={{ marginTop: '20px', textAlign: 'center' }}>
						<Button>Get Documentation</Button>
						&nbsp;&nbsp;&nbsp;
						<Button onClick={() => addStorage()} variant="contained">
							<AddIcon />
							Add Storage
						</Button>
					</Box>
				</>
			)}
		</>
	)
}
