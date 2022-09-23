/* eslint-disable no-underscore-dangle */
import { keyStores } from 'near-api-js'
import IdentityProvider from 'orbit-db-identity-provider'
import { nearConfig as NEAR_CONFIG } from '../../../utils'

export default class NearIdentityProvider extends IdentityProvider {
	// return type
	static get type() {
		return 'NearIdentity'
	}

	// return identifier of external id (eg. a public key)
	// eslint-disable-next-line class-methods-use-this
	async getId() {
		return window.accountId
	}

	// return a signature of data (signature of the OrbitDB public key)
	// eslint-disable-next-line class-methods-use-this
	async signIdentity(data) {
		console.log(data)
		const dataBuffer = Buffer.from(data)
		console.log(dataBuffer)

		const keyStore = new keyStores.BrowserLocalStorageKeyStore()
		const keyPair = await keyStore.getKey(
			NEAR_CONFIG.networkId,
			window.accountId
		)

		const { signature } = keyPair.sign(dataBuffer)
		console.log(signature)

		return signature
	}

	// return true if identity.signatures are valid
	static async verifyIdentity(identity) {
		const keyStore = new keyStores.BrowserLocalStorageKeyStore()
		const keyPair = await keyStore.getKey(
			NEAR_CONFIG.networkId,
			window.accountId
		)

		console.log(identity)

		const message = Buffer.from(identity.publicKey + identity.signatures.id)

		const verify = keyPair.verify(
			message,
			Buffer.from(Object.values(identity.signatures.publicKey))
		)

		console.log(verify)

		return true
	}
}
