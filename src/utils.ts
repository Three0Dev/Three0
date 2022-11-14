import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { formatDistanceToNow } from 'date-fns'
import getNEARConfig from './config'

export const nearConfig = getNEARConfig(process.env.NODE_ENV || 'testnet')

// Initialize contract & set global variables
export async function initContract() {
	// Initialize connection to the NEAR testnet
	const near = await connect({
		keyStore: new keyStores.BrowserLocalStorageKeyStore(),
		...nearConfig,
	})

	window.near = near

	// Initializing Wallet based Account. It can work with NEAR testnet wallet that
	// is hosted at https://wallet.testnet.near.org
	window.walletConnection = new WalletConnection(near, null)

	// Getting the Account ID. If still unauthorized, it's just empty string
	window.accountId = window.walletConnection.getAccountId()

	window.contract = new Contract(
		window.walletConnection.account(),
		nearConfig.contractName,
		{
			viewMethods: ['get_all_projects', 'get_project'],
			changeMethods: ['create_project', 'delete_project'],
			// View methods are read only. They don't modify the state, but usually return some value.
			// Change methods can modify the state. But you don't receive the returned value when called.
		}
	)
}

export function logout() {
	window.walletConnection.signOut()
	// reload page
	window.location.replace(`${window.location.origin}/login`)
}

export function login() {
	const starter = window.location.origin
	window.walletConnection.requestSignIn({
		contractId: nearConfig.contractName,
		successUrl: `${starter}/`,
		failureUrl: `${starter}/login`,
	})
}

export function getContractRelativeDate(date: any) {
	return formatDistanceToNow(new Date(date / 1000000))
}
