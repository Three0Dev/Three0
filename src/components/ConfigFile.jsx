import React from "react";
import {useParams} from "react-router-dom";
import {nearConfig} from "../utils";
import Swal from 'sweetalert'
import {Box, Button, Popover, Typography, ToggleButton, ToggleButtonGroup, Paper} from "@mui/material"
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import {createTheme, makeStyles } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
    primary: {
        main: '#707070'
        },
      secondary: {
        main: '#7b1fa2'
      }
    }
  });
  const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        overflowX: 'auto',
        justifyContent: 'center',
        display: 'flex',
    },
    table: {
        minWidth: 650,
    },
    TableContainer: {
        maxHeight: '100%',
        borderRadius: '10px',
        margin: theme.spacing(1),
        minWidth: 120,
    },
    Buttons: {
        margin: theme.spacing(1),
        borderRadius: '1px',
    },
    Paper: {
        padding: theme.spacing(1),
        display: 'flex',
        // overflow: 'auto',
        flexDirection: 'column',
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        backgroundColor: '#faedff',
    },
    Heading: {
        marginTop: theme.spacing(1),
    },
  }));
function ConfigFileInner(){
    const classes = useStyles();
    let params = useParams();
    let configCredentials = `
        {
            "contractName": "${nearConfig.contractName}",
            "projectId": "${params.pid}"
        }
        `
    let copyConfigText = `
        const config = ${configCredentials};
    `
    function copyConfig(){
        navigator.clipboard.writeText(copyConfigText);
        Swal("Copied to clipboard", {
            timer: 1500,buttons: false,
            });
    }

    function downloadConfig(){
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(configCredentials));
        element.setAttribute('download', 'config.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
        
    return (
        <Box width={240} height={240} padding="3%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Paper elevation={0} className={classes.Paper} >
                {copyConfigText}
            </Paper>
            <ToggleButtonGroup 
            >
                <ToggleButton 
                variant="outlined"
                color='secondary'
                iconBefore='document'
                appearance='default'
                height={24}
                style={{color: '#7b1fa2'}}
                onClick={downloadConfig}>
                    Download
                </ToggleButton>
                <ToggleButton 
                variant="outlined" 
                color='secondary'
                iconBefore='document'
                appearance='default'
                height={24}
                style={{color: '#7b1fa2'}}
                onClick={copyConfig}>
                    Copy
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    )
}


export function ConfigFile(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const openPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <div>
            <Button aria-describedby={id} variant="contained" onClick={handleClick} endIcon={<FileDownloadRoundedIcon />} style={{backgroundColor:'#7b1fa2'}}>
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
        </div>
    )
}
        // <Popover content={<ConfigFileInner />} >
        //     <Button
        //         theme={theme}
        //         // variant="outlined" 
        //         startIcon={<FileDownloadRoundedIcon/>}
        //         iconBefore='document'
        //         appearance='default'
        //         height={24}
        //         color="primary"
        //     >
        //         Get Config
        //     </Button>
        // </Popover >
        // <div>
        //     <Button
        //         variant="outlined" startIcon={<FileDownloadRoundedIcon fontSize='small'/>}
        //         iconBefore='document'
        //         appearance='default'
        //         height={24}
        //         onClick={openPopover}
        //     >
        //     Get Config
        // </Button>
        // <Popover>
        //     open = {Boolean(anchorEl)}
        //     anchorEl = {anchorEl}
        //     onClose = {() => setAnchorEl(null)}
        //     anchorOrigin = {{
        //         vertical: 'bottom',
        //         horizontal: 'center',
        //     }}
        //     transformOrigin = {{
        //         vertical: 'top',
        //         horizontal: 'center',
        //     }}
        //     <ConfigFileInner />
        // </Popover>
        // </div>
        
//     )
// }