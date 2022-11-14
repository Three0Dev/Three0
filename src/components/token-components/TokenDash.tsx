import { Contract } from 'near-api-js'

interface TokenDashProps {
	tokenAccount: string
}

export default function TokenDash({ tokenAccount }: TokenDashProps) {
	const contract = new Contract(
		window.walletConnection.account(),
		tokenAccount,
		{
			// View methods are read only. They don't modify the state, but usually return some value.
			viewMethods: ['ft_metadata', 'ft_balance_of'],
			// Change methods can modify the state. But you don't receive the returned value when called.
			changeMethods: ['storage_deposit', 'ft_transfer', 'ft_transfer_call'],
		}
	)
	// console.log("Hey")
	console.log(contract.ft_balance_of({ account_id: 'vlasp.testnet' }))

	return (
		<div>
			<h1>Token Dash</h1>
		</div>
	)
}
