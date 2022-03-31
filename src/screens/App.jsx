import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import logo from '../assets/logo.png';
import {IconButton, LogOutIcon, Heading} from 'evergreen-ui';
import { useEffect } from "react";
import { logout } from "../utils";

export function App() {
  let navigate = useNavigate();
  useEffect(() => {
    if(!window.walletConnection.isSignedIn()){
      navigate("/login");
    }
  }, []);

  const deleteAccount = async () => {
    // const account = await window.near.account("three0develop." + window.walletConnection.getAccountId());
    // console.log(await window.subaccount.deleteAccount(window.walletConnection.getAccountId()));
    // logout();
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
    <>
      <div style={{
        width:"100%",
        background:"whitesmoke",
        padding: "0.5%",
        display: "flex",
        alignItems: "center",
      }}>
        <Link to="/app"><img style={{
          width:"50px",
          margin: "5px"
        }} src={logo}/> </Link>
        <Heading size = {1000} style = {{}} color = "#7b1fa2">Three0</Heading>
        {/* <div>
            <Text style={{position: "absolute", right: "50%"}} />
        </div> */}

        <IconButton style={{position: "absolute", right: "2%"}} icon={LogOutIcon} onClick = {deleteAccount}/>
        {/* <IconButton style={{position: "absolute", right: "2%"}} icon={LogOutIcon} onClick = {logout}/> */}
      </div>
      <Outlet />
    </>
  );
}