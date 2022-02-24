import React from "react";
import { Outlet } from "react-router-dom";
import logo from '../assets/logo.png';

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
        width:"100%",
        background:"whitesmoke",
        padding: "1%"
      }}>
        <img style={{
          width:"50px",
          display: "block",
          margin: "0 auto"
        }} src={logo}/>
      </div>
      <Outlet />
    </>
  );
}