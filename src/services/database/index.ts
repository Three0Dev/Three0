/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// TODO: Handle Identity Provider
import * as IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
// import IdentityProvider from 'orbit-db-identity-provider'
import { config as Config } from './config'
// import NearIdentityProvider from './NearIdentityProvider'

let ipfs: IPFS.IPFS

// OrbitDB instance
let orbitdb: OrbitDB

// Databases
let programs: Array<any>

let ipfsActivate = false

// const peerDBServer = 'https://pinning.three0dev.com/'

// IdentityProvider.addIdentityProvider(NearIdentityProvider)

// Start IPFS
export const initIPFS = async () => {
	if (!(ipfs || ipfsActivate)) {
		ipfsActivate = true
		ipfs = await IPFS.create(Config)
	}
	return ipfs
}

// Start OrbitDB
export const initOrbitDB = async (ipfsLocal: any) => {
	if (ipfs && !orbitdb) {
		// const identity = await IdentityProvider.createIdentity({
		// 	type: `NearIdentity`,
		// })

		// orbitdb = await OrbitDB.createInstance(ipfs, {identity})

		orbitdb = await OrbitDB.createInstance(ipfsLocal)
	}
	return orbitdb
}

export const getAllDatabases = async (projectContract: any) => {
	console.log('Getting all databases for project')
	if (orbitdb) {
		// Load programs database
		programs = await projectContract.get_databases({})
	}
	return programs || []
}

export const getDB = async (address: string) => {
	let db
	if (orbitdb) {
		db = await orbitdb.open(address)
		await db.load()
	}
	return db
}

export const addDatabase = async (address: any) => {
	const db = await orbitdb.open(address)
	return programs?.add({
		name: db.dbname,
		type: db.type,
		address,
		added: Date.now(),
	})
}

export const createDatabase = async (
	contract: {
		add_database: (arg0: {
			database_details: { name: any; address: any; db_type: any }
		}) => any
	},
	name: any,
	type: any,
	permissions: any,
	overwrite = false
) => {
	let accessController

	switch (permissions) {
		case 'public':
			accessController = { write: ['*'] }
			break
		default:
			accessController = { write: [orbitdb.identity.id] }
			break
	}

	const db = await orbitdb.create(name, type, { accessController, overwrite })

	const dbDetails = {
		name,
		address: db.address.toString(),
		db_type: type,
	}

	console.log(dbDetails)

	// await fetch(`${peerDBServer}pin?address=${db.address.toString()}`, {
	// 	method: 'POST',
	// 	mode: 'cors',
	// 	cache: 'no-cache',
	// 	credentials: 'same-origin', // include, *same-origin, omit
	// 	redirect: 'follow',
	// 	referrerPolicy: 'no-referrer',
	// })

	await contract.add_database({
		database_details: dbDetails,
	})
}

export const removeDatabase = async (
	contract: { delete_database: (arg0: { database_name: any }) => any },
	program: { address: any }
) => {
	console.log('Removing database')
	const db = await orbitdb.open(program.address)
	await db.drop()
	await db.close()

	// await fetch(`${peerDBServer}unpin?address=${program.address}`, {
	// 	method: 'POST',
	// 	mode: 'cors',
	// 	cache: 'no-cache',
	// 	credentials: 'same-origin', // include, *same-origin, omit
	// 	redirect: 'follow',
	// 	referrerPolicy: 'no-referrer',
	// })

	await contract.delete_database({
		database_name: program.address,
	})
}
