import { keyStores } from 'near-api-js';
import IdentityProvider  from "orbit-db-identity-provider";
import { nearConfig as NEAR_CONFIG } from '../../../utils';

export class NearIdentityProvider extends IdentityProvider {
    // return type
    static get type () {
         return 'NearIdentity' 
    }
    // return identifier of external id (eg. a public key)
    async getId () {
        const keyStore = new keyStores.BrowserLocalStorageKeyStore() 
        const keyPair = await keyStore.getKey(NEAR_CONFIG.networkId, window.accountId)
        return keyPair.getPublicKey().data
    } 
    //return a signature of data (signature of the OrbitDB public key)
    async signIdentity (data) {
        const keyStore = new keyStores.BrowserLocalStorageKeyStore()
        const keyPair = await keyStore.getKey(NEAR_CONFIG.networkId, window.accountId)
        let uint8Array = new TextEncoder("utf-8").encode(data);
        console.log(keyPair.sign(uint8Array).signature.toString())
        return keyPair.sign(uint8Array).signature.toString()
    }
    //return true if identity.signatures are valid 
    static async verifyIdentity (identity) {
        console.log(identity); 
        const keyStore = new keyStores.BrowserLocalStorageKeyStore()
        const keyPair = await keyStore.getKey(NEAR_CONFIG.networkId, window.accountId)
        return keyPair.verify(identity.publicKey + identity.signatures.id, identity.signatures.publicKey)
    }
  }