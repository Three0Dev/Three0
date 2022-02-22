import React from "react";
import { Navigation } from "../components/Navigation";
import { Outlet } from "react-router-dom";

export class Dash extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <>
        <Navigation />
        <Outlet />
      </>
    );
  }
}