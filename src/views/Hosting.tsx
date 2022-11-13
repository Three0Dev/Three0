import React from 'react'
import { FormControl, Typography, useTheme, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { UploadSystem } from '../components/hosting-components'
import { addHosting } from '../services/NEAR'
import nohosting from '../assets/nohosting.svg'

export default function Hosting() {
	const [isHostingEnabled, setIsHostingEnabled] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)
	const MySwal = withReactContent(Swal)
	const theme = useTheme()
	projectContract.has_hosting().then((hasHosting: boolean) => {
		setIsHostingEnabled(hasHosting)
	})

	async function showHostingSwal() {
		const { value: formValues } = await MySwal.fire({
			title: 'Add Hosting',
			html: (
				<FormControl fullWidth sx={{ margin: '2% 0' }}>
					<Typography>
						Do you have 8 NEAR to add hosting to your project?
					</Typography>
				</FormControl>
			),
			focusConfirm: false,
			confirmButtonColor: theme.palette.secondary.dark,
			confirmButtonText: 'Yes',
		})

		if (formValues) {
			addHosting(projectContract)
				.then((success: boolean) => {
					setIsHostingEnabled(success)
				})
				.catch((error) => {
					if (error.type === 'NotEnoughBalance') {
						MySwal.fire({
							title: 'Error',
							text: 'You do not have enough NEAR to add hosting',
							icon: 'error',
							confirmButtonText: 'Ok',
						})
					}
				})
		}
	}

	return isHostingEnabled ? (
		<UploadSystem pid={projectDetails.pid} />
	) : (
		<>
			<img alt="nohosting" src={nohosting} className="majorImg" />
			<Typography
				variant="h2"
				style={{ textAlign: 'center', fontWeight: 'bold' }}
			>
				No Hosting Contract Deployed
			</Typography>
			<Fab
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
				color="primary"
				aria-label="add-hosting"
				onClick={() => {
					showHostingSwal()
				}}
			>
				<AddIcon />
			</Fab>
		</>
	)
}
