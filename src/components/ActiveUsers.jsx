import React from 'react'
// import ReactDOM from 'react-dom';
import {Backdrop, CircularProgress, Tooltip, Pagination, Badge, Table, TableCell, TableHead, TableBody, TableContainer, Typography, Paper, Toolbar, Box, AppBar, styled, alpha, InputBase, TableRow, IconButton, tableCellClasses } from '@mui/material'
import { makeStyles, createTheme } from "@material-ui/core";
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ProjectDetailsContext } from '../ProjectDetailsContext';
import SearchIcon from '@mui/icons-material/Search';

const theme = createTheme({
    palette: {
      primary: {
        main: '#6247aa'
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#616161",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
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
    let {projectDetails, projectContract} = React.useContext(ProjectDetailsContext);
    let [loading, setLoading] = React.useState(false);

    let updatePage = (e, val) => setPage((val-1)*20);
    async function getUsers(){
        try{
            setLoading(true);
            let users = await projectContract.get_users({offset: 0, limit: 10});
            setProfiles(users);
            setLoading(false);
        } catch(e){
            setLoading(false);
            console.error(e);
        }
    }

    async function searchUser(val){
        try{
            setLoading(true);
            let user = await projectContract.get_user({account_id: val});
            setProfiles([user]);
            setLoading(false);
        } catch(e){
            setProfiles([]);
            setLoading(false);
            console.error(e);
        }
    }

    React.useEffect(() => {
        getUsers();
    }, [projectDetails]);

    React.useEffect(() => {
        setUserNum(profiles.length);
    }, [profiles]);

    const cellWidth = "200px"

    return (
        <>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="inherit" />
      </Backdrop>
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
            
            <TableContainer component ={Paper} className={classes.root}>
                <Table style={{margin: "2%"}}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell  
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
                                        <InfoIcon/>
                                    </Tooltip>
                                    &nbsp;
                                    <Typography>Online Status</Typography>
                                </div>
                                
                            </StyledTableCell>
                            <StyledTableCell style={{
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}>
                                <Typography>Public Identifier</Typography>
                            </StyledTableCell>
                            <StyledTableCell style={{
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}>
                                <Typography>Account Created</Typography>
                            </StyledTableCell>
                            <StyledTableCell style={{
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}>
                                <Typography>Last Signed In</Typography>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {profiles && profiles.map((profile) => (
                            <StyledTableRow key={profile.account_id}>
                                <StyledTableCell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                                    <Badge 
                                        className={classes.Badge}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }} 
                                        color={profile.is_online ? 'success' : 'warning'} variant="dot">

                                    </Badge>
                                </StyledTableCell>
                                <StyledTableCell >{profile.account_id}</StyledTableCell>
                                <StyledTableCell > <Typography> Date </Typography></StyledTableCell>
                                <StyledTableCell ><Typography>Date</Typography></StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>    
            <Pagination className = {classes.root} defaultPage={1} count={Math.floor(userNumber/6)+1} boundaryCount={2} onChange={updatePage} variant='outlined' shape='rounded'> </Pagination>
        </>
    );
}