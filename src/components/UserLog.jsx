import React from 'react'
import {Table, TableHead, TableCell, TableRow, TableBody} from '@mui/material'

export function UserLog(){
    const profiles = [];

    return (
        <Table style={{margin: "2%"}}>
            <TableHead>
                <TableCell>Wallet Address</TableCell>
            </TableHead>
            <TableBody>
                {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                        <TableCell>{profile.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}