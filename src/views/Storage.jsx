import React from 'react'
import FileManager, {
	getList,
	createDirectory,
	deletePaths,
	openFile,
	uploadFiles,
	rename,
} from '../storage-ui'

export default function Storage() {
	return (
		<FileManager
			getList={getList}
			createDirectory={createDirectory}
			deletePaths={deletePaths}
			openFile={openFile}
			uploadFiles={uploadFiles}
			rename={rename}
			features={['createDirectory', 'uploadFiles', 'deletePaths', 'rename']}
		/>
	)
}