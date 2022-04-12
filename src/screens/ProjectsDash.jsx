import React from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Typography, IconButton, Button } from "@mui/material";
import {CreateProjectModal} from "../components/CreateProjectModal";
import { ProjectDisplayTable } from "../components/ProjectDisplayTable";

export function ProjectsDash() {
  let [showCreateProjectModal, setShowCreateProjectModal] = React.useState(false);

  function closeModal() {
    setShowCreateProjectModal(false);
  };

  return (
    <>
      <ProjectDisplayTable />
      {/* TODO Change to sticky */}
      <IconButton style={{
        // borderRadius: "50px",
        position: "absolute",
        bottom: "10px",
        right: "10px",
        size: "large",
        width: "60px",
        height: "60px"
        }} 
        aria-label="create-project" 
        onClick={() => setShowCreateProjectModal(true)}>
          <AddCircleIcon fontSize="inherit"/>
      </IconButton>
      <CreateProjectModal closeModal={closeModal} isShown={showCreateProjectModal} />
    </>
  );
}