/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useDropzone } from 'react-dropzone'
import {
	Box,
	Paper,
	Fab,
	Step,
	Stepper,
	StepLabel,
	Divider,
	Typography,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Contract } from 'near-api-js'
import {
	TableCell,
	TableRow,
	Table,
	TableContainer,
	TableHeader,
	TableBody,
} from '../templates/Table'

interface HostingProps {
	pid: string
}

export default function UploadSystem({ pid }: HostingProps) {
	const [currentStep, setCurrentStep] = React.useState(0)

	const url = 'http://localhost:3000/api/upload'

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		onDropAccepted: () => setCurrentStep(1),
	})

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

	function formatBytes(bytes: number, decimals = 2) {
		if (!+bytes) return '0 Bytes'

		const k = 1024
		const dm = decimals < 0 ? 0 : decimals
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

		const i = Math.floor(Math.log(bytes) / Math.log(k))

		return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
	}

	// get the uploaded files and add them to the hosting contract map
	async function uploadFile() {
		setCurrentStep(3)
		const files: { path: string; content_type: string; body: void }[] = []

		const hostingAccount = await window.near.account(`web4.${pid}`)

		const hostingContract = new Contract(hostingAccount, `web4.${pid}`, {
			viewMethods: [],
			changeMethods: ['add_to_map'],
		})

		acceptedFiles.forEach(async (file) => {
			const reader = new FileReader()
			reader.onload = async () => {
				files.push({
					path: file.path.startsWith('/') ? file.path : `/${file.path}`,
					content_type: file.type,
					body: reader.result,
				})
				await hostingContract.add_to_map({ content: files })
				setCurrentStep(4)
			}
			reader.readAsText(file)
		})
	}

	const steps = ['Select Files', 'Validate', 'Upload', 'Complete']

	return (
		<>
			<Box component={Paper} sx={{ padding: '2%' }}>
				<Stepper activeStep={currentStep} alternativeLabel sx={{ my: 3 }}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{currentStep === 4 ? (
					<Typography
						sx={{
							textAlign: 'center',
						}}
					>
						Your site is: <a href={url}>{url}</a>
					</Typography>
				) : null}
				<Divider variant="middle" />
				<Box sx={{ padding: '3%' }}>
					<div {...getRootProps()} style={style}>
						<input
							{...getInputProps()}
							directory=""
							webkitdirectory=""
							mozdirectory=""
						/>
						<p>Drag and drop some files here, or click to select files</p>
					</div>
				</Box>
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
