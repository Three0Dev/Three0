import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { formatDistanceToNow } from 'date-fns'
import getConfig from './config'

export const nearConfig = getConfig(process.env.NODE_ENV || 'localnet')

// Initialize contract & set global variables
export async function initContract() {
	// Initialize connection to the NEAR testnet
	const near = await connect({
		deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
		...nearConfig,
	})

	window.near = near

	// Initializing Wallet based Account. It can work with NEAR testnet wallet that
	// is hosted at https://wallet.testnet.near.org
	window.walletConnection = new WalletConnection(near)

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
	// Allow the current app to make calls to the specified contract on the
	// user's behalf.
	// This works by creating a new access key for the user's account and storing
	// the private key in localStorage.
	const starter = window.location.origin
	window.walletConnection.requestSignIn(
		nearConfig.contractName,
		'Three0',
		`${starter}/`,
		`${starter}/login`
	)
}

export function getContractRelativeDate(date) {
	return formatDistanceToNow(new Date(date / 1000000))
}
