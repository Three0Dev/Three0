import React from 'react'
import {Table} from 'evergreen-ui'

export function UserLog(){
    const profiles = [];

    return (
        <Table style={{margin: "2%"}}>
            <Table.Head>
                <Table.TextHeaderCell>Wallet Address</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
                {profiles.map((profile) => (
                    <Table.Row key={profile.id}>
                        <Table.TextCell>{profile.name}</Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}