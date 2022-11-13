/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import {
	keyStores,
	transactions,
	KeyPair,
	utils,
	providers,
	Account,
} from 'near-api-js'
import NEAR_CONTRACT from 'url:../contract-wasms/near.wasm'
import NEAR_STORAGE_CONTRACT from 'url:../contract-wasms/near-storage.wasm'
import NEAR_HOSTING_CONTRACT from 'url:../contract-wasms/near-hosting.wasm'
import { nearConfig } from '../utils'

export async function createNEARAccount(
	name: string,
	amount: string,
	parentAccount: Account
) {
	const keyPair = KeyPair.fromRandom('ed25519')
	const publicKey = keyPair.getPublicKey().toString()
	await new keyStores.BrowserLocalStorageKeyStore().setKey(
		nearConfig.networkId,
		name,
		keyPair
	)

	await parentAccount.createAccount(
		name,
		publicKey,
		utils.format.parseNearAmount(amount)
	)
}

export async function createNEARProjectAccount() {
	const { pid } = JSON.parse(localStorage.getItem('projectDetails') || '{}')
	const parentAccount = window.walletConnection.account()
	await createNEARAccount(pid, '7', parentAccount)
}

export async function createNEARProjectReference() {
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
	const provider = new providers.JsonRpcProvider(nearConfig.nodeUrl)

	const result = await provider.txStatus(hash, window.accountId)

	if (
		result.transaction.actions.includes('CreateAccount') &&
		result.transaction_outcome.outcome.status.SuccessReceiptId
	) {
		await createNEARProjectReference()
		await deployNEARProjectContract()
	}

	return result.transaction.receiver_id
}

export async function createHostingAccount(parentPID: string) {
	const parentAccount = await window.near.account(parentPID)
	await createNEARAccount(`web4.${parentPID}`, '8', parentAccount)
}

export async function deployHostingContract(parentPID: string) {
	const wallet = `web4.${parentPID}`
	const hostingAccount: Account = await window.near.account(wallet)

	hostingAccount.deployContract(
		new Uint8Array(await (await fetch(NEAR_HOSTING_CONTRACT)).arrayBuffer())
	)
}

export async function addHosting(parentContract: any) {
	await createHostingAccount(parentContract.contractId)
	await deployHostingContract(parentContract.contractId)
	await parentContract.set_hosting({
		hosting_account: `web4.${parentContract.contractId}`,
	})
}

export async function createStorageAccount(parentPID: string) {
	const parentAccount = await window.near.account(parentPID)
	await createNEARAccount(`storage.${parentPID}`, '16', parentAccount)
}

export async function deployStorageContract(parentPID: string) {
	const wallet = `storage.${parentPID}`
	const storageAccount = await window.near.account(wallet)

	const contract = await fetch(NEAR_STORAGE_CONTRACT)
	const buf = await contract.arrayBuffer()

	await storageAccount.signAndSendTransaction({
		receiverId: wallet,
		actions: [
			transactions.deployContract(new Uint8Array(buf)),
			transactions.functionCall(
				'new_default_meta',
				{ pid: parentPID },
				10000000000000,
				'0'
			),
		],
	})
}

export async function addStorage(parentContract: any) {
	await createStorageAccount(parentContract.contractId)
	await deployStorageContract(parentContract.contractId)
	await parentContract.set_storage({
		storage_account: `storage.${parentContract.contractId}`,
	})
}
