import React from 'react';
import {FormControl, FormLabel, TextField, FormControlLabel, MenuItem, Menu, Grid, Typography, Box, makeStyles, createTheme} from "@material-ui/core"
import { Paper, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {useParams, useNavigate} from 'react-router-dom';
import { ConfigFile } from '../components/ConfigFile';
import {ProjectDetailsContext} from '../ProjectDetailsContext';

const useStyles = makeStyles((theme) => ({
  root: {
      width: '100%',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      overflowX: 'auto',
      justifyContent: 'center',
      display: 'flex',
  },
  table: {
      minWidth: 650,
  },
  TableContainer: {
      maxHeight: '100%',
      borderRadius: '10px',
      margin: theme.spacing(1),
      minWidth: 120,
  },
  Buttons: {
      margin: theme.spacing(1),
      borderRadius: '1px',
  },
  Paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
      width: '100%',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
  },
  Heading: {
      marginTop: theme.spacing(1),
  },
}));

const theme = createTheme({
  palette: {
    secondary: {
      main: '#7b1fa2'
    }
  }
});

export function Settings(props){
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  let params = useParams();
  let projectDetails = React.useContext(ProjectDetailsContext);

  React.useEffect(() => {
    setName(projectDetails.name);
    setDescription(projectDetails.description);
  }, [projectDetails]);

  function handleNameChange(e){
    const name = e.target.value;
    if(name.length <= 20){
        setName(e.target.value);
    }
  }

  function handleDescriptionChange(e){
      const desc = e.target.value;
      if(desc.length <= 100){
          setDescription(desc);
      }
  }

  async function updateProject(){
    setUpdateLoading(true);
    
    try{
        await window.contract.update_project({
            project_id: params.pid,
            project_name: name,
            project_description: description,
        });
        setUpdateLoading(false);
    } catch(e){
        console.error(e);
    }
  }

  const navigate = useNavigate();

  async function deleteProject(){
    setDeleteLoading(true);
      try{
          await window.contract.delete_project({project_id: params.pid});
          setDeleteLoading(false);
          navigate('/app');
      } catch(e){
        console.error(e);
      }
  }

  return (
    <div>
      <Typography className={classes.Heading} variant = "h4" style={{width: "20%", marginLeft:"2%"}}>Settings</Typography>
      <Paper className={classes.Paper}>
        <Box className={classes.TableContainer} style={{margin: "2%"}}>
            <FormControl fullWidth className={classes.TableContainer}>
                <TextField
                    label="Name"
                    onChange={handleNameChange}
                    name='name'
                    placeholder='Project name'
                    width='100%'
                    variant='outlined'
                    value={name}
                />
            </FormControl>
            <FormControl fullWidth className={classes.TableContainer}>
                <TextField
                    onChange={handleDescriptionChange}
                    label="Description"
                    name='name'
                    placeholder='Project desc'
                    width='100%'
                    value={description}
                    multiline
                    variant='outlined'
                    minRows={3}
                />
            </FormControl>
            <div style = {{display: "flex", justifyContent: "space-between"}} className={classes.Buttons}>
              <ConfigFile />
              <div>
                <Button theme={theme} isLoading={updateLoading} startIcon={<SaveIcon/>} color="secondary" onClick={updateProject}>Save</Button>
                <Button theme={theme} isLoading={deleteLoading} startIcon={<DeleteIcon/>} color="secondary" onClick={deleteProject}>Delete</Button>
              </div>
            </div>
        </Box>
      </Paper>
    </div>
  );
}
