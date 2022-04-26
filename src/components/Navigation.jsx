import {useParams, useNavigate, useLocation} from "react-router-dom";
import {useEffect } from "react";
import React from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import KeyIcon from '@mui/icons-material/Key';
import {Box, List, ListItem, ListItemIcon, ListItemText} from '@mui/material'
import { useTheme } from '@material-ui/core/styles';

export function Navigation() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const tabs = ['Authentication', 'Database',  'Storage', 'Settings']
    const tabIcon = [ <KeyIcon />, <StorageIcon />, <FolderIcon />, <SettingsIcon />]

    let navigate = useNavigate();
    let params = useParams().pid;

    const location = useLocation();

    const theme = useTheme();

  console.log(theme);


    useEffect(() => {
        const path = location.pathname.split('/');
        let index = tabs.map(tab => tab.toLowerCase()).indexOf(path[3]);
        setSelectedIndex(index == -1 ? 0 : index);
    }, []);

    const switchLink = (index) => {
        let url = '';
        setSelectedIndex(index);
        switch (index) {
            case 0:
                url = `/app/${params}/auth`;
                break;
            case 1:
                url = `/app/${params}/database`;
                break;
            case 2:
                url =`/app/${params}/storage`;
                break;
            case 3:
                url = `/app/${params}/settings`;
                break;
            default:
                url = `/app/${params}/auth`;
                break;
        }
        navigate(url);
    }

    return (
        <Box sx={{bgcolor: "#7d68d1", height: "calc(100vh - 56px)"}}>
            <List>
                {tabs.map((tab, index) => (
                    <ListItem button key={tab} style={{color: 'white'}} onClick={() => switchLink(index)}>
                        <ListItemIcon  style={{color: 'white'}} >{tabIcon[index]}</ListItemIcon>
                        <ListItemText primary={tab}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}