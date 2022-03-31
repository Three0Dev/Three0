import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {Table, DatabaseIcon, UserIcon, Text, Button, PlusIcon, DeleteIcon, EditIcon} from "evergreen-ui"
import { useEffect } from "react";
// import {useParams, useNavigate} from 'react-router-dom';

export function ProjectDisplayTable(){
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    let navigate = useNavigate();
    let [projects, setProjects] = React.useState([]);
    let params = useParams();


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
    
    async function deleteProject(pid){
        setDeleteLoading(true);
          try{
              await window.contract.deleteProject({pid: pid});
              setDeleteLoading(false);
              navigate('/app');
          } catch(e){
            console.error(e);
          }
      }

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
                    <Table.TextCell isNumber>{project.numUsers}</Table.TextCell>
                    <Table.TextCell isNumber>{project.numDatabases}</Table.TextCell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
        
    )
}