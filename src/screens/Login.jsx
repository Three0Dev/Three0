import React from "react";
import {Button, Box, Typography} from "@mui/material"
import UpdatedLogo from '../assets/updatedLogo.png'
import {login} from '../utils'

export function Login() {
    const styles = {
      container: {
        height: "100vh",
        background: "ghostwhite"
      },
      loginContainer: {
        width: 300,
        height: 400,
        borderRadius: "10px",
        margin: "0 auto",
        padding: "4%",
        boxShadow: `
          0px 0px 2.2px rgba(0, 0, 0, 0.014),
          0px 0px 5.3px rgba(0, 0, 0, 0.023),
          0px 0px 10px rgba(0, 0, 0, 0.03),
          0px 0px 17.9px rgba(0, 0, 0, 0.038),
          0px 0px 33.4px rgba(0, 0, 0, 0.049),
          0px 0px 80px rgba(0, 0, 0, 0.07)
          `,
        background: "white",
        position: "relative",
        top: "10%"
      },
      logo: {
        width: 150,
        height: "auto",
        margin: "0 auto",
        display: "block",
        marginBottom: "15%"
      },
      heading: {
        textAlign: "center"
      },
      button: {
        position: "relative",
        width: "100%",
        height: "13%",
        top: "20%",
        background: "#6247aa",
        color: "white",
      }
    }
    
    return (
      <Box style={styles.container}>
        <Box style={styles.loginContainer}>
          <img src={UpdatedLogo} style={styles.logo} />
          <Typography color="primary" variant="h5" style={styles.heading}>Three0</Typography>
          <Button style={styles.button}
          onClick={login}
          >Log In</Button>
        </Box>
      </Box>
    );
}