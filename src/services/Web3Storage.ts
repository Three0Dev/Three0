import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

const token = process.env.WEB3_STORAGE_TOKEN

const web3StorageClient = new Web3Storage({ token })

const gateway = 'https://w3s.link/ipfs'

export default web3StorageClient
export { gateway as web3StorageGateway }
