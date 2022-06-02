import React from "react";
import {AppBar, Toolbar, Typography, Box, Button} from "@mui/material";
import UpdatedLogo from '../assets/logos/UpdatedLogo.png';
import { Link } from "react-router-dom";
import Wave from '../assets/wave.svg';
import { useTheme } from "@emotion/react";

export default function Landing(){
    const theme = useTheme()
    
    return (
        <>
            <AppBar sx={{backgroundColor:'common.white'}}>
                <Toolbar>
                    <Link to="/app">
                        <img width="50px" src={UpdatedLogo}/> 
                    </Link>
                    <Typography fontWeight='bold' variant="h5" color="primary">Three0</Typography>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Box sx={{textAlign: "center"}}>
                <Box>
                    <Typography fontWeight='bold' variant="h1">Build Web3 with <span style={{color: theme.palette.primary.main}}>Three0</span></Typography>
                    <Typography variant="h4" color={theme.palette.grey[400]}>Convenience. Compatibility. Cost Efficiency. </Typography>
                </Box>
                <Box>
                    <Link to="/login" style={{textDecoration: "none"}}>
                        <Button variant="contained" size="large">Get Started</Button>
                    </Link>
                    <Button onClick={() => window.open("https://github.com/Three0Org/Three0", '_blank').focus()} 
                        variant="outlined" size="large">View Github</Button>
                </Box>

                <img src={Wave} width="100%" />
            </Box>
                <Box sx={{textAlign: "center", padding: 5}}>
                    <Typography variant="h3" fontWeight='bold' color={theme.palette.primary.light}>What is Three0?</Typography>
                    <Typography>
                        Three0 is a web3 developer toolkit that allows for the creation of dApps. 
                        It is an ecosystem that includes libraries for blockchain interactions and a developer console for a bird-eye-view of your dApp's performance. 
                        While providing you access to familiar tools such as authentication, databases, and storage we allow you to turn your app idea into a dApp idea by handling everything from Token Lifecycle Management, Blockchain and Web3 integration, Smart Contract interactions, and anything else that makes web3 intimidating or complex. 
                        The power of web3 with the simplicity of web2
                    </Typography>
                </Box>
        </>
    )
}