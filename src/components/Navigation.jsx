import React from "react";
import { Tablist, Tab } from 'evergreen-ui';
import {useParams, useNavigate} from "react-router-dom";

export function Navigation(props) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const tabs = ['Home', 'Auth', 'Database', 'Storage', 'Settings']

    let navigate = useNavigate();
    let params = useParams().pid;

    const switchLink = (index) => {
        let url = '';
        switch (index) {
            case 0:
                url = `/app/${params}`;
                break;
            case 1:
                url = `/app/${params}/auth`;
                break;
            case 2:
                url = `/app/${params}/database`;
                break;
            case 3:
                url =`/app/${params}/storage`;
                break;
            case 4:
                url = `/app/settings`;
                break;
            default:
                url = `/app/${params}`;
                break;
        }

        navigate(url);
    }

    return (
        <Tablist>
            {tabs.map((tab, index) => (
            <Tab
                key={tab}
                id={tab}
                onSelect={() => {
                    switchLink(index);
                }}
                isSelected={index === selectedIndex}
                aria-controls={`panel-${tab}`}
            >
                {tab}
            </Tab>
            ))}
        </Tablist>
    );
}