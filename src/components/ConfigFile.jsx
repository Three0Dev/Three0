import React from "react";
import {Pane, Popover, Button, DownloadIcon, Code, Group, toaster} from "evergreen-ui";
import {useParams} from "react-router-dom";
import {nearConfig} from "../utils";

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
        toaster.notify("Copied to clipboard");
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
        <Pane width={240} height={240} padding="3%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Code>{configCredentials}</Code>
            <Group marginTop="8%">
                <Button onClick={downloadConfig}>
                    Download
                </Button>
                <Button onClick={copyConfig}>
                    Copy
                </Button>
            </Group>
        </Pane>
    )
}


export function ConfigFile(){
    return (
        <Popover content={<ConfigFileInner />} >
            <Button appearance="primary" size="large">
                <DownloadIcon marginRight="4%"/>
                 Get Config
            </Button>
        </Popover>
    )
}