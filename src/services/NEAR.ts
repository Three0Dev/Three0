import { keyStores, transactions, KeyPair, utils, providers } from 'near-api-js'
// eslint-disable-next-line import/no-unresolved
import NEAR_CONTRACT from 'url:../contract-wasms/near.wasm'
import { nearConfig } from '../utils'

export async function createNEARAccount() {
	const { pid } = JSON.parse(localStorage.getItem('projectDetails') || '{}')

	const keyPair = KeyPair.fromRandom('ed25519')
	const publicKey = keyPair.getPublicKey().toString()
	await new keyStores.BrowserLocalStorageKeyStore().setKey(
		nearConfig.networkId,
		pid,
		keyPair
	)

	await window.walletConnection
		.account()
		.createAccount(pid, publicKey, utils.format.parseNearAmount('6'))
}

export async function createNEARProject() {
	const { pid, blockchainNetwork } = JSON.parse(
		localStorage.getItem('projectDetails') || '{}'
	)

	await window.contract.create_project({
		chain_type: blockchainNetwork,
		contract_address: pid,
	})
}

export async function deployNEARProjectContract() {
	const { pid } = JSON.parse(localStorage.getItem('projectDetails') || '{}')
	localStorage.removeItem('projectDetails')
	const account = await window.near.account(pid)

	const contract = await fetch(NEAR_CONTRACT)
	const buf = await contract.arrayBuffer()

	await account.signAndSendTransaction({
		receiverId: pid,
		actions: [
			transactions.deployContract(new Uint8Array(buf)),
			transactions.functionCall('init', { pid }, 10000000000000, '0'),
		],
	})
}

export async function deleteNEARProject(pid: string) {
	try {
		const canDelete = await window.contract.delete_project({
			contract_address: pid,
		})
		if (canDelete) {
			const account = await window.near.account(pid)
			await account.deleteAccount(window.accountId)

			await new keyStores.BrowserLocalStorageKeyStore().removeKey(
				nearConfig.networkId,
				pid
			)

			return true
		}
	} catch (e) {
		console.error(e)
	}
	return false
}

export async function checkAccountStatus(hash: any) {
	const provider = new providers.JsonRpcProvider(
		`https://archival-rpc.${nearConfig.networkId}.near.org`
	)

	try {
		const result = await provider.txStatus(hash, window.accountId)

		if (
			result.transaction.actions.includes('CreateAccount') &&
			result.transaction_outcome.outcome.status.SuccessReceiptId 
		) {
			await createNEARProject()
			await deployNEARProjectContract()
		}

		return Promise.resolve(result.transaction.receiver_id)
	} catch (e) {
		console.error(e)
		return Promise.reject(e)
	}
}
