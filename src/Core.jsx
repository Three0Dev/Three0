import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";

export default function Core() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="login" element={<Login />} />
                <Route path="app" element={<PrimaryApp />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
