import React from 'react';
import {FormField, TextInput, Textarea, Pane, DeleteIcon, SavedIcon, Button} from 'evergreen-ui';
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
        await window.contract.updateProject({
            pid: params.pid,
            name: name,
            description: description,
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
          await window.contract.deleteProject({pid: params.pid});
          setDeleteLoading(false);
          navigate('/app');
      } catch(e){
        console.error(e);
      }
  }

  return (
    <Pane style={{margin: "2%"}}>
        <FormField label='Name:'>
            <TextInput
                onChange={handleNameChange}
                name='name'
                placeholder='Project name'
                width='100%'
                value={name}
            />
        </FormField>
        <FormField label='Description:'>
            <Textarea
                onChange={handleDescriptionChange}
                name='name'
                placeholder='Project desc'
                width='100%'
                value={description}
            />
        </FormField>
        <div style = {{display: "flex", justifyContent: "space-between"}}>
          <ConfigFile />
          <div>
            <Button isLoading={updateLoading} appearance="primary" size="large" intent='success' onClick={updateProject}><SavedIcon style={{marginRight: "4%"}}/> Save</Button>
            <Button isLoading={deleteLoading} appearance="primary" size="large"  intent='danger' onClick={deleteProject}><DeleteIcon style={{marginRight: "4%"}}/> Delete</Button>
          </div>
        </div>
    </Pane>
  );
}
