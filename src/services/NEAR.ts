/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import {
	keyStores,
	transactions,
	KeyPair,
	utils,
	// eslint-disable-next-line no-unused-vars
	providers,
	Account,
} from 'near-api-js'
// eslint-disable-next-line import/no-unresolved
import NEAR_CONTRACT from 'url:../contract-wasms/near.wasm'
// eslint-disable-next-line import/no-unresolved
import NEAR_STORAGE_CONTRACT from 'url:../contract-wasms/near-storage.wasm'
// eslint-disable-next-line import/no-unresolved
import NEAR_HOSTING_CONTRACT from 'url:../contract-wasms/near-hosting.wasm'
// eslint-disable-next-line import/no-unresolved
import NEAR_TOKEN_CONTRACT from 'url:../contract-wasms/near-token.wasm'
import { nearConfig } from '../utils'
import { tokenMetadata } from '../views/Token'

export async function generateKey(name: string) {
	const keyPair = KeyPair.fromRandom('ed25519')
	const publicKey = keyPair.getPublicKey()
	await new keyStores.BrowserLocalStorageKeyStore().setKey(
		nearConfig.networkId,
		name,
		keyPair
	)

	return publicKey
}

export async function createNEARAccount(
	name: string,
	amount: string,
	parentAccount: Account
) {
	const publicKey = await generateKey(name)
	await parentAccount.createAccount(
		name,
		publicKey,
		utils.format.parseNearAmount(amount)
	)
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

export async function createNEARProjectAccount() {
	const { pid } = JSON.parse(localStorage.getItem('projectDetails') || '{}')

	const publicKey = await generateKey(pid)

	await window.near.createAccount(pid, publicKey)
	// TODO: transfer some amount of NEAR to the account in mainnet

	await createNEARProjectReference()
	await deployNEARProjectContract()
}

export async function deleteNEARProject(pid: string) {
	try {
		const canDelete = await window.contract.delete_project({
			contract_address: pid,
		})
		if (!canDelete) return false
		const account = await window.near.account(pid)

		await account.deleteAccount(
			nearConfig.networkId === 'testnet'
				? 'v1.faucet.nonofficial.testnet'
				: window.accountId
		)

		const keyStore = new keyStores.BrowserLocalStorageKeyStore()

		await keyStore.removeKey(nearConfig.networkId, pid)
		await keyStore.removeKey(nearConfig.networkId, `web4.${pid}`)
		await keyStore.removeKey(nearConfig.networkId, `storage.${pid}`)

		return true
	} catch (e) {
		console.error(e)
	}
	return false
}

// export async function checkAccountStatus(hash: any) {
// 	const provider = new providers.JsonRpcProvider({ url: nearConfig.nodeUrl })

// 	const result = await provider.txStatus(hash, nearConfig.networkId)

// 	if (result.transaction_outcome.outcome.status.SuccessReceiptId) {
// 		await createNEARProjectReference()
// 		await deployNEARProjectContract()
// 	}

// 	return result.transaction.receiver_id
// }

export async function createStorageAccount(parentPID: string) {
	const parentAccount = await window.near.account(parentPID)
	await createNEARAccount(`storage.${parentPID}`, '16', parentAccount)
}

export async function deployStorageContract(parentPID: string) {
	const storageContract = `storage.${parentPID}`
	const storageAccount = await window.near.account(storageContract)

	const contract = await fetch(NEAR_STORAGE_CONTRACT)
	const buf = await contract.arrayBuffer()

	await storageAccount.signAndSendTransaction({
		receiverId: storageContract,
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
	await parentContract.set_storage()
}

export async function createHostingAccount(parentPID: string) {
	const parentAccount = await window.near.account(parentPID)
	await createNEARAccount(`web4.${parentPID}`, '9', parentAccount)
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
	await parentContract.set_hosting()
}

export async function createTokenAccount(parentPID: string) {
	const parentAccount = await window.near.account(parentPID)
	await createNEARAccount(`token.${parentPID}`, '9', parentAccount)
}

export async function deployTokenContract(
	parentPID: string,
	metadata: tokenMetadata,
	totalSupply: string,
	exchangeRate: string
) {
	const wallet = `token.${parentPID}`
	const tokenAccount = await window.near.account(wallet)

	const contract = await fetch(NEAR_TOKEN_CONTRACT)
	const buf = await contract.arrayBuffer()

	await tokenAccount.signAndSendTransaction({
		receiverId: wallet,
		actions: [
			transactions.deployContract(new Uint8Array(buf)),
			transactions.functionCall(
				'new',
				{
					owner_id: parentPID,
					initial_supply: totalSupply,
					exchange_rate: exchangeRate,
					metadata,
				},
				10000000000000,
				'0'
			),
		],
	})
}

export async function addTokenization(
	parentContract: any,
	metadata: tokenMetadata,
	totalSupply: string,
	exchangeRate: string
) {
	await createTokenAccount(parentContract.contractId)
	await deployTokenContract(
		parentContract.contractId,
		metadata,
		totalSupply,
		exchangeRate
	)
	parentContract.set_tokenization()
}
