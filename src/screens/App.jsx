import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import {IconButton, LogOutIcon} from 'evergreen-ui';
import { useEffect } from "react";
import { logout } from "../utils";

export function App() {
  let navigate = useNavigate();
  useEffect(() => {
    if(!window.walletConnection.isSignedIn()){
      navigate("/login");
    }

    async function createDev(){
      try{
        let devExists = await window.contract.devExist({id: window.contract.account.accountId});
        if(!devExists){
          await window.contract.createDev();
        }
      }catch(e){
        console.error(e);
      }
    }

    createDev();
  }, []);


  return (
    <>
      <div style={{
        width:"99%",
        background:"whitesmoke",
        padding: "0.5%",
        display: "flex",
        alignItems: "center",
      }}>
        {/* TODO Change URL on deploy */}
        <a href="http://localhost:1234/app/"><img style={{
          width:"50px",
          margin: "5px"
        }} src={logo}/></a>
        <IconButton style={{position: "absolute", right: "2%"}} icon={LogOutIcon} onClick = {logout}/>
      </div>
      <Outlet />
    </>
  );
}