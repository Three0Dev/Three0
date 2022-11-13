/* eslint-disable no-console */
import React from 'react'
import { Typography, Button, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { addStorage as addNearStorage } from '../services/NEAR'
import nostorage from '../assets/nostorage.svg'
import Backdrop from '../components/templates/Backdrop'
import FileManager from '../components/storage-components/FileManager'

export default function Storage() {
	const [isStorageEnabled, setIsStorageEnabled] = React.useState(false)
	const [backdrop, setBackdrop] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	React.useEffect(() => {
		if (projectDetails) {
			setIsStorageEnabled(projectDetails.has_storage)
		}
	}, [projectDetails])

	async function addStorage() {
		setBackdrop(true)
		try {
			await addNearStorage(projectContract)
			setIsStorageEnabled(true)
		} catch (e) {
			console.error(e)
		}
		setBackdrop(false)
	}

	return isStorageEnabled ? (
		<FileManager pid={projectDetails.pid} />
	) : (
		<>
			<Backdrop loading={backdrop} />
			<img alt="nostorage" src={nostorage} className="majorImg" />
			<Typography
				variant="h3"
				style={{ textAlign: 'center', fontWeight: 'bold' }}
			>
				Storage not Enabled
			</Typography>

			<Box sx={{ marginTop: '20px', textAlign: 'center' }}>
				<Button>Get Documentation</Button>
				<Button
					onClick={() => addStorage()}
					variant="contained"
					sx={{ ml: '1%' }}
				>
					<AddIcon />
					Add Storage
				</Button>
			</Box>
		</>
	)
}
