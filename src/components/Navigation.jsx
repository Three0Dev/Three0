import React from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import KeyIcon from '@mui/icons-material/Key';
import {Tabs, Tab, Box} from '@mui/material'

export function Navigation() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const tabs = ['Auth', 'Database',  'Storage', 'Settings']
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
        <Box
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
        </Box>

    );
}