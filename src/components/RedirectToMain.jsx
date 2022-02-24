import React from "react";
import {Pane, Spinner} from "evergreen-ui";

export function Redirect(props){
    React.useEffect(() => {
        window.location.href = props.url;
    }, []);

    return (
        <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
            <Spinner />
        </Pane>
    );
}