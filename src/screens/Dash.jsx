import React from "react";
import { Navigation } from "../components/Navigation";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import {Pane} from 'evergreen-ui'

export function Dash() {
  let params = useParams();
  let navigate = useNavigate();

  React.useEffect(() => {
    async function isValidProject(){
      try{
        const project = await window.contract.getProjectDetails({pid: params.pid});
        if(!project){
          navigate("/app");
        }
      } catch(e){
        console.error(e);
      }
    }

    isValidProject();
  }, []);


  return (
    <Pane style={{display: "flex"}}>
      <Navigation />
      <div style={{width: "99%", marginLeft: "1%"}}>
        <Outlet />
      </div>
    </Pane>
  );
}