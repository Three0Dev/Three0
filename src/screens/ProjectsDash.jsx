import React from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Typography, IconButton, Button } from "@mui/material";
import {CreateProjectModal} from "../components/CreateProjectModal";
import { ProjectDisplayTable } from "../components/ProjectDisplayTable";
import { Drawer, Toolbar, Box, Divider } from "@mui/material";

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
        height: "60px",
        color: "#9763ad"
        }} 
        aria-label="create-project" 
        onClick={() => setShowCreateProjectModal(true)}>
          <AddCircleIcon fontSize="inherit"/>
      </IconButton>
      <CreateProjectModal closeModal={closeModal} isShown={showCreateProjectModal} />
    </>
  );
}