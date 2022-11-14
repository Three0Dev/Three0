/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Paper, Fab } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Contract, keyStores } from 'near-api-js'
import {
	TableCell,
	TableRow,
	Table,
	TableContainer,
	TableHeader,
	TableBody,
} from '../templates/Table'
import { uploadFiles } from '../storage-components'

interface HostingProps {
	pid: string
}

export default function UploadSystem({ pid }: HostingProps) {
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
			pid,
			{
				viewMethods: [],
				changeMethods: ['add_to_map'],
			}
		)

		acceptedFiles.forEach(async (file) => {
			// const p = new Promise((resolve, reject) => {
			const temporaryFileReader = new FileReader()

			temporaryFileReader.onload = async () => {
				files.push({
					path: (file as FileWithPath).path,
					content_type: file.type,
					body: temporaryFileReader.result,
				})
				// hostingContract.add_to_map({content: files})
			}
			temporaryFileReader.readAsText(file)
		})
		const tempArr = [
			{
				path: '/subpage.html',
				content_type: 'text/html',
				body: `<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<title>subpage</title>
				
				</head>
				<body>
					<h1>you were redirected to a subpage wowow</h1>
					<p>this does the same thing as the other page</p>
					<p>The button console logs that you clicked it</p>
					<button id="button">Click Me</button>
					<script>
					function log() {
						console.log('You clicked the button');
					}
					var button = document.getElementById('button');
					button.addEventListener('click', log);
					</script>
					<!-- create a link to a subpage -->
					<p>click this to go back to the other page</p>
					<a href="index.html">Subpage</a>
				</body>
				</html>`,
			},
			{
				path: '/index.html',
				content_type: 'text/html',
				body: `<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<title>Simple</title>
				
				</head>
				<body>
					<h1>Simple html file to deploy</h1>
					<p>The button console logs that you clicked it</p>
					<button id="button">Click Me</button>
					<script src="./simple.js"></script>
					<!-- create a link to a subpage -->
					<a href="subpage.html">Subpage</a>
				</body>
				</html>`,
			},
			{
				path: '/simple.js',
				content_type: 'text/javascript',
				body: `function log() {
					console.log('You clicked the button');
				}
				var button = document.getElementById('button');
				button.addEventListener('click', log);`,
			},
		]
		// console.log(tempArr)
		await hostingContract.add_to_map({ content: tempArr })
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
