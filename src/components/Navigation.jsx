import {useParams, useNavigate, useLocation} from "react-router-dom";
import {useEffect } from "react";
import React from "react";
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import KeyIcon from '@mui/icons-material/Key';
import {Box, List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';

export function Navigation() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const tabs = ['Home', 'Authentication', 'Database',  'Storage']
    const tabIcon = [<HomeIcon />,<KeyIcon />, <StorageIcon />, <FolderIcon />]

    let navigate = useNavigate();
    let {pid} = useParams();

    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/');
        let index = tabs.map(tab => tab.toLowerCase()).indexOf(path[3]);
        setSelectedIndex(index == -1 ? 0 : index);
    }, []);

    useEffect(() => {
        let url = `/app/${pid}`;
        switch (selectedIndex) {
            case 1:
                url += `/auth`;
                break;
            case 2:
                url += `/database`;
                break;
            case 3:
                url += `/storage`;
                break;
            default:
                break;
        }
        navigate(url);
    }, [selectedIndex]);

    return (
        <Box sx={{bgcolor: "primary.main"}}>
            <List component="nav">
                {tabs.map((tab, index) => (
                    <ListItemButton selected={index == selectedIndex} key={tab} style={{color: 'white'}} onClick={() => setSelectedIndex(index)}>
                        <ListItemIcon  style={{color: 'white'}} >{tabIcon[index]}</ListItemIcon>
                        <ListItemText primary={tab}/>
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}