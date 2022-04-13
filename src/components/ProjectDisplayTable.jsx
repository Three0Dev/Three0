import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Pagination, Table, TableRow, Typography, TableHead, TableBody, TableCell, TableContainer, Paper,Drawer, Toolbar, Box, Divider, AppBar, IconButton, styled, alpha, CssBaseline, InputBase } from '@mui/material'
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
// import {useParams, useNavigate} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from "@material-ui/core";
const theme = createTheme({
    palette: {
      primary: {
        main: '#707070'
      },
      secondary: {
        main: '#7b1fa2'
      }
    }
  });
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
      // vertical padding + font size from searchIcon
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
    Paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    Drawer: {
        background: '#7b1fa2',
        // width: '100%',
        // height: '100%',
        // padding: theme.spacing(2),
        // display: 'flex',
        // flexDirection: 'column',
        // overflow: 'auto',
        // flexDirection: 'column',
        // marginTop: theme.spacing(2),
        // marginBottom: theme.spacing(2),
    },
}));

export function ProjectDisplayTable(){
    const classes = useStyles();
    let navigate = useNavigate();
    let [projects, setProjects] = React.useState({num: 0, entries: []});

    let [off, setPage] = React.useState(0);
    let updatePage = (e, val) => setPage((val-1)*limit_num);

    React.useEffect(() => {
        async function getProjects(){
            try{
                let projects_temp = await window.contract.get_all_projects({sender: window.contract.account.accountId, offset: off, limit: limit_num});
                setProjects(projects_temp);
            }catch(e){
                console.error(e);
            }
        }

        getProjects();
    }, [off]);

    console.log(projects)

    return (
        <Box sx={{display: 'flex'}} >
            
            {/* <Drawer
                variant="permanent"
                sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' , background:'white'},
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                
                <Divider />
                </Box>
            </Drawer> */}
            <Box component="main" sx={{ flexGrow: 1, p: 3}}>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar theme={theme} color="secondary" position="static">
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