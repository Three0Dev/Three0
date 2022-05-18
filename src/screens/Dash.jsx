import React from "react";
import { Navigation } from "../components/Navigation";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import {ProjectDetailsContext} from '../ProjectDetailsContext'
import {Contract} from 'near-api-js';

export function Dash() {
  let params = useParams();
  let navigate = useNavigate();

  const [projectDetails, setProjectDetails] = React.useState({});
  const [projectContract, setContract] = React.useState(null);

  async function isValidProject(){
    try{
      const account = await window.near.account(params.pid);
      const status = await account.state();
    
      return status.code_hash == "11111111111111111111111111111111";
    } catch(e) {
      console.error(e);
      return false;
    }
  }

  async function getProjectDetails(){
    const account = await window.near.account(params.pid);

    const projectContractInit = new Contract(
      account,
      params.pid,
      {
        viewMethods: ["get_project", "get_users"],
        changeMethods: ["update_project", "add_database", "delete_database"],
      }
    );

    const details = await projectContractInit.get_project({});
    setContract(projectContractInit);
    setProjectDetails(details);
  }

  React.useEffect(() => {
    isValidProject().then(isValid => {
      if(isValid){
        getProjectDetails();
      } else {
        navigate('/app');
      }
    });
  }, []);


  return (
    <Box style={{display: "flex"}}>
      <Navigation />
      <ProjectDetailsContext.Provider value={{projectDetails, projectContract}}>
        <div style={{width: "99%", marginLeft: "1%", marginTop: "2%"}}>
          <Outlet />
        </div>
      </ProjectDetailsContext.Provider>
    </Box>
  );
}