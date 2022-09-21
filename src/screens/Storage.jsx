import React from 'react'
import FileManager, {
	getList,
	createDirectory,
	deletePaths,
	openFile,
	uploadFiles,
	rename,
} from '../storage-ui'
import {useParams} from 'react-router-dom'
import ProjectDetailsContext from '../ProjectDetailsContext'
import { Button } from '@mui/material'
import { addStorage } from '../services/NEAR';

export default function Storage() {
	const [storage, setStorage] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	console.log(projectDetails.pid)
	projectContract.has_storage().then((storage) => {setStorage(storage)})

	// return (
	// 	<div>
	// 		<Button onClick={() => {
	// 			console.log(projectDetails.pid)
	// 			// console.log(() => {console.log("Hey")})
	// 			// addStorageAccount(projectDetails.pid)
	// 			console.log(projectContract)
	// 			testing(projectContract)
	// 		}}> Add storage </Button>
	// 	</div>
	// )

	
	return (
		storage ? (
		<FileManager
			getList={getList}
			createDirectory={createDirectory}
			deletePaths={deletePaths}
			openFile={openFile}
			uploadFiles={uploadFiles}
			rename={rename}
			features={['createDirectory', 'uploadFiles', 'deletePaths', 'rename']}
		/>
		) : (
			<div>
				<Button onClick={() => {
					console.log(projectDetails.pid)
					addStorage(projectContract).then((success) => {setStorage(success)})
				}}> Add storage </Button>
			</div>
		))
}
