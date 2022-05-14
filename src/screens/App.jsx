import {useEffect} from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import UpdatedLogo from '../assets/UpdatedLogo.png';
import {IconButton, Box, AppBar, Toolbar, Typography} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from "../utils";
import * as React from 'react';

function TopBar(){
  return (
    <AppBar>
          <Toolbar
            sx={{
              background:'whitesmoke',
              width:"100%",
              padding: "0.5%",
              display: "flex",
              alignItems: "center",
            }}
          >
              <Link to="/app"><img style={{
                width:"50px",
                margin: "0px"
              }} src={UpdatedLogo}/> </Link>
              <Typography fontWeight={'bold'} variant="h5" color="#6247aa">Three0</Typography>
              <IconButton style={{position: "absolute", right: "2%", color:"#707070"}} aria-label="logout" onClick={logout}>
                <LogoutIcon />
              </IconButton>
          </Toolbar>
        </AppBar>
  );
}

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
        <TopBar />
        <Box component="main" sx={{ flexGrow: 1}}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}