import React, { useRef } from 'react'
import { Tooltip, Toolbar, AppBar, IconButton, TextField } from '@mui/material'
import { styled, alpha, InputBase } from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import HomeIcon from '@mui/icons-material/Home'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},
}))

export default function TopBar({
	currentPath,
	setCurrentPath,
	uploadFiles,
	createDirectory,
	reload,
	labels,
	enabledFeatures,
}) {
	const uploadInputRef = useRef(null)
	const onFileSelect = (event) =>
		uploadFiles(currentPath, [...event.target.files])
			.then(reload)
			.catch((error) => error && console.error(error))

	const onPathChange = (path) => {
		const newPath = path === '/' ? '' : path
		if (newPath !== currentPath) {
			setCurrentPath(newPath)
		}
	}

	const onCreateDirectory = () => {
		createDirectory(currentPath)
			.then(reload)
			.catch((error) => error && console.error(error))
	}

	return (
		<AppBar color="primary" position="static" sx={{ borderRadius: 5 }}>
			<Toolbar sx={{ justifyContent: 'space-around' }}>
				<Tooltip title={labels.home}>
					<IconButton color="inherit" onClick={() => setCurrentPath('')}>
						<HomeIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title={labels.up}>
					<IconButton
						color="inherit"
						onClick={() => {
							const parts = currentPath.split('/')
							parts.splice(parts.length - 1, 1)
							setCurrentPath(parts.join('/'))
						}}
						disabled={!currentPath}
					>
						<ArrowBackIcon />
					</IconButton>
				</Tooltip>
				<StyledInputBase
					sx={{ width: '75%' }}
					key={currentPath}
					type="text"
					variant="outlined"
					defaultValue={currentPath || '/'}
					onBlur={(event) => onPathChange(event.target.value)}
					onKeyDown={(event) => {
						if (event.keyCode === 13) {
							onPathChange(event.target.value)
						}
					}}
				/>
				<input
					ref={uploadInputRef}
					type="file"
					onChange={onFileSelect}
					hidden
				/>
				{enabledFeatures.indexOf('createDirectory') !== -1 && (
					<Tooltip title={labels.createDirectory}>
						<IconButton color="inherit" onClick={() => onCreateDirectory()}>
							<CreateNewFolderIcon />
						</IconButton>
					</Tooltip>
				)}
				{enabledFeatures.indexOf('uploadFiles') !== -1 && (
					<Tooltip title={labels.upload}>
						<IconButton
							color="inherit"
							onClick={() =>
								uploadInputRef.current && uploadInputRef.current.click()
							}
						>
							<FileUploadIcon />
						</IconButton>
					</Tooltip>
				)}
			</Toolbar>
		</AppBar>
	)
}
