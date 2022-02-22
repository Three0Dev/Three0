import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import App from "./App";
import {Login, Dash, Auth, Storage, Settings, App, NotFound} from "./screens";
import {DBView} from "../src/orbit-db-console/src/App";
import {Pane} from "evergreen-ui";
import {ProgramView as DatabaseView} from '../src/orbit-db-console/src/views/Database.jsx'
import {DatabasesView} from '../src/orbit-db-console/src/views/Databases.jsx'
import {SearchResultsView} from '../src/orbit-db-console/src/views/SearchResults.jsx'
import { RedirectToMain } from "./components/RedirectToMain";

export function Core() {
  return (
    <Pane>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectToMain />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<App />}>
            <Route path=":pid" element={<Dash />}>
              <Route path="auth" element={<Auth />} />
              <Route path="database" element={<DBView />}>
                <Route index element={<DatabasesView />} />
                <Route path='orbitdb/:programName/:dbName' element={<DatabaseView />} />
                <Route path='search' element={<SearchResultsView />} />
              </Route>
              <Route path="storage" element={<Storage />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Pane>
  );
}