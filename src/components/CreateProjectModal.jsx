import React from 'react';
import {useNavigate} from 'react-router-dom';
import {FormControl, FormLabel, TextField, FormControlLabel, MenuItem, Menu, Button, Grid, Typography} from "@material-ui/core"
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'

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
            let id = await window.contract.create_project({
                name,
                description,
           });
            setAddLoading(false);
            props.closeModal();
            navigate(`/app/${id}`);
        } catch(e){
            setAddLoading(false);
            props.closeModal();
            console.error(e);
        }
    }

    function closeModal(){
        setName('');
        setDescription('');
        props.closeModal();
    }

    return (   
        <Dialog
            open = {props.isShown}
            aria-labelledby="form-dialog-title"
            preventBodyScrolling
        >
            <DialogTitle>Create Project</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField

                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <FormLabel>Blockchain Network</FormLabel>
                            <TextField

                                select
                                // label="Blockchain Network"
                                variant="outlined"
                                fullWidth
                                value={blockchainNetwork}
                                onChange={handleBlockchainNetworkChange}
                            >
                                <MenuItem value={false}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={true}>
                                    NEAR
                                </MenuItem>
                            </TextField>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} disabled={addLoading}>Cancel</Button>
                <Button onClick={createProject}disabled={addLoading}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}