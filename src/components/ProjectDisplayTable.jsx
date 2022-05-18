import React from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Table, Backdrop, CircularProgress, TableRow, Typography, TableHead, TableBody, TableCell, TableContainer, Paper, Toolbar, Box, AppBar, styled, alpha, InputBase } from '@mui/material'
import { makeStyles } from "@material-ui/core";
import SearchIcon from '@mui/icons-material/Search';
import { formatDistanceToNow } from 'date-fns';

const limit_num = 5;
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
    let updatePage = (e, val) => setPage((val-1)*limit_num);

    React.useEffect(() => {
        getProjects();
    }, [off]);

    function getProjects(){
        window.contract.get_all_projects({owner: window.accountId, offset: off, limit: limit_num})
        .then(res => setProjects(res))
        .catch(err => console.error(err));
    }

    async function searchProject(val){
        setLoading(true);

        try{
            const projectsSearch = await window.contract.get_project({contract_address: val, account_id: window.accountId});
            setProjects(projectsSearch);
        } catch(e){
            setProjects({num: 0, entries: []});
            console.error(e);
        }

        setLoading(false);

    }

    return (
        <>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="inherit" />
      </Backdrop>
        <Box sx={{display: 'flex'}} >
            <Box component="main" sx={{ flexGrow: 1, p: 3}}>
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
                        <Search>
                            <SearchIconWrapper>
                            <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        searchProject(e.target.value);
                                    }
                                }}
                                onChange={(e) => {
                                    if(e.target.value === ""){
                                        getProjects();
                                    }
                                }}
                            />
                        </Search>
                        </Toolbar>
                    </AppBar>
                </Box>
                <TableContainer className={classes.TableContainer}> 
                <Paper className={classes.Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography fontWeight={"bold"}>Name</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Chain Type</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Created</Typography></TableCell>
                                </TableRow>
                        </TableHead>
                        <TableBody>
                        {projects.entries.map((project) => ( 
                            <TableRow key={project.contract_address} hover role="checkbox" onClick={() => navigate(`/app/${project.contract_address}/`)}>
                                <TableCell>{project.contract_address}</TableCell>
                                <TableCell>{project.chain_type}</TableCell>
                                <TableCell>{formatDistanceToNow(new Date(project.created_at/1000000))}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper> 
                <Pagination className={classes.root} defaultPage={1} count={Math.floor(projects.num/(limit_num))+1} boundaryCount={2} onChange={updatePage} variant='outlined' shape="rounded"> </Pagination>
            </TableContainer>
            </Box>
        </Box>
        </>
    )
}