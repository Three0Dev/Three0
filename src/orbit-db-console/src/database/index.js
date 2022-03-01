import * as IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import {config as Config} from '../config'

let ipfs;

// OrbitDB instance
let orbitdb

// Databases
let programs

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
    orbitdb = await OrbitDB.createInstance(ipfs)
  }
  return orbitdb
}

export const getAllDatabases = async (pid) => {
  if(programs){
    await programs.close();
    programs = null;
  }
  if (!programs && orbitdb) {
    // Load programs database
    programs = await orbitdb.feed(`three0-${pid}`, {
      accessController: { write: [orbitdb.identity.id] },
      create: true
    })

    await programs.load()
  }

  return programs
    ? programs.iterator({ limit: -1 }).collect()
    : []
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

export const createDatabase = async (name, type, permissions) => {
  let accessController

  switch (permissions) {
    case 'public':
      accessController = { write: ['*'] }
      break
    default:
      accessController = { write: [orbitdb.identity.id] }
      break
  }

  const db = await orbitdb.create(name, type, { accessController })

  return programs.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}

export const removeDatabase = async (hash) => {
  return programs.remove(hash)
}
