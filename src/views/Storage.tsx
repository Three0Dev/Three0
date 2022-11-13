import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Fab, Typography, FormControl, useTheme } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FileManager from '../components/storage-components/FileManager'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { addStorage } from '../services/NEAR'
import nostorage from '../assets/nostorage.svg'

export default function Storage() {
	const [storage, setStorage] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)
	const MySwal = withReactContent(Swal)
	const theme = useTheme()
	projectContract.get_storage().then((hasStorage: boolean) => {
		setStorage(hasStorage)
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
				.then((success) => {
					setStorage(success)
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

	return storage ? (
		<FileManager pid={projectDetails.pid} />
	) : (
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
	)
}
