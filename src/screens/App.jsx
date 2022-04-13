// import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import logo from '../assets/logo.png';
import white_logo from '../assets/white_logo.png';
import {IconButton, Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PublishIcon from '@mui/icons-material/Publish';
import { useEffect } from "react";
import { logout } from "../utils";
import { createTheme } from "@material-ui/core";
// import {DashboardIcon, FolderIcon, StorageIcon, SettingsIcon, KeyIcon} from '@mui/icons-material';
import { ProjectsDash } from "./ProjectsDash";
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

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
const drawerWidth = 240;
export function App() {
  let navigate = useNavigate();
  useEffect(() => {
    if(!window.walletConnection.isSignedIn()){
      navigate("/login");
    }
  }, []);

  // ALERT temporary function
  const deleteAccount = async () => {
    console.log(await window.subaccount.deleteAccount(window.walletConnection.getAccountId()));
    window.walletConnection.account().
    logout();
  };

  // ALERT temporary function
  const deployContract = async () => {
    try{
      const file = await fetch('./src/wasms/main.wasm');
      const buf = await file.arrayBuffer();
      await window.subaccount.deployContract(new Uint8Array(buf));
      console.log('Contract Deployed');
    } catch(e) { 
      console.log(e);
    }
  };


  return (
    <div className="App">
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar
          sx={{
            background:'whitesmoke',
          }}
        >
                  <div 
                  style={{
                    width:"100%",
                    background:"whitesmoke",
                    padding: "0.5%",
                    display: "flex",
                    alignItems: "center",
                  }}
                  >
                    <Link to="/app"><img style={{
                      width:"50px",
                      margin: "5px"
                    }} src={logo}/> </Link>
                    <Typography fontWeight={'bold'} variant="h5" color="#7b1fa2">Three0</Typography>
                    
                    <IconButton style={{position: "absolute", right: "8%", color:"#707070"}}  aria-label="delete" onClick={deleteAccount}>
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton style={{position: "absolute", right: "5%", color:"#707070"}} aria-label="deploy" onClick={deployContract}>
                      <PublishIcon />
                    </IconButton>
                    <IconButton style={{position: "absolute", right: "2%", color:"#707070"}} aria-label="logout" onClick={logout}>
                      <LogoutIcon />
                    </IconButton>
                  </div>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
    
    </div>
  );
}