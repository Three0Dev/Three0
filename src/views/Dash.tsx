/* eslint-disable no-console */
import React from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { Contract } from 'near-api-js'
import Swal from 'sweetalert2'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { Navigation } from '../components/core'

export default function Dash() {
	const { pid } = useParams()
	const navigate = useNavigate()

	const [projectDetails, setProjectDetails] = React.useState({})
	const [projectContract, setContract] = React.useState({})

	async function isValidProject() {
		try {
			const account = await window.near.account(pid as string)
			const status = await account.state()

			return status.code_hash !== '11111111111111111111111111111111'
		} catch (e) {
			console.error(e)
			return false
		}
	}

	async function getProjectDetails() {
		const account = await window.near.account(pid as string)

		const projectContractInit = new Contract(account, pid as string, {
			viewMethods: [
				'get_project',
				'get_users',
				'get_user',
				'get_databases',
				'get_storage',
				'get_hosting',
				'get_tokenization',
			],
			changeMethods: [
				'update_project',
				'add_database',
				'delete_database',
				'set_storage',
				'set_hosting',
				'set_tokenization',
				'set_nonce',
			],
		})

		const details = await projectContractInit.get_project()
		setContract(projectContractInit)
		setProjectDetails(details)
	}

	async function validityCheck(isValid: boolean) {
		if (isValid) {
			getProjectDetails()
		} else {
			try {
				await window.contract.delete_project({ contract_address: pid })
				navigate('/')
				Swal.fire({
					title: 'Error',
					text: 'Project does not exist, reference deleted',
					icon: 'error',
					confirmButtonText: 'Ok',
				})
			} catch (e) {
				Swal.fire({
					title: 'Error',
					text: 'There was an issue with deleting the project reference to the project that is DNE',
					icon: 'error',
					confirmButtonText: 'Ok',
				})
			}
		}
	}

	React.useEffect(() => {
		isValidProject().then((isValid) => {
			validityCheck(isValid)
		})
	}, [])

	const projectProviderValue = React.useMemo(
		() => ({ projectDetails, projectContract }),
		[projectDetails, projectContract]
	)

	return (
		<Box sx={{ display: 'flex', flex: 1 }}>
			<Navigation />
			<ProjectDetailsContext.Provider value={projectProviderValue}>
				<div style={{ width: '98%', padding: '2% 1%' }}>
					<Outlet />
				</div>
			</ProjectDetailsContext.Provider>
		</Box>
	)
}
