import React from 'react'
import {Table, StatusIndicator, Tooltip, InfoSignIcon} from 'evergreen-ui'

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
    const profiles = [
        {
            id: 1,
            name: '0x1',
        }
    ];
    // let params = useParams();
    // let [users, setUsers] = React.useState([]);

    // useEffect(() => {
    //     async function getUsers(){
    //         try{
    //             const users = await window.contract.getAllUsers({pid: params.pid});
    //             setUsers(users);
    //         }catch(e){
    //             console.error(e);
    //         }
    //     }
    //     getUsers();
    // }, []);

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
                <Table.TextHeaderCell>Wallet Address</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
                {profiles.map((profile) => (
                    <Table.Row key={profile.id}>
                        <Table.Cell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}><StatusIndicator color="success"></StatusIndicator></Table.Cell>
                        <Table.TextCell>{profile.name}</Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}