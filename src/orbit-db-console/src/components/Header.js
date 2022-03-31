import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Heading,
  // Link,
  // Pane,
  SearchInput
} from 'evergreen-ui'

import {
  // majorScale,
  // Heading,
   Link,
   Box,
   Typography
  // SearchInput
} from '@mui/material'

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
          <Link 
            href='#/' 
            textDecoration='none' 
            display='flex' 
            flexDirection='row' 
            alignItems='center'
            underline='none'
            color = "black"
          >
            <Typography variant = "h4" color = "black" size={800}>
            Database
            </Typography>
          </Link>
        </Box>
        <Box
          className='align search'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <SearchInput
            width='100%'
            flex='1 1 100%'
            placeholder='Search...'
            height={24}
            onKeyUp={handleKeyUp}
          />
        </Box>
      </Box>
    </Box>
  )
}