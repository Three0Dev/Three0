import React from "react";
import {Navigate, useParams} from "react-router-dom";



export function RedirectLogin(){
    let params = useParams();
    return (
        <Navigate to={`/login`} />
    );
}