import React from "react";
import { Navigation } from "../components/Navigation";
import { Outlet } from "react-router-dom";
import {Pane} from 'evergreen-ui'

export class Dash extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <Pane style={{display: "flex"}}>
        <Navigation />
        <div style={{width: "99%", marginLeft: "1%"}}>
          <Outlet />
        </div>
      </Pane>
    );
  }
}