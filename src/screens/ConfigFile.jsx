import React from 'react';
import {Heading, Button, DownloadIcon} from 'evergreen-ui';
import { useParams } from "react-router-dom";

export function ConfigFile(){
    async function test(){
        try{
            let id = await window.contract.getProjectDetails({pid: "1"});
            console.log(id);
        }catch(e){
            console.log(e);
        }
    }

    let params = useParams();

    return (
        <>
            <Heading style={{textAlign: "center"}} size={900}>Welcome to</Heading>
            <Heading style={{textAlign: "center"}} size={700}>{params.pid}</Heading>
            <Button size="large" onClick={test}><DownloadIcon style={{marginRight: "4%"}}/> Download Config File</Button>
        </>
    )
}