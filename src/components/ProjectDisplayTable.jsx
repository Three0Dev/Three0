import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {Table, DatabaseIcon, UserIcon, Text, Button, PlusIcon, DeleteIcon, EditIcon} from "evergreen-ui"
import { Pagination } from '@mui/material'
import { useEffect } from "react";
// import {useParams, useNavigate} from 'react-router-dom';

export function ProjectDisplayTable(){
    let navigate = useNavigate();
    let [projects, setProjects] = React.useState([]);

    let [offset, setPage] = React.useState(1);
    let updatePage = (e, val) => setPage((val-1)*10);

    
    
    useEffect(() => {
        async function getProjects(){
            try{
                const projects = await window.contract.get_all_projects({sender: window.contract.account.accountId, offset: offset, limit: 10});
                setProjects(projects);
            }catch(e){
                console.error(e);
            }
        }

        getProjects();
    }, []);

    return (
        <div>
            <Table>
                <Table.Head>
                    <Table.TextHeaderCell><Text>Name</Text></Table.TextHeaderCell>
                    <Table.TextHeaderCell><Text>Description</Text></Table.TextHeaderCell>
                    <Table.TextHeaderCell><Text>Users</Text></Table.TextHeaderCell>
                    <Table.TextHeaderCell><Text>Databases</Text></Table.TextHeaderCell>
                </Table.Head>
                <Table.Body>
                {projects.map((project) => ( 
                    <Table.Row key={project.pid} isSelectable onSelect={() => navigate(`/app/${project.pid}/auth`)}>
                        <Table.TextCell><Text>{project.name}</Text></Table.TextCell>
                        <Table.TextCell>{project.description}</Table.TextCell>
                        <Table.TextCell isNumber>{project.num_users}</Table.TextCell>
                        <Table.TextCell isNumber>{project.num_databases}</Table.TextCell>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table>
            <Pagination defaultPage={1} count={Math.floor(projects.length/21)+1} boundaryCount={2} onChange={updatePage} variant='outlined'> </Pagination>
        </div>
    )
}