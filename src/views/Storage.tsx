// import React from 'react'
// import FileManager, {
// 	getList,
// 	createDirectory,
// 	deletePaths,
// 	openFile,
// 	uploadFiles,
// 	rename,
// } from '../components/storage-ui'

// export default function Storage() {
// 	return (
// 		<FileManager
// 			getList={getList}
// 			createDirectory={createDirectory}
// 			deletePaths={deletePaths}
// 			openFile={openFile}
// 			uploadFiles={uploadFiles}
// 			rename={rename}
// 			features={['createDirectory', 'uploadFiles', 'deletePaths', 'rename']}
// 		/>
// 	)
// }

import React from 'react'
import { Typography } from '@mui/material'
import WIPPhoto from '../assets/wip.svg'

export default function Storage() {
	return (
		<>
			<img src={WIPPhoto} alt="WIP" className="majorImg" />
			<Typography
				variant="h2"
				style={{ textAlign: 'center', fontWeight: 'bold' }}
			>
				Coming Soon!
			</Typography>
		</>
	)
}
