import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, InputLabel} from '@mui/material'
import {createNEARAccount, createNEARProject} from "../services/NEAR";
import AddIcon from '@mui/icons-material/Add';

const short = require('short-uuid');

const classes = {
    root: {
        width: '100%',
        marginTop: 2,
        marginBottom: 2,
        overflowX: 'auto',
        justifyContent: 'center',
        display: 'flex',
    },
    actionContainer: {
        margin: 1,
    }
  };

export function CreateProjectModal(props){
    const [name, setName] = React.useState('');
    const [blockchainNetwork, setBlockchainNetwork] = React.useState("");

    const uuid = short.generate().toLowerCase();
    const nameRegex = /^(([a-z\d]+[\-_])*[a-z\d]+)$/;

    function handleNameChange(e){
        const name = e.target.value;
        const pid = `${name}-${uuid}.${window.accountId}`;

        if(pid.length <= 50){
            setName(e.target.value);
        }
    }

    function handleBlockchainNetworkChange(e){
        setBlockchainNetwork(e.target.value);
    }

    async function createProject(){
        if(!nameRegex.test(name)) return;
        const pid = `${name}-${uuid}.${window.accountId}`;

        if(blockchainNetwork === "") return;

        localStorage.setItem("projectDetails", JSON.stringify({pid, blockchainNetwork}));
        await createNEARProject();
        createNEARAccount();
    }

    function closeModal(){
        setName('');
        props.closeModal();
    }

    return (   
        <Dialog
            sx={classes.root}
            open = {props.isShown}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle
                id="form-dialog-title"
            >
                Create Project
            </DialogTitle>
            <DialogContent>
                <TextField margin='dense'
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                />
                <InputLabel id="demo-simple-select-label">Blockchain Network</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    variant="outlined"
                    fullWidth
                    value={blockchainNetwork}
                    onChange={handleBlockchainNetworkChange}
                >
                    <MenuItem value="NEAR_TESTNET">
                        NEAR Testnet
                    </MenuItem>
                </Select>
            </DialogContent>
            <DialogActions sx={classes.actionContainer}>
                <Button onClick={closeModal} color='error'>Cancel</Button>
                <Button onClick={createProject} color='primary' variant="contained"><AddIcon />Create</Button>
            </DialogActions>
        </Dialog>
    )
}