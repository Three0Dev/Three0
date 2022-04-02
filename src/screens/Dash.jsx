import React from "react";
import { Navigation } from "../components/Navigation";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import {Pane} from 'evergreen-ui'
import {ProjectDetailsContext} from '../ProjectDetailsContext'

export function Dash() {
  let params = useParams();
  let navigate = useNavigate();

  const [projectDetails, setProjectDetails] = React.useState({})

  async function isValidProject(){
    try{
      let project = await window.contract.get_project({project_id: params.pid});
      setProjectDetails(project);
    } catch(e) {
      console.error(e);
      navigate("/app");
    }
  }

  React.useEffect(() => {
    isValidProject();
  }, []);


  return (
    <Pane style={{display: "flex"}}>
      <Navigation />
      <ProjectDetailsContext.Provider value={projectDetails}>
        <div style={{width: "99%", marginLeft: "1%"}}>
          <Outlet />
        </div>
      </ProjectDetailsContext.Provider>
    </Pane>
  );
}