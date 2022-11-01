/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Paper, Fab } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
	TableCell,
	TableRow,
	Table,
	TableContainer,
	TableHeader,
	TableBody,
} from '../templates/Table'

export default function UploadSystem() {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

	const style = {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '20px',
		borderWidth: '2px',
		borderRadius: '2px',
		borderColor: '#eeeeee',
		borderStyle: 'dashed',
		backgroundColor: '#fafafa',
		color: '#bdbdbd',
		outline: 'none',
		transition: 'border .24s ease-in-out',
	}

	function formatBytes(bytes, decimals = 2) {
		if (!+bytes) return '0 Bytes'

		const k = 1024
		const dm = decimals < 0 ? 0 : decimals
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

		const i = Math.floor(Math.log(bytes) / Math.log(k))

		return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
	}

	// scrape the contents of the file and return the data as text
	function readFile(file) {
		const temporaryFileReader = new FileReader()

		const p = new Promise((resolve, reject) => {
			temporaryFileReader.onerror = () => {
				temporaryFileReader.abort()
				reject(new DOMException('Problem parsing input file.'))
			}

			temporaryFileReader.onload = () => {
				resolve(temporaryFileReader.result)
			}
			temporaryFileReader.readAsText(file)
		})

		p.then((result) => {
			// log file type
			console.log(file.type)
		})

		return "hi"
	}

	return (
		<>
			<Box component={Paper} sx={{ padding: '5%' }}>
				<div {...getRootProps()} style={style}>
					<input
						{...getInputProps()}
						directory=""
						webkitdirectory=""
						mozdirectory=""
						type="file"
					/>
					<p>Drag and drop some files here, or click to select files</p>
				</div>
			</Box>
			<Box component={Paper} sx={{ padding: '2%', marginTop: '2%' }}>
				<TableContainer>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHeader headers={['Name', 'Size']} />
						<TableBody>
							{acceptedFiles.map((file) => (
								<TableRow key={file.path}>
									<TableCell component="th" scope="row">
										{file.path}
									</TableCell>
									<TableCell align="right">{formatBytes(file.size)}</TableCell>
									{/* display contents */}
									<TableCell align="right">
										{readFile(file)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Fab
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
				color="primary"
				aria-label="upload-files"
				onClick={() => {}}
			>
				<CloudUploadIcon />
			</Fab>
		</>
	)
}
