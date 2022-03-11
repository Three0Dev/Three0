import React from 'react'
import {Table, StatusIndicator, Tooltip, InfoSignIcon, Heading, UserIcon} from 'evergreen-ui'
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

export function ActiveUsers(){
    let [profiles, setProfiles] = React.useState([]);

    let projectDetails = React.useContext(ProjectDetailsContext);
    React.useEffect(() => {
        if(projectDetails.users){
            setProfiles(Object.values(projectDetails.users));
        }
    }, [projectDetails]);

    const cellWidth = "200px"

    return (
        <div>
        <Heading size = {800} style={{width: "20%", marginLeft:"5%"}}>Authentication </Heading>
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
                    <Table.TextHeaderCell><UserIcon size={12} ></UserIcon>  Account Identifier</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body>
                    {profiles && profiles.map((profile) => (
                        <Table.Row key={profile.accountID}>
                            <Table.Cell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                                <StatusIndicator color={profile.isOnline ? 'success' : 'danger'} /> 
                            </Table.Cell>
                            <Table.TextCell >{profile.accountID}</Table.TextCell>
                        </Table.Row>
                        // <></>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}