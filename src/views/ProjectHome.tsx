import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProjectDetailsContext from "../state/ProjectDetailsContext";
import ConfigFile from "../components/ConfigFile";
import CodeImage from "../assets/code.svg";
import { deleteNEARProject } from "../services/NEAR";
import Backdrop from "../components/templates/Backdrop";

const classes = {
  h1: { wordBreak: "break-all", textAlign: "center", padding: "3% 3% 0" },
  h3: {
    wordBreak: "break-word",
    textAlign: "center",
    padding: "0 3%",
    color: "#81C784",
  },
  buttonContainer: { textAlign: "center", marginTop: "3%" },
  img: { width: 600, margin: "2% auto", display: "block" },
};

export default function ProjectHome() {
  const { projectDetails } = React.useContext(ProjectDetailsContext);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const theme = useTheme();

  async function handleDelete() {
    const { value: isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.secondary.dark,
      cancelButtonColor: theme.palette.error.light,
      confirmButtonText: "Yes, delete it!",
      inputLabel: "Enter Project ID",
      inputPlaceholder: "Project ID",
      input: "text",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter a project ID";
        }
        if (value !== projectDetails.pid) {
          return "Project ID does not match";
        }
      },
    });

    if (isConfirmed) {
      setLoading(true);
      deleteNEARProject(projectDetails.pid)
        .then((canDelete) => {
          if (canDelete) {
            navigate("/");
          } else {
            Swal.fire({
              title: "Error",
              text: "Unable to delete project",
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <>
      <Backdrop loading={loading} />
      <img src={CodeImage} alt="Code" style={classes.img} />
      {/* TODO Change to Name */}
      <Typography variant="h1" sx={classes.h1}>
        Welcome to
      </Typography>
      <Typography variant="h3" sx={classes.h3}>
        {projectDetails.pid}
      </Typography>
      <Box sx={classes.buttonContainer}>
        <ConfigFile />
        <Button
          startIcon={<GitHubIcon />}
          variant="outlined"
          sx={{ marginLeft: "5%" }}
          onClick={() =>
            window.open("https://github.com/Three0Org/JS-SDK", "_blank").focus()
          }
        >
          Visit Docs
        </Button>
      </Box>
      <Box sx={classes.buttonContainer}>
        <Button
          color="error"
          onClick={() => handleDelete()}
          startIcon={<DeleteForeverIcon />}
        >
          Delete Project
        </Button>
      </Box>
    </>
  );
}
