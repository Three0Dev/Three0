import {useEffect} from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import UpdatedLogo from '../assets/UpdatedLogo.png';
import {IconButton, Box, AppBar, CssBaseline, Toolbar, Typography} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from "../utils";
import * as React from 'react';

export function App() {
  let navigate = useNavigate();
  useEffect(() => {
    if(!window.walletConnection.isSignedIn()){
      navigate("/login");
    }
  }, []);


  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed">
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
                margin: "0px"
              }} src={UpdatedLogo}/> </Link>
              <Typography fontWeight={'bold'} variant="h5" color="#7d68d1">Three0</Typography>
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