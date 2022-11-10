import React, { useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Fab, useTheme } from '@mui/material'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as short from 'short-uuid'
import { ProjectDisplayBoard, CreateProjectDialog } from '../components/core'
import wave from '../assets/wave.svg'
import Backdrop from '../components/templates/Backdrop'
import { createNEARAccount, checkAccountStatus } from '../services/NEAR'

export default function ProjectsDash() {
	const [loading, setLoading] = React.useState(false)

	const [params] = useSearchParams()
	const navigate = useNavigate()
	const theme = useTheme()

	const MySwal = withReactContent(Swal)

	function handleCreateQueryParams() {
		const hash = params.get('transactionHashes')
		if (!hash) return

		setLoading(true)
		checkAccountStatus(hash)
			.then((pid) => navigate(`/${pid}`))
			.finally(() => setLoading(false))
	}

	async function showProjectSwal() {
		const uuid = short.generate().toLowerCase()

		const { value: formValues } = await MySwal.fire({
			title: 'Create Project',
			html: <CreateProjectDialog />,
			focusConfirm: false,
			confirmButtonColor: theme.palette.secondary.dark,
			preConfirm: () => {
				const name = (
					document.getElementById('project-name') as HTMLInputElement
				).value
				// eslint-disable-next-line no-useless-escape
				const nameRegex = /^(([a-z\d]+[\-_])*[a-z\d]+)$/

				const pid = `${name}-${uuid}.${window.accountId}`

				if (!nameRegex.test(name) || pid.length > 50) {
					Swal.showValidationMessage('Invalid Project Name')
				}

				const chainTypeElement: any = document.getElementById(
					'blockchain-type-selector'
				) as HTMLInputElement
				const chainType = chainTypeElement[chainTypeElement.selectedIndex].value
				return [pid, chainType]
			},
		})

		if (formValues) {
			localStorage.setItem(
				'projectDetails',
				JSON.stringify({
					pid: formValues[0],
					blockchainNetwork: formValues[1],
				})
			)
			setLoading(true)
			createNEARAccount()
		}
	}

	useEffect(() => {
		handleCreateQueryParams()
	}, [])

	return (
		<>
			<Backdrop loading={loading} />
			<ProjectDisplayBoard />
			<Fab
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
				color="primary"
				aria-label="create-project"
				onClick={() => showProjectSwal()}
			>
				<AddIcon />
			</Fab>
			<img
				alt="wavebackground"
				src={wave}
				style={{ position: 'fixed', bottom: 0 }}
			/>
		</>
	)
}
