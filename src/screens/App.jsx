import React from "react";
import { Outlet } from "react-router-dom";
import logo from '../assets/logo.png';

export function App() {
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