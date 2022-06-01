import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Fab, useTheme } from "@mui/material";
import ProjectDisplayBoard from "../components/ProjectDisplayBoard";
import { useSearchParams, useNavigate } from 'react-router-dom';
import wave from '../assets/wave.svg';
import Backdrop from "../components/templates/Backdrop";
import Swal from "sweetalert2";
import {createNEARAccount, checkAccountStatus} from "../services/NEAR";

const short = require('short-uuid');

export function ProjectsDash() {
  let [loading, setLoading] = React.useState(false);

  let [params] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();


  useEffect(() => {
    handleCreateQueryParams();
  }, []);

  function handleCreateQueryParams(){
    const hash = params.get("transactionHashes");
    if(!hash) return;

    setLoading(true);
    checkAccountStatus(hash).then(() => navigate(`/app/${result.transaction.receiver_id}`)).finally(() => setLoading(false));
  }

  async function showProjectSwal(){
    const uuid = short.generate().toLowerCase();

    const { value: formValues } = await Swal.fire({
      title: 'Create Project',
      html:
        `<input id="project-name" class="swal2-input" placeholder="Three0">
        <select class="swal2-input" id="blockchain-type" placeholder="Blockchain">
          <optgroup label="NEAR">
            <option value="NEAR_TESTNET">NEAR Testnet</option>
          </optgroup>
        </select>`,
      focusConfirm: false,
      confirmButtonColor: theme.palette.secondary.dark,
      preConfirm: () => {
        const name = document.getElementById('project-name').value
        const nameRegex = /^(([a-z\d]+[\-_])*[a-z\d]+)$/;
    
        const pid = `${name}-${uuid}.${window.accountId}`;
        
        if(!nameRegex.test(name) || pid.length > 50){
          Swal.showValidationMessage('Invalid Project Name')
        }
    
        const chainType = document.getElementById('blockchain-type').value
        return [pid, chainType]
    
      }
    })

    if (formValues) {
      localStorage.setItem("projectDetails", JSON.stringify({pid: formValues[0], blockchainNetwork: formValues[1]}));
      setLoading(true);
      createNEARAccount();
    }
  }

  return (
    <>
      <Backdrop loading={loading} />
      <ProjectDisplayBoard />
      <Fab
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        color="primary"
        aria-label="create-project" 
        onClick={showProjectSwal}>
          <AddIcon/>
      </Fab>
      <img src={wave} style={{position: "fixed", "bottom": 0}}/>
    </>
  );
}