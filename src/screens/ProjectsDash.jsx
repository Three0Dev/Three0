import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
import {CreateProjectModal} from "../components/CreateProjectModal";
import { ProjectDisplayTable } from "../components/ProjectDisplayTable";
import { nearConfig } from "../utils";
import {deployNEARProjectContract, createNEARProject} from '../services/NEAR'
import { useSearchParams, useNavigate } from 'react-router-dom';
import {providers} from 'near-api-js';

export function ProjectsDash() {
  let [showCreateProjectModal, setShowCreateProjectModal] = React.useState(false);

  let [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    handleCreateQueryParams();
  }, []);

  function handleCreateQueryParams(){
    const hash = params.get("transactionHashes");
    if(!hash) return;

    const provider = new providers.JsonRpcProvider(
      `https://archival-rpc.${nearConfig.networkId}.near.org`
    );
    
    provider.txStatus(hash, window.accountId).then(result => {
      console.log(result);
      if(result.transaction.actions.includes("CreateAccount") && result.transaction_outcome.outcome.status.SuccessReceiptId){
        Promise.all([createNEARProject(result.transaction.receiver_id),
          deployNEARProjectContract()]).then(() => navigate(`/app/${result.transaction.receiver_id}`));
      } else if(result.transaction.actions[0].FunctionCall.method_name == "create_project" && result.transaction_outcome.outcome.status.SuccessReceiptId){
        deployNEARProjectContract().then(() => navigate(`/app/${result.transaction.receiver_id}`));
      }
    });
  }

  function closeModal() {
    setShowCreateProjectModal(false);
  };

  return (
    <>
      <ProjectDisplayTable />
      <Fab
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        color="primary"
        aria-label="create-project" 
        onClick={() => setShowCreateProjectModal(true)}>
          <AddIcon/>
      </Fab>
      <CreateProjectModal closeModal={closeModal} isShown={showCreateProjectModal} />
    </>
  );
}