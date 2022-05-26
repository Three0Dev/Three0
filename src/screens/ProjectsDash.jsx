import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
import {CreateProjectModal} from "../components/CreateProjectModal";
import ProjectDisplayBoard from "../components/ProjectDisplayBoard";
import { nearConfig } from "../utils";
import {deployNEARProjectContract} from '../services/NEAR'
import { useSearchParams, useNavigate } from 'react-router-dom';
import {providers} from 'near-api-js';
import wave from '../assets/wave.svg';
import Backdrop from "../components/templates/Backdrop";

const classes = {
  coloredBackground: {
      height: "75vh", 
      background: "secondary.main", 
      width: "100%",
      zIndex: "snackbar - 1",
  },
};

export function ProjectsDash() {
  let [showCreateProjectModal, setShowCreateProjectModal] = React.useState(false);
  let [loading, setLoading] = React.useState(false);

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
        setLoading(true);
        deployNEARProjectContract().then(() => navigate(`/app/${result.transaction.receiver_id}`)).finally(() => setLoading(false));
      }
    });
  }

  function closeModal() {
    setShowCreateProjectModal(false);
  };

  return (
    <>
      <Backdrop loading={loading}/>
      <ProjectDisplayBoard />
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
      <img src={wave} style={{position: "fixed", "bottom": 0}}/>
      <CreateProjectModal closeModal={closeModal} isShown={showCreateProjectModal} />
    </>
  );
}