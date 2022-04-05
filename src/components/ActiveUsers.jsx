import React from 'react'
// import ReactDOM from 'react-dom';
import { Table, StatusIndicator, Tooltip, InfoSignIcon, Heading, UserIcon } from 'evergreen-ui'
import { Pagination, CircleIcon } from '@mui/material'
// import SearchBar from 'material-ui-search-bar';
import { ProjectDetailsContext } from '../ProjectDetailsContext';

function StatusExplanation(){
    return (
        <>
            <StatusIndicator color="success">Online</StatusIndicator>
            <StatusIndicator color="warning">Unknown</StatusIndicator>
            <StatusIndicator color="danger">Offline</StatusIndicator>
        </>
    )
}

export function ActiveUsers(){
    let [profiles, setProfiles] = React.useState([]);
    let [userNumber, setUserNum] = React.useState(0);
    let [page, setPage] = React.useState(1);

    let updatePage = (e, val) => setPage((val-1)*20);

    let projectDetails = React.useContext(ProjectDetailsContext);
    React.useEffect(() => {
        if(projectDetails.users){
            async function getUsers(){
                try{
                let users = await window.contract.get_users({project_id: projectDetails.id});
                setProfiles(users);
                } catch(e){
                    console.error(e);
                }
            }
        }
    }, [projectDetails]);

    React.useEffect(() => {
        let tempNum = 0;
        profiles.map((num) => (tempNum = tempNum + 1));
        setUserNum(tempNum);
    });

    console.log(userNumber)

    const cellWidth = "200px"

    return (
        <div>
        <Heading size = {800} style={{width: "20%", marginLeft:"5%"}}>Authentication </Heading>
        {/* <SearchBar
            
        /> */}
            <Table style={{margin: "2%"}}>
                <Table.Head>
                    <Table.HeaderCell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}> Online Status
                        <Tooltip
                            content={<StatusExplanation/>}
                            appearance="card"
                        >
                            <InfoSignIcon style={{marginLeft: "15px"}} />
                        </Tooltip>
                    </Table.HeaderCell>
                    <Table.TextHeaderCell><UserIcon size={12} ></UserIcon>  Public Identifier</Table.TextHeaderCell>
                    <Table.TextHeaderCell>Account Created</Table.TextHeaderCell>
                    <Table.TextHeaderCell>Last Signed In</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body>
                    {profiles && profiles.map((profile) => (
                        <Table.Row key={profile.accountID}>
                            <Table.Cell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                                <StatusIndicator color={profile.isOnline ? 'success' : 'danger'} /> 
                            </Table.Cell>
                            <Table.TextCell >{profile.accountID}</Table.TextCell>
                            <Table.TextCell >Date</Table.TextCell>
                            <Table.TextCell >Date</Table.TextCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Pagination defaultPage={1} count={Math.floor(userNumber/6)+1} boundaryCount={2} onChange={updatePage} variant='outlined'> </Pagination>
            
        </div>
    );
}