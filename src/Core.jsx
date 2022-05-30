import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Login, Dash, Auth, ProjectsDash, Storage, Landing, App, NotFound, ProjectHome} from "./screens";
import {DBView} from "../src/orbit-db-console/src/App";
import {DatabaseView, DatabasesView, SearchResultsView} from '../src/orbit-db-console/src/views'
import "./global.css";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material";

const PRIMARY_COLOR = '#6247aa'
const SECONDARY_COLOR = '#81C784'

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR
    },
    secondary: {
      main: SECONDARY_COLOR
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "0.4s",
          cursor: 'pointer',
          ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)"
          }
        }
      }
    },
    MuiListItemButton:{
      styleOverrides: {
        root: {
          "selected": {
            "backgroundColor": PRIMARY_COLOR
          }
        }
    }
  }
}
});

export function Core() {
  return (
    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route   path="/" element={<Landing />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<App />} >
              <Route index element={<ProjectsDash />} />
              <Route path=":pid" element={<Dash />}>
                <Route index element={<ProjectHome />}/>
                <Route path="auth" element={<Auth />} />
                <Route path="database" element={<DBView />}>
                  <Route index element={<DatabasesView />} />
                  <Route path='orbitdb/:programName/:dbName' element={<DatabaseView />} />
                  <Route path='search' element={<SearchResultsView />} />
                </Route>
                <Route path="storage" element={<Storage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
    </StyledEngineProvider>  
  );
}