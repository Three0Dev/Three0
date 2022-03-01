import * as IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import {config as Config} from '../config'
import {NearIdentityProvider} from './NearIdentityProvider'
import IdentityProvider from "orbit-db-identity-provider";

let ipfs;

// OrbitDB instance
let orbitdb

// Databases
let programs

IdentityProvider.addIdentityProvider(NearIdentityProvider)

// Start IPFS
export const initIPFS = async () => {
  if(!ipfs){
    ipfs = await IPFS.create(Config.ipfs)
  }
  return ipfs
}

// Start OrbitDB
export const initOrbitDB = async (ipfs) => {
  if(!orbitdb){
    const identity = await IdentityProvider.createIdentity({ type: `NearIdentity`})
    orbitdb = await OrbitDB.createInstance(ipfs, {identity})  }
  return orbitdb
}

export const getAllDatabases = async (pid) => {
  console.log('Getting all databases for project: ', pid)
  if(programs){
    await programs.close();
    programs = null;
  }
  if (!programs && orbitdb) {
    console.log(orbitdb.identity)
    // Load programs database
    programs = await orbitdb.feed(`three0-${pid}`, {
      accessController: { write: [orbitdb.identity.id] },
      create: true
    })

    await programs.load()
  }

  return programs ? programs.iterator({ limit: -1 }).collect() : []
}

export const getDB = async (address) => {
  let db
  if (orbitdb) {
    db = await orbitdb.open(address)
    await db.load()
  }
  return db
}

export const addDatabase = async (address) => {
  const db = await orbitdb.open(address)
  return programs.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now()
  })
}

export const createDatabase = async (name, type, permissions, pid, overwrite = false) => {
  let accessController

  console.log(orbitdb.identity.id)

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
    type,
    address: db.address.toString(),
  }

  console.log(dbDetails)

  await window.contract.addDatabase({
    details: dbDetails,
    pid: pid
  });

  return programs.add({
    ...dbDetails,
    added: Date.now()
  })
}

export const removeDatabase = async (hash, program, pid) => {

 await window.contract.deleteDatabase({
    address: program.address,
    pid: pid
  });

  const db = await orbitdb.open(program.address)
  await db.drop()
  await db.close()

  return programs.remove(hash)
}

