import React from 'react';
import {FormControl, TextField, makeStyles, createTheme} from "@material-ui/core"
import {Paper, AppBar, Toolbar, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {useParams, useNavigate} from 'react-router-dom';
import { ConfigFile } from '../components/ConfigFile';
import {ProjectDetailsContext} from '../ProjectDetailsContext';
import Swal from 'sweetalert2';


const useStyles = makeStyles((theme) => ({
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
  Text: {
    color: 'white',
    fontSize: '1.3rem',
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#6247aa'
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
  let {projectDetails, projectContract} = React.useContext(ProjectDetailsContext);

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
        await projectContract.update_project({
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
      const canDelete = await window.contract.delete_project({contract_address: params.pid});
      if(canDelete){
        const account = await window.near.account(params.pid);
        await account.deleteAccount(window.accountId);

        navigate('/app');
      }else{
        Swal.fire({
          title: 'Error',
          text: 'You can not delete this project',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
   
    } catch(e){
      console.error(e);
    }
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
          <AppBar theme={theme} color="primary" position="static">
              <Toolbar>
                <div className={classes.Text}>
                  Settings
                </div>
              </Toolbar>
          </AppBar>
      </Box>
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
                <LoadingButton theme={theme} loading={updateLoading} disabled={deleteLoading} startIcon={<SaveIcon/>} color="primary" onClick={updateProject}>Save</LoadingButton>
                <LoadingButton theme={theme} loading={deleteLoading} disabled={updateLoading} startIcon={<DeleteIcon/>} color="primary" onClick={deleteProject}>Delete</LoadingButton>
              </div>
            </div>
        </Box>
      </Paper>
    </div>
  );
}
