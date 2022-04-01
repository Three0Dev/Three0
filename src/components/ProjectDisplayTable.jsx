import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {Table, DatabaseIcon, UserIcon, Text, Button, PlusIcon, DeleteIcon, EditIcon} from "evergreen-ui"
import { useEffect } from "react";
// import {useParams, useNavigate} from 'react-router-dom';

export function ProjectDisplayTable(){
    let navigate = useNavigate();
    let [projects, setProjects] = React.useState([]);

    useEffect(() => {
        async function getProjects(){
            try{
                const projects = await window.contract.get_all_projects({sender: window.contract.account.accountId});
                setProjects(projects);
            }catch(e){
                console.error(e);
            }
        }

        getProjects();
    }, []);

    return (
        
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
        
    )
}