import React from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';
import StorageIcon from '@mui/icons-material/Storage';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#616161",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const colors = {
   eventlog: '#47B881',
   feed: '#14B5D0',
   keyvalue: '#1070CA',
   docstore: '#D9822B',
   counter: '#735DD0'
}

export function ProgramList ({ programs, onRemove }) {
  const navigate = useNavigate()
  const { pid } = useParams()

  function handleSelect (program) {
    const newPath = program.address.substring(1)
    navigate(`./${newPath}`)
  }

  function copyAddress(program){
    navigator.clipboard.writeText(program.address.toString() ? program.address.toString() : program.address);
    Swal.fire({
      title: 'Address copied to clipboard!',
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell><LaunchIcon /></StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Address</StyledTableCell>
            <StyledTableCell>Added</StyledTableCell>
            <StyledTableCell>
              <DeleteIcon />
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.map(e => {
            const program = e.payload.value
            return (
              <StyledTableRow key={`program-id-${program.address}`}>
                <StyledTableCell
                >
                  <IconButton
                    onClick={() => handleSelect(program)}
                  >
                    <StorageIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell>{program.name}</StyledTableCell>
                <StyledTableCell sx={{
                  color: colors[program.type]
                  }}>
                  {program.type}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                  }}
                  onClick={() => copyAddress(program)}
                >{program.address.toString() ? program.address.toString() : program.address}</StyledTableCell>
                <StyledTableCell>{program.added ? formatDistanceToNow(program.added) + ' ago': 'Unknown'}</StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    onClick={() => onRemove(e.hash, program)}
                  >
                    <CloseIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  )
}