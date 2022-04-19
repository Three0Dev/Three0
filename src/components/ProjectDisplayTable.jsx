import React from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Table, TableRow, Typography, TableHead, TableBody, TableCell, TableContainer, Paper, Toolbar, Box, AppBar, styled, alpha, InputBase } from '@mui/material'
import { makeStyles } from "@material-ui/core";
import SearchIcon from '@mui/icons-material/Search';

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

    let [off, setPage] = React.useState(0);
    let updatePage = (e, val) => setPage((val-1)*limit_num);

    React.useEffect(() => {
        window.contract.get_all_projects({sender: window.contract.account.accountId, offset: off, limit: limit_num})
                .then(res => setProjects(res))
                .catch(err => console.error(err));
    }, [off]);

    console.log(projects)

    return (
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
                            />
                        </Search>
                        </Toolbar>
                    </AppBar>
                </Box>
                {/* <Toolbar /> */}
                <TableContainer className={classes.TableContainer}> 
                <Paper className={classes.Paper}>
                    <Table>
                        <TableHead>
                            <TableCell><Typography fontWeight={"bold"}>Name</Typography></TableCell>
                            <TableCell><Typography fontWeight={"bold"}>Description</Typography></TableCell>
                            <TableCell><Typography fontWeight={"bold"}>Users</Typography></TableCell>
                            <TableCell><Typography fontWeight={"bold"}>Databases</Typography></TableCell>
                        </TableHead>
                        <TableBody>
                        {projects.entries.map((project) => ( 
                            <TableRow key={project.pid} hover role="checkbox" onClick={() => navigate(`/app/${project.pid}/auth`)}>
                                <TableCell><Typography>{project.name}</Typography></TableCell>
                                <TableCell>{project.description}</TableCell>
                                <TableCell isNumber>{project.num_users}</TableCell>
                                <TableCell isNumber>{project.num_databases}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper> 
                <Pagination className={classes.root} defaultPage={1} count={Math.floor(projects.num/(limit_num))+1} boundaryCount={2} onChange={updatePage} variant='outlined' shape="rounded"> </Pagination>
            </TableContainer>
            </Box>
            
        </Box>
    )
}