import React from "react";
import {Button, Pane, Heading} from "evergreen-ui";
import logo from '../logo.png'
import {login} from '../utils'

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.styles = {
      container: {
        height: "100vh",
        background: "#7B20A2"
      },
      loginContainer: {
        width: 300,
        height: 440,
        borderRadius: "10px",
        margin: "0 auto",
        padding: "4%",
        boxShadow: "2px 1px 19px -2px #000000",
        background: "white",
        position: "relative",
        top: "10%"
      },
      logo: {
        width: 150,
        height: "auto",
        margin: "0 auto",
        display: "block",
        marginBottom: "15%",
        marginTop: "8%"
      },
      heading: {
        textAlign: "center"
      },
      button: {
        position: "relative",
        width: "100%",
        height: "13%",
        top: "25%",
        // TODO remove when theme is complete
        background: "#7B20A2",
        color: "white",
      }
    }
  }
    
  render() {
    return (
      <Pane style={this.styles.container}>
        <Pane style={this.styles.loginContainer}>
          <img src={logo} style={this.styles.logo} />
          <Heading size={900} style={this.styles.heading}>Three0</Heading>
          <Button style={this.styles.button}
          onClick={login}
          >Log In</Button>
        </Pane>
      </Pane>
    );
  }
}