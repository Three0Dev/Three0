import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Pagination, Table, TableRow, Typography, TableHead, TableBody, TableCell, TableContainer, Paper } from '@mui/material'
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
// import {useParams, useNavigate} from 'react-router-dom';

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
    table: {
        minWidth: 650,
    },
    TableContainer: {
        maxHeight: '100%',
        borderRadius: '10px',
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
        <div>
            <TableContainer component={Paper} className={classes.TableContainer}>   
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
                <Pagination className={classes.root} defaultPage={1} count={Math.floor(projects.num/(limit_num))+1} boundaryCount={2} onChange={updatePage} variant='outlined' shape="rounded"> </Pagination>
            </TableContainer>
        </div>
    )
}