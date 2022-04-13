import React from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import KeyIcon from '@mui/icons-material/Key';
import {Tabs, Tab, Box} from '@mui/material'
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export function Navigation() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const tabs = ['Authentication', 'Database',  'Storage', 'Settings']
    const tabIcon = [ <KeyIcon />, <StorageIcon />, <FolderIcon />, <SettingsIcon />]

    let navigate = useNavigate();
    let params = useParams().pid;

    const location = useLocation();

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
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
    setValue(newValue);
  };

    return (
        <>
        {/* <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
      >
            <Tabs
            orientation="vertical"
            sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        label={tab}
                        icon={tabIcon[index]}
                        value={value}
                        onChange={handleChange}
                        onClick={() => {
                            switchLink(index);
                        }}
                        isSelected={index === selectedIndex}
                        aria-controls={`panel-${tab}`}
                    >
                    <div style={{marginRight:"15%"}}>{tabIcon[index]}</div>
                    {tab}
                    </Tab>
                ))}
            </Tabs>
        </Box> */}

        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ bgcolor: 'background.paper' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        {tabs[selectedIndex]}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" 
                variant="permanent"
                sx={{ bgcolor: 'background.paper', flexShrink: 0, width: 240,[`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', background:'#9763ad' }, }}
            >
                <Toolbar />
                <Box sx={{ bgcolor: '#9763ad', overflow:'auto' }}>
                    <List>
                        {tabs.map((tab, index) => (
                            <ListItem button key={tab} style={{color: 'white'}} onClick={() => {
                                switchLink(index);
                            }}>
                                <ListItemIcon  style={{color: 'white'}} >{tabIcon[index]}</ListItemIcon>
                                <ListItemText primary={tab}/>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </Box>


      </>                  
    );
}