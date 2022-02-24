import {Dialog, FormField, TextInput, Textarea, Combobox} from 'evergreen-ui';
import React from 'react';
import {useNavigate} from 'react-router-dom';

export function CreateProjectModal(props){
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [blockchainNetwork, setBlockchainNetwork] = React.useState(false);
    const [addLoading, setAddLoading] = React.useState(false);

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

    function handleBlockchainNetworkChange(e){
        setBlockchainNetwork(e.target.value);
    }

    let navigate = useNavigate();

    async function createProject(){
        try{
            setAddLoading(true);
            await window.contract.createProject({
                name: name,
                description: description,
                // blockchainNetwork: blockchainNetwork
            });
            setAddLoading(false);
            props.closeModal();
            navigate('/app');
        } catch(e){
            console.error(e);
        }
    }

    return (
        <Dialog
            isConfirmLoading={addLoading}
            isShown={props.isShown}
            title="Create Project"
            onCloseComplete={props.closeModal}
            preventBodyScrolling
            confirmLabel="Create"
            onConfirm={createProject}
        >
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
            <FormField label='Blockchain Network:'>
            <Combobox
                initialSelectedItem={'NEAR'}
                items={['NEAR']}
                width='100%'
                onChange={handleBlockchainNetworkChange}
            />
            </FormField>
        </Dialog>
    )

}