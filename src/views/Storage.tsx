import React from 'react'
import { Button } from '@mui/material'
import FileManager from '../components/storage-components/FileManager'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { addStorage } from '../services/NEAR'

export default function Storage() {
	const [storage, setStorage] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)
	projectContract.has_storage().then((hasStorage: boolean) => {
		setStorage(hasStorage)
	})
	return storage ? (
		<FileManager pid={projectDetails.pid} />
	) : (
		<div>
			<Button
				onClick={() => {
					addStorage(projectContract).then((success) => {
						setStorage(success)
					})
				}}
			>
				{' '}
				Add storage{' '}
			</Button>
		</div>
	)
}
