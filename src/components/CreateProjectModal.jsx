import React from 'react';
import {FormControl, TextField, MenuItem, Grid, makeStyles, Select, InputLabel} from "@material-ui/core"
import {Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import {createNEARAccount} from "../services/NEAR";

const short = require('short-uuid');

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

export function CreateProjectModal(props){
    const classes = useStyles();
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [blockchainNetwork, setBlockchainNetwork] = React.useState("NEAR_TESTNET");

    const uuid = short.generate().toLowerCase();
    const nameRegex = /^(([a-z\d]+[\-_])*[a-z\d]+)$/;

    function handleNameChange(e){
        const name = e.target.value;
        const pid = `${name}-${uuid}.${window.accountId}`;

        if(pid.length <= 50){
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

    async function createProject(){
        if(!nameRegex.test(name)) return;
        const pid = `${name}-${uuid}.${window.accountId}`;

        localStorage.setItem("projectDetails", JSON.stringify({pid, name, description, blockchainNetwork}));
        createNEARAccount();
    }

    function closeModal(){
        setName('');
        setDescription('');
        props.closeModal();
    }

    return (   
        <Dialog
            className={classes.root}
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
                <TextField margin='dense'
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={description}
                    onChange={handleDescriptionChange}
                />
                <FormControl fullWidth>
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
                </FormControl>
            </DialogContent>
            <DialogActions className={classes.TableContainer}>
                <LoadingButton onClick={closeModal} color='secondary'>Cancel</LoadingButton>
                <Button onClick={createProject} color='secondary'>Create</Button>
            </DialogActions>
        </Dialog>
    )
}