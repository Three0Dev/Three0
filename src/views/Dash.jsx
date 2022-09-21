import React from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { Contract } from 'near-api-js'
import { ProjectDetailsContext } from '../state/ProjectDetailsContext'
import Navigation from '../components/Navigation'

export default function Dash() {
	const { pid } = useParams()
	const navigate = useNavigate()

	const [projectDetails, setProjectDetails] = React.useState({})
	const [projectContract, setContract] = React.useState(null)

	async function isValidProject() {
		try {
			const account = await window.near.account(pid)
			const status = await account.state()

			return status.code_hash !== '11111111111111111111111111111111'
		} catch (e) {
			console.error(e)
			return false
		}
	}

	async function getProjectDetails() {
		const account = await window.near.account(pid)

		const projectContractInit = new Contract(account, pid, {
			viewMethods: ['get_project', 'get_users', 'get_user'],
			changeMethods: ['update_project', 'add_database', 'delete_database'],
		})

		const details = await projectContractInit.get_project({})
		setContract(projectContractInit)
		setProjectDetails(details)
	}

	React.useEffect(() => {
		isValidProject().then((isValid) => {
			if (isValid) {
				getProjectDetails()
			} else {
				navigate('/')
			}
		})
	}, [])

	const projectProviderValue = React.useMemo(
		() => ({ projectDetails, projectContract }),
		[projectDetails, projectContract]
	)

	return (
		<Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
			<Navigation />
			<ProjectDetailsContext.Provider value={projectProviderValue}>
				<div style={{ width: '98%', padding: '2% 1%' }}>
					<Outlet />
				</div>
			</ProjectDetailsContext.Provider>
		</Box>
	)
}
