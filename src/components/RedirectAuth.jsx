import React from "react";
import {Navigate, useParams} from "react-router-dom";



export function RedirectAuth(){
    let params = useParams();
    return (
        <Navigate to={`/app/${params.pid}/auth`} />
    );
}