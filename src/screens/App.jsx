import React from "react";
import { Outlet } from "react-router-dom";
import logo from '../assets/logo.png';
import {IconButton, LogOutIcon, majorScale} from 'evergreen-ui';

export function App() {

  console.log("hi")
  console.log(window.contract)
  try {
    // make an update call to the smart contract
    window.contract.getID({

    })
  } catch (e) {
    console.log("Hershey Code");
    console.log(e);
  }


  return (
    <>
      <div style={{
        width:"99%",
        background:"whitesmoke",
        padding: "0.5%",
        display: "flex",
        alignItems: "center",
      }}>
        <img style={{
          width:"50px",
          margin: "5px"
        }} src={logo}/>
        <IconButton style={{position: "absolute", right: "2%"}} icon={LogOutIcon} />
      </div>
      <Outlet />
    </>
  );
}