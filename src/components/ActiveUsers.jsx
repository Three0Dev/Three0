import React from 'react'
// import ReactDOM from 'react-dom';
import {Tooltip, Pagination, CircleIcon, Badge, Table, TableCell, TableHead, TableBody, TableContainer, Typography, Paper, Box, TextField} from '@mui/material'
import { makeStyles, Button } from "@material-ui/core";
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ProjectDetailsContext } from '../ProjectDetailsContext';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@material-ui/core/IconButton";


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
    },
    Heading: {
        marginTop: theme.spacing(1),
    },
}));
function StatusExplanation(){
    return (
        <>
            <Badge 
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }} color="success" variant="dot">Online</Badge>
            <Badge 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} 
                color="warning" variant="dot">Unknown</Badge>
            <Badge 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} 
                color="error"  variant="dot"> Offline</Badge>
        </>
    )
}

export function ActiveUsers(){
    const classes = useStyles();
    let [profiles, setProfiles] = React.useState([]);
    let [userNumber, setUserNum] = React.useState(0);
    let [page, setPage] = React.useState(1);

    let updatePage = (e, val) => setPage((val-1)*20);
    async function getUsers(){
        try{
        let users = await window.contract.get_users({project_id: projectDetails.id});
        setProfiles(users);
        } catch(e){
            console.error(e);
        }
    }
    let projectDetails = React.useContext(ProjectDetailsContext);
    React.useEffect(() => {
        if(projectDetails.users){
            getUsers();
        }
    }, [projectDetails]);

    React.useEffect(() => {
        let tempNum = 0;
        profiles.map((num) => (tempNum = tempNum + 1));
        setUserNum(tempNum);
    });

    console.log(userNumber)

    const cellWidth = "200px"

    return (
        <div>
            <Box
                display='flex'
                flex='1 1 60%'
            >
            <Typography className={classes.Heading} variant = "h4" style={{width: "20%", marginLeft:"0%"}}>
                Active Users
                {/* get active users refresh button */}
                <Tooltip title="Refresh">
                    <Button
                        size='large'
                        onClick={() => {
                            getUsers();
                        }}
                        startIcon={<RefreshIcon />}
                    >
                    </Button>
                </Tooltip>
            </Typography>
                <Box
                    className='align search'
                    display='flex'
                    alignItems='right'
                    justifyContent='right'
                >
                <TextField
                    InputProps={{
                    endAdornment: (
                        <InputAdornment>
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                        </InputAdornment>
                    )
                    }}
                />
                </Box>
            </Box>
            <TableContainer component ={Paper}className={classes.root}>
                <Table style={{margin: "2%"}}>
                    <TableHead>
                        <TableCell  
                                style={{
                                    // display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }} 
                                flexBasis={cellWidth} flexShrink={0} flexGrow={0} > 
                            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', width: '100%'}}>
                                <Tooltip
                                    content={<StatusExplanation/>}
                                    appearance="card"
                                >
                                    <InfoIcon style={{marginLeft: "15px"}} />
                                </Tooltip>
                                <Typography fontWeight={'bold'}>Online Status</Typography>
                            </div>
                            
                        </TableCell>
                        <TableCell style={{
                                    // display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', width: '100%'}}>
                                <AccountCircleIcon size={12} ></AccountCircleIcon> 
                                <Typography fontWeight={'bold'}>Public Identifier</Typography>
                            </div>
                        </TableCell>
                        <TableCell style={{
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                            <Typography fontWeight={'bold'}>Account Created</Typography>
                        </TableCell>
                        <TableCell style={{
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                            <Typography fontWeight={'bold'}>Last Signed In</Typography>
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {profiles && profiles.map((profile) => (
                            <TableRow key={profile.accountID}>
                                <TableCell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                                    <Badge color={profile.isOnline ? 'success' : 'danger'}/>
                                </TableCell>
                                <TableCell >{profile.accountID}</TableCell>
                                <TableCell > <Typography> Date </Typography></TableCell>
                                <TableCell ><Typography>Date</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>    
            <Pagination className = {classes.root} defaultPage={1} count={Math.floor(userNumber/6)+1} boundaryCount={2} onChange={updatePage} variant='outlined' shape='rounded'> </Pagination>
        </div>
    );
}