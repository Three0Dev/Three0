import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Fab, Typography, useTheme } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import notoken from '../assets/notoken.svg'
import { TokenForm, TokenDash } from '../components/token-components'
import ProjectDetailsContext from '../state/ProjectDetailsContext'
import { addTokenization } from '../services/NEAR'
import Backdrop from '../components/templates/Backdrop'

export interface tokenMetadata {
	spec: string
	name: string
	symbol: string
	decimals: number
	icon?: string
}

export default function Token() {
	const [loading, setLoading] = React.useState(true)
	const [tokenAccount, setTokenAccount] = React.useState('')
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	)

	const MySwal = withReactContent(Swal)
	const theme = useTheme()

	projectContract.has_tokenization().then((hasTokenization: boolean) => {
		if (hasTokenization) {
			projectContract.get_tokenization().then((account: string) => {
				setTokenAccount(account)
				setLoading(false)
			})
			setLoading(false)
		}
	})

	async function showTokenSwal() {
		await MySwal.fire({
			title: 'Deploy Token Contract',
			html: <TokenForm pid={projectDetails.pid} />,
			focusConfirm: false,
			confirmButtonColor: theme.palette.secondary.dark,
			confirmButtonText: 'Deploy',
			preConfirm: () => {
				const supply = (
					document.getElementById('token-supply') as HTMLInputElement
				).value
				if (supply === '') {
					MySwal.showValidationMessage('Please enter an initial supply')
				}
				const name = (document.getElementById('token-name') as HTMLInputElement)
					.value
				if (name === '') {
					MySwal.showValidationMessage('Please enter a name')
				}
				const symbol = (
					document.getElementById('token-symbol') as HTMLInputElement
				).value
				if (symbol === '') {
					MySwal.showValidationMessage('Please enter a symbol')
				}
				const decimals = (
					document.getElementById('token-decimals') as HTMLInputElement
				).value
				if (decimals === '') {
					MySwal.showValidationMessage('Please enter significant digits')
				}
				const hasIcon = (
					document.getElementById('use-icon') as HTMLInputElement
				).checked
				if (!hasIcon) {
					return [supply, name, symbol, decimals]
				}
				try {
					const icon = (
						document.getElementById('token-icon-preview') as HTMLInputElement
					).src
					return [supply, name, symbol, decimals, icon]
				} catch (error: any) {
					MySwal.showValidationMessage('No icon selected')
				}
			},
		}).then(({ value: formValues }) => {
			if (!formValues) {
				return
			}
			const metadata: tokenMetadata = {
				spec: 'ft-1.0.0',
				name: formValues[1],
				symbol: formValues[2],
				decimals: parseInt(formValues[3], 10),
				icon: formValues.length === 5 ? formValues[4] : undefined,
			}
			// console.log(formValues)
			addTokenization(projectContract, metadata, formValues[0])
				.then(() => {
					setTokenAccount(`token.${projectDetails.pid}`)
				})
				.catch((error) => {
					if (error.type === 'NotEnoughBalance') {
						MySwal.fire({
							title: 'Not enough balance',
							text: `Your project account ${
								error.signer_id
							} needs an additional ${(
								error.cost -
								error.balance * 0.000000000000000000000001
							).toPrecision(3)} NEAR to cover the token subaccount creation`,
							icon: 'error',
							confirmButtonText: 'Ok',
						})
					}
					if (error.type === 'LackBalanceForState') {
						MySwal.fire({
							title: 'Not enough balance',
							text: `Your project account ${
								error.kind.signer_id
							} needs an additional ${(
								error.amount * 0.000000000000000000000001
							).toPrecision(
								3
							)} NEAR to cover the storage for contract deployment`,
							icon: 'error',
							confirmButtonText: 'Ok',
						})
					}
				})
		})
	}
	return loading ? (
		<Backdrop loading={loading} />
	) : (
		<>
			{tokenAccount !== '' && <TokenDash tokenAccount={tokenAccount} />}
			{tokenAccount === '' && (
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
						aria-label="add-token"
						onClick={() => {
							showTokenSwal()
						}}
					>
						<AddIcon />
					</Fab>
				</>
			)}
		</>
	)
}
