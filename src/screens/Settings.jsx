import React from 'react';
import {FormControl, FormLabel, TextField, FormControlLabel, MenuItem, Menu, Button, Grid, Typography, Box} from "@material-ui/core"
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {useParams, useNavigate} from 'react-router-dom';
import { ConfigFile } from '../components/ConfigFile';
import {ProjectDetailsContext} from '../ProjectDetailsContext';

export function Settings(props){
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
    <Box style={{margin: "2%"}}>
        <FormControl fullWidth>
            <FormLabel>Name</FormLabel>
            <TextField
                onChange={handleNameChange}
                name='name'
                placeholder='Project name'
                width='100%'
                value={name}
            />
        </FormControl>
        <FormControl fullWidth>
            <FormLabel>Description</FormLabel>
            <TextField
                onChange={handleDescriptionChange}
                name='name'
                placeholder='Project desc'
                width='100%'
                value={description}
            />
        </FormControl>
        <div style = {{display: "flex", justifyContent: "space-between"}}>
          <ConfigFile />
          <div>
            <Button isLoading={updateLoading}  size="large"  color='success' onClick={updateProject}><SaveIcon style={{marginRight: "4%"}}/> Save</Button>
            <Button isLoading={deleteLoading}  size="large"  color='error' onClick={deleteProject}><DeleteIcon style={{marginRight: "4%"}}/> Delete</Button>
          </div>
        </div>
    </Box>
  );
}
