import React from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Box, Button, Popover, ButtonGroup, Paper } from '@mui/material'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'

const classes = {
	Paper: {
		padding: 1,
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		marginTop: 1,
		marginBottom: 1,
		backgroundColor: '#dedaf0',
		wordBreak: 'break-word',
		whiteSpace: 'break-spaces',
	},
}

// TODO Make configCrendentials more generic for other networks

const getProjectId = (pid) => pid.substring(0, pid.indexOf('.'))

function ConfigFileInner() {
	const params = useParams()
	const configCredentials = `{\n"contractName": "${
		params.pid
	}",\n"projectId": "${getProjectId(
		params.pid
	)}",\n"chainType": "NEAR_TESTNET"\n}`
	const copyConfigText = `const config = ${configCredentials};`
	function copyConfig() {
		navigator.clipboard.writeText(copyConfigText)
		Swal.fire({
			title: 'Copied to clipboard',
			timer: 1500,
			buttons: false,
			icon: 'success',
		})
	}

	function downloadConfig() {
		const element = document.createElement('a')
		element.setAttribute(
			'href',
			`data:text/plain;charset=utf-8,${encodeURIComponent(configCredentials)}`
		)
		element.setAttribute('download', 'config.json')
		element.style.display = 'none'
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	return (
		<Box
			width={240}
			padding="3%"
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<Paper elevation={0} sx={classes.Paper}>
				{copyConfigText}
			</Paper>
			<ButtonGroup color="primary">
				<Button height={24} onClick={() => downloadConfig()}>
					Download
				</Button>
				<Button height={24} onClick={() => copyConfig()}>
					Copy
				</Button>
			</ButtonGroup>
		</Box>
	)
}

export default function ConfigFile() {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	return (
		<>
			<Button
				aria-describedby={id}
				variant="contained"
				onClick={handleClick}
				endIcon={<FileDownloadRoundedIcon />}
				sx={{ backgroundColor: 'primary' }}
			>
				Get Config
			</Button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<ConfigFileInner />
			</Popover>
		</>
	)
}
