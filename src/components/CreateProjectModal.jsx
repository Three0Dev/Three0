import React from 'react';
import {useNavigate} from 'react-router-dom';
import {FormControl, TextField, MenuItem, Grid, makeStyles, createTheme} from "@material-ui/core"
import {Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';

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

export function CreateProjectModal(props){
    const classes = useStyles();
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
            className={classes.root}
            open = {props.isShown}
            aria-labelledby="form-dialog-title"
            preventBodyScrolling
        >
            <DialogTitle
                id="form-dialog-title"
            >
                Create Project
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField margin='dense'
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField margin='dense'
                            label="Description"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            {/* <FormLabel>Blockchain Network</FormLabel> */}
                            <TextField margin='dense'
                                select
                                label="Blockchain Network"
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
            <DialogActions className={classes.TableContainer}>
                <LoadingButton onClick={closeModal} color='secondary' disabled={addLoading}>Cancel</LoadingButton>
                <Button onClick={createProject} color='secondary' disabled={addLoading}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}