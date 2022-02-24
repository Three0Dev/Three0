import React from "react";
import {Pane, Spinner} from "evergreen-ui";
import {Navigate, useParams} from "react-router-dom";



export function RedirectAuth(){
    let params = useParams();
    return (
        <Navigate to={`/app/${params.pid}/auth`} />
    );
}