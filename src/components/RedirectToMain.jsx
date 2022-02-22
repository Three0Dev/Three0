import React from "react";
import {Pane, Spinner} from "evergreen-ui";

export function RedirectToMain(){
    React.useEffect(() => {
        window.location.href = "https://three0.umso.co/";
    }, []);

    return (
        <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
            <Spinner />
        </Pane>
    );
}