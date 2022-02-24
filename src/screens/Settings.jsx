import React from 'react';
import {FormField, TextInput, Textarea, Pane} from 'evergreen-ui';

export function Settings(props){
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

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
    
  return (
    <Pane style={{margin: "2%"}}>
      <form>
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
      </form>
    </Pane>
  );
}