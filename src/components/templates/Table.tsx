import React from 'react'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		color: theme.palette.common.white,
		backgroundColor: theme.palette.secondary.main,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.common.white,
	},
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.grey[300],
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}))

function TableHeader(props) {
	const item = props
	return (
		<TableHead>
			<TableRow>
				{item.headers.map((header) => (
					<StyledTableCell key={header}>{header}</StyledTableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

export {
	StyledTableCell as TableCell,
	StyledTableRow as TableRow,
	TableHeader,
	Table,
	TableBody,
	TableContainer,
}
