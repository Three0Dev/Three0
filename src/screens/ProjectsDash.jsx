import React from "react";
import {Button, PlusIcon} from "evergreen-ui"
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
      <Button appearance="primary" style={{
        borderRadius: "50px",
        position: "absolute",
        bottom: "10px",
        right: "10px",
        width: "60px",
        height: "60px"
      }} onClick={() => setShowCreateProjectModal(true)}><PlusIcon /></Button>
      <CreateProjectModal closeModal={closeModal} isShown={showCreateProjectModal} />
    </>
  );
}