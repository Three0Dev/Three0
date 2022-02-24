import React from 'react';
import {Heading, Button, DownloadIcon} from 'evergreen-ui';
import { useParams } from "react-router-dom";

export function ConfigFile(){

    let params = useParams();

    return (
        <>
            <Button size="large" ><DownloadIcon style={{marginRight: "4%"}}/> Download Config File</Button>
        </>
    )
}