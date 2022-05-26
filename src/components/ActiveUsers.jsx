import React from 'react'
import {Tooltip, Pagination, Badge, Typography, Toolbar, Box, AppBar, IconButton} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh';
import { ProjectDetailsContext } from '../ProjectDetailsContext';
import Backdrop from './templates/Backdrop';
import Search from './templates/Search';
import {TableHeader, TableCell, Table, TableBody, TableContainer, TableRow } from './templates/Table';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import nousers from '../assets/nousers.svg';

const classes = {
    root: {
        width: '100%',
        marginBottom: 2,
        overflowX: 'auto',
        justifyContent: 'center',
        display: 'flex',
        borderRadius: '10px',
    },
    Badge: {
        margin: 1,
        borderRadius: '1px',
    },
};

export function ActiveUsers(){
    let [profiles, setProfiles] = React.useState([]);
    let [page, setPage] = React.useState(1);
    let {projectDetails, projectContract} = React.useContext(ProjectDetailsContext);
    let [loading, setLoading] = React.useState(false);
    let [userNumber, setUserNum] = React.useState(0);

    let updatePage = (_e, val) => setPage((val-1)*20);

    function getUsers(){

        setLoading(true);

        projectContract.get_users({offset: page, limit: 10})
            .then(users => setProfiles(users))
            .catch(err => console.error(err)).finally(() => setLoading(false));
    }

    function searchUser(val){
        setLoading(true);

        projectContract.get_user({account_id: val})
            .then(user => setProfiles([user]))
            .catch(err => {
                console.error(err)
                setProfiles([])
            })
            .finally(() => setLoading(false));
    }

    // Todo change users schema
    React.useEffect(() => {
        getUsers();
        setUserNum(projectDetails.num_users);
    }, [projectDetails, page]);

    return (
        <>
        <Backdrop loading={loading}/>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar color="primary" position="static" sx={{borderRadius: 5}}>
                    <Toolbar>
                    <AccountCircleIcon />
                    &nbsp;
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
                    <Search
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
                        />
                    </Toolbar>
                </AppBar>
            </Box>
            
            {profiles.length != 0 && <><TableContainer sx={classes.root}>
                <Table style={{margin: "2%"}}>
                    <TableHeader headers={[<Typography>Online Status</Typography>, <Typography>Public Identifer</Typography>, <Typography>Account Created</Typography>, <Typography>Last Signed In</Typography>]} />
                    <TableBody>
                        {profiles.map((profile) => (
                            <TableRow key={profile.account_id}>
                                <TableCell flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                                    <Badge 
                                        sx={classes.Badge}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }} 
                                        color={profile.is_online ? 'success' : 'warning'} variant="dot">

                                    </Badge>
                                </TableCell>
                                <TableCell >{profile.account_id}</TableCell>
                                <TableCell>{profile.created_at}</TableCell>
                                <TableCell>{profile.last_online}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>    
            <Pagination sx={classes.root} defaultPage={1} count={Math.floor(userNumber/6)+1} boundaryCount={2} onChange={updatePage}> </Pagination></>}
            {profiles.length == 0 &&
                <> 
                    <img src={nousers} className="majorImg"/>
                    <Typography variant="h2" style={{textAlign: "center", fontWeight: 'bold'}}>No Users Yet!</Typography>
                </>
            }
        </>
    );
}