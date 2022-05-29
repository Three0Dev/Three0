import { Outlet, useNavigate, Link } from "react-router-dom";
import UpdatedLogo from '../assets/UpdatedLogo.png';
import {IconButton, AppBar, Toolbar, Typography} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from "../utils";
import React, {useEffect} from 'react';

function TopBar(){
  return (
    <AppBar sx={{
      background:'whitesmoke',
    }}>
          <Toolbar>
              <Link to="/app"><img
                width="50px" src={UpdatedLogo}/> </Link>
              <Typography fontWeight='bold' variant="h5" color="primary">Three0</Typography>
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
    <>
      <TopBar />
      <Outlet />
    </>
  );
}