import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {Table, DatabaseIcon, UserIcon, Text, PlusIcon} from "evergreen-ui"
import { useEffect } from "react";

export function ProjectDisplayTable(){
    let navigate = useNavigate();
    let [projects, setProjects] = React.useState([]);

    useEffect(() => {
        async function getProjects(){
            try{
                const projects = await window.contract.getAllProjects({sender: window.contract.account.accountId});
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
                <Table.TextHeaderCell><Text><UserIcon /> Users</Text></Table.TextHeaderCell>
                <Table.TextHeaderCell><Text><DatabaseIcon /> Databases</Text></Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
            {projects.map((project) => (
                <Table.Row key={project.pid} isSelectable onSelect={() => navigate(`/app/${project.pid}/auth`)}>
                    <Table.TextCell><Text>{project.name}</Text></Table.TextCell>
                    <Table.TextCell>{project.description}</Table.TextCell>
                    <Table.TextCell isNumber>{project.numUsers}</Table.TextCell>
                    <Table.TextCell isNumber>{project.numDatabases}</Table.TextCell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
    )
}