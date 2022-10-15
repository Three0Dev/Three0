import React from "react";
import { Typography } from "@mui/material";
import WIPPhoto from "../assets/wip.svg";

export default function Storage() {
  return (
    <>
      <img src={WIPPhoto} alt="WIP" className="majorImg" />
      <Typography
        variant="h2"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        Coming Soon!
      </Typography>
    </>
  );
}
