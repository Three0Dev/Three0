import React from 'react'
import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import LaunchIcon from '@mui/icons-material/Launch'
import CloseIcon from '@mui/icons-material/Close'
import StorageIcon from '@mui/icons-material/Storage'
import IconButton from '@mui/material/IconButton'
import Swal from 'sweetalert2'
import {
	Table,
	TableBody,
	TableContainer,
	TableRow,
	TableCell,
	TableHeader,
} from '../templates/Table'

const colors = {
	eventlog: '#47B881',
	feed: '#14B5D0',
	keyvalue: '#1070CA',
	docstore: '#D9822B',
	counter: '#735DD0',
}

export default function ProgramList({ programs, onRemove }: any) {
	const navigate = useNavigate()

	function handleSelect(program: any) {
		const newPath = program.address.substring(1)
		navigate(`./${newPath}`)
	}

	function copyAddress(program: any) {
		const address = program.address.toString()
		navigator.clipboard.writeText(address || program.address)
		Swal.fire({
			title: 'Address copied to clipboard!',
			toast: true,
			timer: 1200,
		})
	}

	React.useEffect(() => {
		console.log(programs)
	}, [programs])

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHeader
					headers={[<LaunchIcon />, 'Name', 'Type', 'Address', <DeleteIcon />]}
				/>
				<TableBody>
					{programs.map((program: any) => (
						<TableRow key={`program-id-${program.address}`}>
							<TableCell>
								<IconButton onClick={() => handleSelect(program)}>
									<StorageIcon />
								</IconButton>
							</TableCell>
							<TableCell>{program.name}</TableCell>
							<TableCell
								sx={{
									color: colors[program.db_type as keyof typeof colors],
								}}
							>
								{program.db_type}
							</TableCell>
							<TableCell
								sx={{
									textOverflow: 'ellipsis',
									maxWidth: '200px',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
								}}
								onClick={() => copyAddress(program)}
							>
								{program.address.toString()
									? program.address.toString()
									: program.address}
							</TableCell>
							<TableCell>
								<IconButton onClick={() => onRemove(program)}>
									<CloseIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
