import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import App from "./App";
import {Login, Dash, Auth, ProjectsDash, Storage, Settings, App, NotFound, ConfigFile} from "./screens";
import {DBView} from "../src/orbit-db-console/src/App";
import {Pane} from "evergreen-ui";
import {ProgramView as DatabaseView} from '../src/orbit-db-console/src/views/Database.jsx'
import {DatabasesView} from '../src/orbit-db-console/src/views/Databases.jsx'
import {SearchResultsView} from '../src/orbit-db-console/src/views/SearchResults.jsx'
import { Redirect } from "./components/RedirectToMain";
import "./global.css";
import { ProjectDisplayTable } from "./components/ProjectDisplayTable";

export function Core() {
  return (
    <Pane>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Redirect url="https://three0.umso.co/" />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<App />} >
            <Route index element={<ProjectsDash />} />
            <Route path=":pid" element={<Dash />}>
              {/* <Route index element={<Navigate to= "/app/:pid/auth"/>} /> */}
              {/* <Route index element = {<ConfigFile />}/> */}
              <Route path="auth" element={<Auth />} />
              <Route path="database" element={<DBView />}>
                <Route index element={<DatabasesView />} />
                <Route path='orbitdb/:programName/:dbName' element={<DatabaseView />} />
                <Route path='search' element={<SearchResultsView />} />
              </Route>
              <Route path="storage" element={<Storage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Pane>
  );
}