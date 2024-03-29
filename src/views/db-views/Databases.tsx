/* eslint-disable no-console */
import React from 'react'
import Swal from 'sweetalert2'
import { Typography, Box, CircularProgress, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'
import withReactContent from 'sweetalert2-react-content'
import { useStateValue, actions } from '../../state/DatabaseState'
import {
	getAllDatabases,
	removeDatabase,
	createDatabase,
} from '../../services/database'
import ProgramList from '../../components/db-components/DatabaseList'
import CreateDialog from '../../components/db-components/CreateDialog'
import ProjectDetailsContext from '../../state/ProjectDetailsContext'
import Backdrop from '../../components/templates/Backdrop'

export default function DatabasesView() {
	const [appState, dispatch] = useStateValue()
	const [loading, setLoading] = React.useState(false)
	const theme = useTheme()

	const { projectContract } = React.useContext(ProjectDetailsContext)

	const MySwal = withReactContent(Swal)

	async function fetchDatabases() {
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
		const programs = await getAllDatabases(projectContract)
		dispatch({
			type: actions.PROGRAMS.SET_PROGRAMS,
			programs: programs.reverse(),
		})
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
		return programs
	}

	const createDB = (args: {
		name: any
		type: any
		permissions: any
		overwrite: any
	}) => {
		console.log('Create database...', args)
		setLoading(true)
		createDatabase(
			projectContract,
			args.name + '-' + projectDetails.pid,
			args.type,
			args.permissions,
			args.overwrite
		)
			.then(() => {
				fetchDatabases().then((data) => {
					console.log('Loaded programs', data)
					console.log(args.name + projectDetails.pid)
				})
				Swal.fire({
					title: 'Database Created!',
					text: 'You can now access the database',
					timer: 1200,
					toast: true,
				})
			})
			.catch((err) => {
				console.error('Error', err)
				Swal.fire({
					title: 'Oops...',
					text: 'Something went wrong!',
					timer: 1200,
					toast: true,
					icon: 'error',
				})
			})
			.finally(() => setLoading(false))
	}

	const handleCreateDatabase = () => {
		MySwal.fire({
			title: 'Create a new database',
			html: <CreateDialog />,
			focusConfirm: false,
			confirmButtonColor: theme.palette.secondary.dark,
			preConfirm: () => {
				const name = (
					document.getElementById('database-name') as HTMLInputElement
				).value
				if (name.includes(' '))
					Swal.showValidationMessage('No Spaces in Database Name')
				if (name.length === 0)
					Swal.showValidationMessage('Database Name Required')

				const typeElement = document.getElementById(
					'database-type'
				) as HTMLInputElement
				const type = typeElement[typeElement.selectedIndex].value

				const permissionsElement = document.getElementById(
					'database-permissions'
				) as HTMLInputElement
				const permissions =
					permissionsElement[permissionsElement.selectedIndex].value
				const overwrite = (
					document.getElementById('database-overwrite') as HTMLInputElement
				).checked

				return { name, type, permissions, overwrite }
			},
		}).then(({ value: formValues }) => {
			if (!formValues) {
				return
			}
			const args = {
				name: formValues.name,
				type: formValues.type,
				permissions: formValues.permissions,
				overwrite: formValues.overwrite,
			}
			createDB(args)
		})
	}

	const handleRemoveDatabase = (program: any) => {
		console.log('Remove database...', program.address)
		setLoading(true)
		removeDatabase(projectContract, program)
			.then(() => {
				console.log('Removed')
				fetchDatabases().then((data) => {
					console.log('Loaded programs', data)
				})
				Swal.fire({
					title: 'Database Deleted!',
					timer: 1200,
					toast: true,
				})
			})
			.catch((err) => {
				console.error('Error', err)
				Swal.fire({
					title: 'Oops...',
					text: 'Something went wrong!',
					timer: 1200,
					toast: true,
					icon: 'error',
				})
			})
			.finally(() => setLoading(false))
	}

	return (
		<>
			<Box display="flex" justifyContent="center" overflow="auto">
				<Box flex="1" overflow="auto" marginX={6}>
					{!appState.loading.programs ? (
						<ProgramList
							programs={appState.programs}
							onRemove={handleRemoveDatabase}
						/>
					) : (
						<Box
							display="flex"
							flexDirection="column"
							alignItems="center"
							marginTop={3}
							marginBottom={1}
						>
							<CircularProgress size={24} />
							<Typography variant="body1" color="textSecondary">
								Loading...
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
			{appState.programs && (
				<Fab
					color="primary"
					aria-label="add"
					disabled={loading}
					onClick={handleCreateDatabase}
					sx={{
						position: 'fixed',
						bottom: 16,
						right: 16,
					}}
				>
					<AddIcon />
				</Fab>
			)}
			<Backdrop loading={loading} />
		</>
	)
}
