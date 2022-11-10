/* eslint-disable no-console */
import React from 'react'
import { Box, Paper } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

export default function Body({
	structure,
	reload,
	currentPath,
	setCurrentPath,
	openFile,
	selection,
	setSelection,
	rename,
	enabledFeatures,
}: any) {
	const list = structure[currentPath] || []

	const onRename = () => {
		rename(selection[0])
			.then(reload)
			.catch((error: any) => error && console.error(error))
	}

	return (
		<Box
			className="FileManager-Body"
			component={Paper}
			onClick={(event) => {
				event.stopPropagation()
				event.preventDefault()
				setSelection([])
			}}
		>
			{!!list && (
				<>
					{list.map((item: { name: {} | null | undefined; type: number }) => {
						const path = `${currentPath}/${item.name}`
						const selected = selection.indexOf(path) !== -1
						return (
							<div
								className={`Body-Item${selected ? ' Item-Selected' : ''}`}
								onClick={(event) => {
									event.stopPropagation()
									event.preventDefault()
									setSelection([path])
								}}
								onDoubleClick={(event) => {
									event.stopPropagation()
									event.preventDefault()
									setSelection([])
									if (item.type === 1) {
										openFile(path)
									} else {
										setCurrentPath(path)
									}
								}}
								aria-hidden="true"
							>
								<div className="Body-Item-Icon">
									{item.type === 1 ? <InsertDriveFileIcon /> : <FolderIcon />}
								</div>
								<div
									className="Body-Item-Name"
									title={item.name as string}
									onClick={() => {
										const range = window.getSelection()
										if (
											selection[0] === path &&
											enabledFeatures.indexOf('rename') !== -1 &&
											!range?.toString().length
										) {
											onRename()
										}
									}}
									aria-hidden="true"
								>
									{item.name}
								</div>
							</div>
						)
					})}
				</>
			)}
		</Box>
	)
}
