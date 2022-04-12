import React from "react";
import {Box, CircularProgress} from "@material-ui/core";

export function Redirect(props){
    React.useEffect(() => {
        window.location.href = props.url;
    }, []);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height={400}>
            <CircularProgress />
        </Box>
    );
}