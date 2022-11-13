/* eslint-disable no-console */
import React from 'react'
import { Typography, Button, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { UploadSystem } from '../components/hosting-components'
import { addHosting as addNearHosting } from '../services/NEAR'
import nohosting from '../assets/nohosting.svg'
import Backdrop from '../components/templates/Backdrop'

export default function Hosting() {
	const [isHostingEnabled, setIsHostingEnabled] = React.useState(false)
	const [backdrop, setBackdrop] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	React.useEffect(() => {
		if (projectDetails) {
			projectContract
				.get_hosting()
				.then(() => {
					setIsHostingEnabled(true)
				})
				.catch(() => {
					setIsHostingEnabled(false)
				})
		}
	}, [projectDetails])

	async function addHosting() {
		setBackdrop(true)
		try {
			await addNearHosting(projectContract)
			setIsHostingEnabled(true)
		} catch (e) {
			console.error(e)
		}
		setBackdrop(false)
	}

	return isHostingEnabled ? (
		<UploadSystem pid={projectDetails.pid} />
	) : (
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
				<Button onClick={() => addHosting()} variant="contained">
					<AddIcon />
					Add Storage
				</Button>
			</Box>
		</>
	)
}
