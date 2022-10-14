import React from 'react'
import FileManager, {
	getList,
	createDirectory,
	deletePaths,
	openFile,
	uploadFiles,
	rename,
} from '../components/storage-components'
import {useParams} from 'react-router-dom'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { Button } from '@mui/material'
import { addStorage } from '../services/NEAR';

export default function Storage() {
  const [storage, setStorage] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	// console.log(projectDetails.pid)
	projectContract.has_storage().then((storage: boolean) => {setStorage(storage)})
  return (
    storage ? (
      <FileManager
        getList={getList}
        deletePaths={deletePaths}
        openFile={openFile}
        uploadFiles={uploadFiles}
        rename={rename}
        features={['uploadFiles', 'deletePaths', 'rename']}
      />
      ) : (
      <div>
        <Button onClick={() => {
          console.log(projectDetails.pid)
          addStorage(projectContract).then((success) => {setStorage(success)})
        }}> Add storage </Button>
      </div>
    )
  );
}
