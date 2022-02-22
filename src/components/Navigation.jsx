import React from "react";
import { Tablist, Tab, HomeIcon, DatabaseIcon, FolderOpenIcon, SettingsIcon, KeyIcon} from 'evergreen-ui';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";

export function Navigation(props) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const tabs = ['Auth', 'Database', 'Home', 'Storage', 'Settings']
    const tabIcon = [<KeyIcon />, <DatabaseIcon />, <HomeIcon />, <FolderOpenIcon />, <SettingsIcon />]

    let navigate = useNavigate();
    let params = useParams().pid;

    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/');
        setSelectedIndex(tabs.map(tab => tab.toLowerCase()).indexOf(path[path.length-1]));
    }, []);


    const switchLink = (index, load = false) => {
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
                url = `/app/${params}`;
                break;
            case 3:
                // Disabled for Hackathon
                // url =`/app/${params}/storage`;
                break;
            case 4:
                url = `/app/settings`;
                break;
            default:
                url = `/app/${params}`;
                break;
        }

        if(!load){
            navigate(url);
        }
    }

    return (
        <Tablist>
            {tabs.map((tab, index) => (
            <Tab
                key={tab}
                id={tab}
                style={{
                    width: "18%",
                    marginRight: "1%",
                    marginLeft: "1%",
                }}
                onSelect={() => {
                    switchLink(index);
                }}
                isSelected={index === selectedIndex}
                aria-controls={`panel-${tab}`}
            >
            <div style={{marginRight:"8%"}}>{tabIcon[index]}</div>
                {tab}
            </Tab>
            ))}
        </Tablist>
    );
}