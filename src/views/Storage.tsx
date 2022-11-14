import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Fab, Typography, FormControl, useTheme } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FileManager from '../components/storage-components/FileManager'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { addStorage } from '../services/NEAR'
import nostorage from '../assets/nostorage.svg'
import Backdrop from '../components/templates/Backdrop'

export default function Storage() {
	const [loading, setLoading] = React.useState(true)
	const [storageAccount, setStorageAccount] = React.useState('')
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)
	const MySwal = withReactContent(Swal)
	const theme = useTheme()
	projectContract.has_storage().then((hasStorage: boolean) => {
		if (hasStorage) {
			projectContract.get_storage().then((account: string) => {
				setStorageAccount(account)
				setLoading(false)
			})
		}
		setLoading(false)
	})

	async function showStorageSwal() {
		const { value: formValues } = await MySwal.fire({
			title: 'Add Storage',
			html: (
				<FormControl fullWidth sx={{ margin: '2% 0' }}>
					<Typography>
						Do you have 16 NEAR to add storage to your project?
					</Typography>
				</FormControl>
			),
			focusConfirm: false,
			confirmButtonColor: theme.palette.secondary.dark,
			confirmButtonText: 'Yes',
		})

		if (formValues) {
			addStorage(projectContract)
				.then(() => {
					setStorageAccount(`storage.${projectDetails.pid}`)
				})
				.catch((error) => {
					if (error.type === 'NotEnoughBalance') {
						MySwal.fire({
							title: 'Error',
							text: 'You do not have enough NEAR to add storage',
							icon: 'error',
							confirmButtonText: 'Ok',
						})
					}
				})
		}
	}

	return loading ? (
		<Backdrop loading={loading} />
	) : (
		<>
			{storageAccount !== '' && <FileManager storageAccount={storageAccount} />}
			{storageAccount === '' && (
				<>
					<img alt="nostorage" src={nostorage} className="majorImg" />
					<Typography
						variant="h2"
						style={{ textAlign: 'center', fontWeight: 'bold' }}
					>
						No Storage Contract Deployed
					</Typography>
					<Fab
						sx={{
							position: 'fixed',
							bottom: 16,
							right: 16,
						}}
						color="primary"
						aria-label="add-storage"
						onClick={() => {
							showStorageSwal()
						}}
					>
						<AddIcon />
					</Fab>
				</>
			)}
		</>
	)
}
