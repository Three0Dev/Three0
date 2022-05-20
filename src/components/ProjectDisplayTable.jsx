import React from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Typography, Paper, Toolbar, Box, AppBar} from '@mui/material'
import { makeStyles } from "@material-ui/core";
import { formatDistanceToNow } from 'date-fns';
import SearchBar from "./templates/Search";
import {Table, TableBody, TableContainer, TableRow, TableCell, TableHeader} from './templates/Table';
import Backdrop from "./templates/Backdrop";

const limit_num = 5;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        overflowX: 'auto',
        justifyContent: 'center',
        display: 'flex',
    },
    TableContainer: {
        maxHeight: '100%',
        borderRadius: '10px',
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
}));

export function ProjectDisplayTable(){
    const classes = useStyles();
    let navigate = useNavigate();
    let [projects, setProjects] = React.useState({num: 0, entries: []});
    let [loading, setLoading] = React.useState(false);

    let [off, setPage] = React.useState(0);
    let updatePage = (_e, val) => setPage((val-1)*limit_num);

    React.useEffect(() => {
        getProjects();
    }, [off]);

    function getProjects(){
        window.contract.get_all_projects({owner: window.accountId, offset: off, limit: limit_num})
        .then(res => setProjects(res))
        .catch(err => console.error(err));
    }

    function searchProject(val){
        setLoading(true);
        window.contract.get_project({contract_address: val, account_id: window.accountId})
            .then(setProjects)
            .catch(err => {
                setProjects({num: 0, entries: []});
                console.error(err)
            }).finally(() => setLoading(false));
    }

    return (
        <>
            <Backdrop loading={loading} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex'}}>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar color="primary" position="static">
                        <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            Projects
                        </Typography>
                        <SearchBar
                            placeholder="Search…"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter')
                                    searchProject(e.target.value);
                            }}
                            onChange={(e) => {
                                if(e.target.value === "")
                                    getProjects();
                            }}
                        />
                        </Toolbar>
                    </AppBar>
                </Box>
                <TableContainer className={classes.TableContainer}> 
                <Paper className={classes.Paper}>
                    <Table>
                        <TableHeader headers={["Name", "Chain Type", "Created At"]}/>
                        <TableBody>
                        {projects.entries.map((project) => ( 
                            <TableRow key={project.contract_address} hover role="checkbox" onClick={() => navigate(`/app/${project.contract_address}/`)}>
                                <TableCell>{project.contract_address}</TableCell>
                                <TableCell>{project.chain_type}</TableCell>
                                <TableCell>{formatDistanceToNow(new Date(project.created_at/1000000)) + ' ago'}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper> 
                <Pagination 
                    className={classes.root} 
                    defaultPage={1} 
                    count={Math.floor(projects.num/(limit_num))+1} 
                    boundaryCount={2} 
                    onChange={updatePage} 
                    variant='outlined' 
                    shape="rounded"> 
                </Pagination>
            </TableContainer>
            </Box>
        </>
    )
}