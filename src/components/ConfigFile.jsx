import React from "react";
import {Popover,Code, Group,} from "evergreen-ui";
import {useParams} from "react-router-dom";
import {nearConfig} from "../utils";
import Swal from 'sweetalert'
import withReactContent from 'sweetalert2-react-content';
import {Box, Button} from "@mui/material"
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';

function ConfigFileInner(){
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
        // toaster.notify("Copied to clipboard");
        Swal("Copied to clipboard", "You can now access the database", {
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
            <Code>{copyConfigText}</Code>
            <Group marginTop="8%">
                <Button variant="outlined"
                iconBefore='document'
                appearance='default'
                height={24}
                onClick={downloadConfig}>
                    Download
                </Button>
                <Button variant="outlined" 
                iconBefore='document'
                appearance='default'
                height={24}
                onClick={copyConfig}>
                    Copy
                </Button>
            </Group>
        </Box>
    )
}


export function ConfigFile(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <Popover content={<ConfigFileInner />} >
            <Button
                variant="outlined" startIcon={<FileDownloadRoundedIcon fontSize='small'/>}
                iconBefore='document'
                appearance='default'
                height={24}
            >
                Get Config
            </Button>
        </Popover >
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
        
    )
}