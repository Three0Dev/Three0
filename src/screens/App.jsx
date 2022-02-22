import React from "react";
import { Outlet } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <Outlet />
    );
  }
}