import React from 'react'
// import ReactDOM from 'react-dom';
import {Tooltip, Pagination, CircleIcon, Badge, Table, TableCell, TableHead, TableBody, TableContainer, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import SearchBar from 'material-ui-search-bar';
import { ProjectDetailsContext } from '../ProjectDetailsContext';

function StatusExplanation(){
    return (
        <>
            <Badge 
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }} color="success" variant="dot">Online</Badge>
            <Badge 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} 
                color="warning" variant="dot">Unknown</Badge>
            <Badge 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} 
                color="error"  variant="dot"> Offline</Badge>
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
        {/* <Heading size = {800} style={{width: "20%", marginLeft:"5%"}}>Authentication </Heading> */}
        <Typography variant = "h3">Active Users</Typography>
        {/* <SearchBar
            
        /> */}
            <Table style={{margin: "2%"}}>
                <TableHead>
                    <TableCell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}> Online Status
                        <Tooltip
                            content={<StatusExplanation/>}
                            appearance="card"
                        >
                            <InfoIcon style={{marginLeft: "15px"}} />
                        </Tooltip>
                    </TableCell>
                    <TableCell><AccountCircleIcon size={12} ></AccountCircleIcon> <Typography>Public Identifier</Typography></TableCell>
                    <TableCell><Typography>Account Created</Typography></TableCell>
                    <TableCell><Typography>Last Signed In</Typography></TableCell>
                </TableHead>
                <TableBody>
                    {profiles && profiles.map((profile) => (
                        <TableRow key={profile.accountID}>
                            <TableCell flexBasis={cellWidth} flexShrink={0} flexGrow={0} style={{justifyContent: "center"}}>
                                {/* <StatusIndicator color={profile.isOnline ? 'success' : 'danger'} />  */}
                                <Badge color={profile.isOnline ? 'success' : 'danger'}/>
                            </TableCell>
                            <TableCell >{profile.accountID}</TableCell>
                            <TableCell > <Typography> Date </Typography></TableCell>
                            <TableCell ><Typography>Date</Typography></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination defaultPage={1} count={Math.floor(userNumber/6)+1} boundaryCount={2} onChange={updatePage} variant='outlined'> </Pagination>
            
        </div>
    );
}