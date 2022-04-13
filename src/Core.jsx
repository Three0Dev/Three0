import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import App from "./App";
import {Login, Dash, Auth, ProjectsDash, Storage, Settings, App, NotFound} from "./screens";
import {DBView} from "../src/orbit-db-console/src/App";
import {Pane} from "evergreen-ui";
import {ProgramView as DatabaseView} from '../src/orbit-db-console/src/views/Database.jsx'
import {DatabasesView} from '../src/orbit-db-console/src/views/Databases.jsx'
import {SearchResultsView} from '../src/orbit-db-console/src/views/SearchResults.jsx'
import { Redirect } from "./components/RedirectToMain";
import { RedirectAuth } from "./components/RedirectAuth";
import { RedirectLogin } from "./components/RedirectLogin";
import Navigation from "./components/Navigation";

import "./global.css";

export function Core() {
  return (
    <Pane>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectLogin/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<App />} >
            <Route index element={<ProjectsDash />} />
            <Route path=":pid" element={<Dash />}>
              <Route index element={<RedirectAuth />}/>
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