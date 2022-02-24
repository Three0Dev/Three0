import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {Table, DatabaseIcon, UserIcon, Text, Button, PlusIcon} from "evergreen-ui"

export function ProjectDisplayTable(){
    let navigate = useNavigate();

    let [projects, setProjects] = React.useState([{
        pid: 1,
        name: "Project 1",
        numUsers: 10,
        numDatabases: 5
      }]);

    return (
        <Table>
            <Table.Head>
            <Table.TextHeaderCell><Text>Name</Text></Table.TextHeaderCell>
            <Table.TextHeaderCell><Text><UserIcon /> Users</Text></Table.TextHeaderCell>
            <Table.TextHeaderCell><Text><DatabaseIcon /> Databases</Text></Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
            {projects.map((project) => (
                <Table.Row key={project.pid} isSelectable onSelect={() => navigate(`/app/${project.pid}/auth`)}>
                <Table.TextCell>{project.name}</Table.TextCell>
                <Table.TextCell isNumber>{project.numUsers}</Table.TextCell>
                <Table.TextCell isNumber>{project.numDatabases}</Table.TextCell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
    )
}