import React from 'react'
import {Table, StatusIndicator, Tooltip, InfoSignIcon} from 'evergreen-ui'
import {ProjectDetailsContext} from '../ProjectDetailsContext';

function StatusExplanation(){
    return (
        <>
            <StatusIndicator color="success">Online</StatusIndicator>
            <StatusIndicator color="warning">Unknown</StatusIndicator>
            <StatusIndicator color="danger">Offline</StatusIndicator>
        </>
    )
}

export function ActiveUsers(props){
    let [profiles, setProfiles] = React.useState([]);

    let projectDetails = React.useContext(ProjectDetailsContext);

    React.useEffect(() => {
        if(projectDetails.users){
            setProfiles(Object.entries(projectDetails.users));
        }
    }, [projectDetails]);

    const cellWidth = "200px"

    return (
        <Table style={{margin: "2%"}}>
            <Table.Head>
                <Table.HeaderCell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>Status
                    <Tooltip
                        content={<StatusExplanation/>}
                        appearance="card"
                    >
                        <InfoSignIcon style={{marginLeft: "15px"}} />
                    </Tooltip>
                </Table.HeaderCell>
                <Table.TextHeaderCell>Account Identifier</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
                {profiles && profiles.map((profile) => (
                    <Table.Row key={profile.accountID}>
                        <Table.Cell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                            <StatusIndicator color={profile.isOnline ? 'success' : 'danger'} />
                        </Table.Cell>
                        <Table.TextCell>{profile.accountID}</Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}