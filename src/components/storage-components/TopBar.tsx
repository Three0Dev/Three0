/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'
import {
	Tooltip,
	Toolbar,
	AppBar,
	IconButton,
	InputBase,
	styled,
	alpha,
} from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import HomeIcon from '@mui/icons-material/Home'
import Swal from 'sweetalert2'

const IconWrapper = styled('div')(({ theme }) => ({
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	width: '100%',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: '1%',
		borderRadius: theme.shape.borderRadius,
		transition: theme.transitions.create(['background', 'color'], {
			easing: 'ease-in-out',
		}),
		'&:hover': {
			background: alpha(theme.palette.common.white, 0.15),
		},
		'&:focus': {
			background: alpha(theme.palette.common.white, 0.25),
		},
	},
}))

const PathInputContainer = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	marginLeft: 0,
	width: '75%',
	display: 'flex',
}))

export default function TopBar({
	currentPath,
	setCurrentPath,
	uploadFiles,
	createDirectory,
	reload,
	labels,
	enabledFeatures,
}: any) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const onFileSelect = (event: { target: { files: any } }) => {
    uploadFiles(currentPath, [...event.target.files])
      .then(reload)
      .catch((error: any) => error && console.error(error));
  };

	const onPathChange = (path: string) => {
		const newPath = path === '/' ? '' : path
		if (newPath !== currentPath) {
			setCurrentPath(newPath)
		}
	}

	const onCreateDirectory = async () => {
		// createDirectory(currentPath)
		// 	.then(reload)
		// 	.catch((error) => error && console.error(error))

		const { value: folderName } = await Swal.fire({
			title: 'New Folder',
			input: 'text',
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return 'You need to write something!'
				}
				return value
			},
		})
	}

  return (
    <AppBar
      color="primary"
      position="static"
      sx={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
    >
      <Toolbar sx={{ justifyContent: "space-around" }}>
        <input
          ref={uploadInputRef}
          type="file"
          onChange={onFileSelect}
          hidden
        />
        {enabledFeatures.indexOf("createDirectory") !== -1 && (
          <Tooltip title={labels.createDirectory}>
            <IconButton color="inherit" onClick={() => onCreateDirectory()}>
              <CreateNewFolderIcon />
            </IconButton>
          </Tooltip>
        )}
        <PathInputContainer>
          <Tooltip title={labels.home}>
            <IconButton color="inherit" onClick={() => setCurrentPath("")}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <StyledInputBase
            key={currentPath}
            type="text"
            defaultValue={currentPath || "/"}
            onBlur={(event) => onPathChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                onPathChange((event.target as HTMLInputElement).value);
              }
            }}
          />
        </PathInputContainer>
        <Tooltip title={labels.upload}>
          <IconButton
            color="inherit"
            onClick={() => {
              const node = uploadInputRef.current;
              if (node) {
                node.click();
              }
            }}
          >
            <FileUploadIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
