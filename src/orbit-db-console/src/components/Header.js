import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Box,Typography, Toolbar, AppBar, styled, alpha, InputBase} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    primary: {
      main: '#6247aa'
    }
  }
});
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar theme={theme} color="primary" position="static">
          <Toolbar>
          <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              align="left"
          >
              Database
          </Typography>
          <Search>
              <SearchIconWrapper>
              <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              />
          </Search>
          </Toolbar>
      </AppBar>
    </Box>
  )
}
