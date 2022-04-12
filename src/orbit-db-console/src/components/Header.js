import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
   Box,
   Typography, 
   TextField
} from '@mui/material'
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';


export function Header () {
  const navigate = useNavigate();

  function handleKeyUp (event) {
    // TODO: Do not use "ENTER" key as the trigger, maybe onSubmit of a form
    if (event.keyCode === 13){
      if(event.target.value.length > 0) {
        navigate(`./search?q=${event.target.value}`);
      }else{
        navigate('./');
      }
    }
  }

  return (
    <Box background='white' elevation={1}>
      <Box
        className='row-wrap'
        display='flex'
        borderBottom='default'
      >
        <Box
          className='align title'
          display='flex'
          flex='1 1 60%'
        >
          
          <Typography variant = "h4" color = "black" size={800}>
            Database
          </Typography>
        </Box>
        <Box
          className='align search'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
