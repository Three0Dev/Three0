import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Fab, Typography, useTheme } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import notoken from '../assets/notoken.svg'
import { TokenForm } from '../components/token-components'
import ProjectDetailsContext from '../state/ProjectDetailsContext'

export default function Token() {
	const { projectDetails } = React.useContext(ProjectDetailsContext)

	const MySwal = withReactContent(Swal)
	const theme = useTheme()

	async function showTokenSwal() {
		await MySwal.fire({
			title: 'Add Tokenization',
			html: <TokenForm pid={projectDetails.pid} />,
			focusConfirm: false,
			confirmButtonColor: theme.palette.secondary.dark,
			confirmButtonText: 'Deploy',
			preConfirm: () => {
				const useDefault = (
					document.getElementById('default') as HTMLInputElement
				).checked
				if (useDefault) {
					return { useDefault }
				}
				const name = (document.getElementById('token-name') as HTMLInputElement)
					.value
				const symbol = (
					document.getElementById('token-symbol') as HTMLInputElement
				).value
				return { useDefault, name, symbol }
			},
		}).then(({ value: formValues }) => {
			if (!formValues) {
				return
			}
			// deploy token smart contract and call either new or new_default_meta
			if (formValues.useDefault) {
				console.log('call new_default_meta')
			} else {
				console.log('call new')
			}
		})
	}
	return (
		<>
			<img alt="notoken" src={notoken} className="majorImg" />
			<Typography
				variant="h2"
				style={{ textAlign: 'center', fontWeight: 'bold' }}
			>
				No Token Contract Deployed
			</Typography>
			<Fab
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
				color="primary"
				aria-label="add-storage"
				onClick={() => {
					showTokenSwal()
				}}
			>
				<AddIcon />
			</Fab>
		</>
	)
}
