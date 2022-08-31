import React from 'react'
import Swal from 'sweetalert2'
import { Typography, Box, CircularProgress, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'
import withReactContent from 'sweetalert2-react-content'
import { useStateValue, actions } from '../state'
import { getAllDatabases, removeDatabase, createDatabase } from '../database'
import { ProgramList } from '../components/DatabaseList'
import CreateDialog from '../components/CreateDialog'
import ProjectDetailsContext from '../../../ProjectDetailsContext'
import Backdrop from '../../../components/templates/Backdrop'

export default function DatabasesView() {
	const [appState, dispatch] = useStateValue()
	const [loading, setLoading] = React.useState(false)
	const theme = useTheme()

	const { projectContract, projectDetails } = React.useContext(
		ProjectDetailsContext
	)

	const MySwal = withReactContent(Swal)

	async function fetchDatabases() {
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
		const programs = await getAllDatabases(projectDetails.pid)
		dispatch({
			type: actions.PROGRAMS.SET_PROGRAMS,
			programs: programs.reverse(),
		})
		dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
		return programs
	}

	const createDB = (args) => {
		console.log('Create database...', args)
		setLoading(true)
		createDatabase(
			projectContract,
			args.name,
			args.type,
			args.permissions,
			args.overwrite
		)
			.then(() => {
				fetchDatabases().then((data) => {
					console.log('Loaded programs', data)
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
				const name = document.getElementById('database-name').value
				if (name.includes(' '))
					Swal.showValidationMessage('No Spaces in Database Name')

				const typeElement = document.getElementById('database-type')
				const type = typeElement[typeElement.selectedIndex].value

				const permissionsElement = document.getElementById(
					'database-permissions'
				)
				const permissions =
					permissionsElement[permissionsElement.selectedIndex].value
				const overwrite = document.getElementById('database-overwrite').checked

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

	const handleRemoveDatabase = (hash, program) => {
		console.log('Remove database...', hash, program)
		setLoading(true)
		removeDatabase(projectContract, hash, program)
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
				<Box
					flex="1"
					overflow="auto"
					elevation={1}
					background="white"
					marginX={6}
				>
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
