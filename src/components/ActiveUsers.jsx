import React from 'react'
// import ReactDOM from 'react-dom';
import {Tooltip, Pagination, Badge, Table, TableCell, TableHead, TableBody, TableContainer, Typography, Paper, Toolbar, Box, AppBar, styled, alpha, InputBase, TableRow, IconButton } from '@mui/material'
import { makeStyles, createTheme } from "@material-ui/core";
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ProjectDetailsContext } from '../ProjectDetailsContext';
import SearchIcon from '@mui/icons-material/Search';

const theme = createTheme({
    palette: {
      primary: {
        main: '#7d68d1'
      }
    }
  });
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
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
    Badge: {
        margin: theme.spacing(1),
        borderRadius: '1px',
    },
}));
function StatusExplanation(){
    const classes = useStyles();
    return (
        <Box>
            <Badge 
                className={classes.Badge}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }} color="success" variant="dot">
                Online
            </Badge>
            <Badge 
                className={classes.Badge}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} 
                color="warning" variant="dot">
                    Unknown
                </Badge>
            <Badge 
                className={classes.Badge}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} 
                color="error"  variant="dot"> 
                Offline
            </Badge>
        </Box>
    )
}

export function ActiveUsers(){
    const classes = useStyles();
    let [profiles, setProfiles] = React.useState([]);
    let [userNumber, setUserNum] = React.useState(0);
    let [page, setPage] = React.useState(1);
    let projectDetails = React.useContext(ProjectDetailsContext);


    let updatePage = (e, val) => setPage((val-1)*20);
    async function getUsers(){
        try{
            let users = await window.contract.get_project_users({project_id: projectDetails.pid, offset: 0, limit: 10});
            setProfiles(users);
        } catch(e){
            console.error(e);
        }
    }

    async function searchUser(val){
        try{
            let user = await window.contract.get_user({project_id: projectDetails.pid, account_id: val});
            setProfiles([user]);
        } catch(e){
            // TODO SWAL ERROR
            setProfiles([]);
            console.error(e);
        }
    }

    React.useEffect(() => {
        if(projectDetails.num_users){
            getUsers();
        }
    }, [projectDetails]);

    React.useEffect(() => {
        setUserNum(profiles.length);
    }, [profiles]);

    const cellWidth = "200px"

    return (
        <div>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar theme={theme} color="primary" position="static">
                        <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            align="left"
                        >
                            Active Users
                        </Typography>
                        <Tooltip title="Refresh">
                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    getUsers();
                                }} 
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      searchUser(e.target.value);
                                    }
                                  }}
                                  onChange={(e) => {
                                      if(e.target.value === ""){
                                            getUsers();
                                        }
                                    }}
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        </Toolbar>
                    </AppBar>
                </Box>
                
            <TableContainer component ={Paper}className={classes.root}>
                <Table style={{margin: "2%"}}>
                    <TableHead>
                        <TableCell  
                                style={{
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }} 
                                flexBasis={cellWidth} flexShrink={0} flexGrow={0} > 
                            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', width: '100%'}}>
                                <Tooltip
                                    title={<StatusExplanation/>}
                                    appearance="card"
                                >
                                    <InfoIcon style={{marginLeft: "15px",}} />
                                </Tooltip>
                                <Typography fontWeight={'bold'}>Online Status</Typography>
                            </div>
                            
                        </TableCell>
                        <TableCell style={{
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', width: '100%'}}>
                                {/* <AccountCircleIcon size={12} ></AccountCircleIcon>  */}
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
                            <TableRow key={profile.account_id}>
                                <TableCell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                                    <Badge 
                                        className={classes.Badge}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }} 
                                        color={profile.is_online ? 'success' : 'warning'} variant="dot">

                                    </Badge>
                                </TableCell>
                                <TableCell >{profile.account_id}</TableCell>
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