import React from "react";
import {Button, Pane} from "evergreen-ui";
import logo from '../logo.png'
import {login} from '../utils'

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.styles = {
      container: {
        width: 300,
        height: 440,
        borderRadius: "10px",
        margin: "10% auto",
        padding: "4%",
        boxShadow: "2px 1px 19px -2px #000000",
      },
      logo: {
        width: 150,
        height: "auto",
        margin: "0 auto",
        display: "block",
        marginBottom: "15%",
        marginTop: "8%"
      },
      button: {
        margin: "70% 0 auto",
        display: "block",
        width: "100%",
        height: "13%",
      }
    }
  }
  



    
  render() {
    return (
      <Pane style={this.styles.container}>
        <img src={logo} style={this.styles.logo} />
        <Button style={this.styles.button}
        onClick={login}
        >Log In</Button>
      </Pane>
    );
  }
}