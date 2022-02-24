import React from 'react';
import {FormField, TextInput, Textarea, Pane, DownloadIcon, DeleteIcon, SavedIcon, Button} from 'evergreen-ui';
import {useParams, useNavigate} from 'react-router-dom';

export function Settings(props){
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  let params = useParams();

  React.useEffect(() => {
    async function getProject(){
      try{
        const project = await window.contract.getProjectDetails({pid: params.pid});
        setName(project.name || "");
        setDescription(project.description || "");
      } catch(e){
        console.error(e);
      }
    }

    getProject();
  }, []);

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
    try{
        await window.contract.updateProject({
            pid: params.pid,
            name: name,
            description: description,
        });
    } catch(e){
        console.error(e);
    }
  }

  const navigate = useNavigate();

  async function deleteProject(){
      try{
          await window.contract.deleteProject({pid: params.pid});
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
          <Button size="large" ><DownloadIcon style={{marginRight: "4%"}}/> Download Config File</Button>
          <div>
            <Button size="large" onClick={updateProject}><SavedIcon style={{marginRight: "4%"}}/> Save</Button>
            <Button size="large" onClick={deleteProject}><DeleteIcon style={{marginRight: "4%"}}/> Delete</Button>
          </div>
        </div>
      </form>
    </Pane>
  );
}
