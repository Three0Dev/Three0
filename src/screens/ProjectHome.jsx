import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { ProjectDetailsContext } from '../ProjectDetailsContext';
import GitHubIcon from '@mui/icons-material/GitHub';
import {ConfigFile} from '../components/ConfigFile';
import CodeImage from '../assets/code.svg';

const classes = {
    h1: {wordBreak: "break-all", textAlign: "center", padding: "3% 3% 0"},
    h3: {wordBreak: "break-word", textAlign: "center", padding: "0 3%", color: "#81C784"},
    buttonContainer: {textAlign: "center", marginTop: "3%"},
    img: {width: 600, margin: "2% auto", display: "block"}
};

export default function ProjectHome(){
    let {projectDetails} = React.useContext(ProjectDetailsContext);

    return (
        <Box>
            <img src={CodeImage} alt="Code" style={classes.img}/>
            {/* TODO Change to Name */}
            <Typography variant="h1" sx={classes.h1}>Welcome to</Typography>
            <Typography variant="h3" sx={classes.h3}>{projectDetails.pid}</Typography>
            <Box sx={ classes.buttonContainer}>
                <ConfigFile />
                <Button sx={{marginLeft: "5%"}} onClick={() => window.open("https://github.com/Three0Org/JS-SDK", '_blank').focus()}><GitHubIcon/>&nbsp;Visit Docs</Button>
            </Box>
        </Box>
    )
}