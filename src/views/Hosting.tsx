import React from 'react'
import { Button } from '@mui/material'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { UploadSystem } from '../components/hosting-components'
import { addHosting } from '../services/NEAR'

export default function Hosting() {
	const [isHostingEnabled, setIsHostingEnabled] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	// React.useEffect(() => {
	// 	if (projectDetails) {


	//   console.log("Hello")

	return isHostingEnabled ? (
		<UploadSystem />
	) : (
		<div>
			<Button
				onClick={() => {
					addHosting(projectContract).then(() => {
						setIsHostingEnabled(true)
					})
				}}
			>
				{' '}
				Add hosting{' '}
			</Button>
		</div>
	)
}
