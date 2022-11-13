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
import { uploadFiles } from '../storage-components'
import { Contract, keyStores } from "near-api-js";


export default function UploadSystem() {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

	interface FileWithPath extends File {
		path: string
	}

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
	async function uploadFile() {
		const files: { path: string; content_type: string; body: void }[] = []

		const hostingContract = new Contract(
			window.walletConnection.account(),
			// get actual contract ID instead of hardcoding it
			"web4.srawulwar.testnet",
			{
			  viewMethods: [],
			  changeMethods: ["add_to_map"],
			}
		  );
		
		  acceptedFiles.forEach(async (file) => {
			const temporaryFileReader = new FileReader()
			
			temporaryFileReader.onload = async () => {
				files.push({
					path: file.path.startsWith('/') ? file.path : `/${file.path}`,
					content_type: file.type,
					body: temporaryFileReader.result,
				})		
			}
			temporaryFileReader.onloadend = async () => {
				hostingContract.add_to_map({content: files})
			}
			temporaryFileReader.readAsText(file)

		})
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
								<TableRow key={(file as FileWithPath).path}>
									<TableCell component="th" scope="row">
										{(file as FileWithPath).path}
									</TableCell>
									<TableCell align="right">{formatBytes(file.size)}</TableCell>
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
				onClick={() => uploadFile()}
			>
				<CloudUploadIcon />
			</Fab>
		</>
	)
}
