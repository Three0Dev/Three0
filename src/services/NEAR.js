import { keyStores, transactions, KeyPair, utils, providers } from "near-api-js";
import NEAR_CONTRACT from 'url:../contractWasms/near.wasm';
import { nearConfig } from "../utils";

export async function createNEARAccount(){
  let {pid} = JSON.parse(localStorage.getItem("projectDetails"));

  const keyPair = KeyPair.fromRandom('ed25519');
  const publicKey = keyPair.getPublicKey().toString();
  await (new keyStores.BrowserLocalStorageKeyStore()).setKey(nearConfig.networkId, pid, keyPair);

  await window.walletConnection.account().createAccount(
    pid,
    publicKey,
    utils.format.parseNearAmount("6")
  );
}

export async function createNEARProject(){
  let {pid, blockchainNetwork} = JSON.parse(localStorage.getItem("projectDetails"));

  await window.contract.create_project({
    chain_type: blockchainNetwork,
    contract_address: pid,
  });
}

export async function deployNEARProjectContract(){
  let {pid} = JSON.parse(localStorage.getItem("projectDetails"));
  localStorage.removeItem("projectDetails");
  const account = await window.near.account(pid);

  const contract = await fetch(NEAR_CONTRACT);

  const buf = await contract.arrayBuffer();

  await account.signAndSendTransaction({
    receiverId: pid,
    actions: [
      transactions.deployContract(new Uint8Array(buf)),
      transactions.functionCall(
        "init",
        {pid},
        10000000000000,
        "0"
      )
    ]
  });
}

export async function deleteNEARProject(pid){
  try{
    const canDelete = await window.contract.delete_project({contract_address: pid});
    if(canDelete){
      const account = await window.near.account(pid);
      await account.deleteAccount(window.accountId);
      return true;
    }
  } catch(e){
    console.error(e);
  }
  return false;
}

export async function checkAccountStatus(hash){
  const provider = new providers.JsonRpcProvider(
    `https://archival-rpc.${nearConfig.networkId}.near.org`
  );
  
  const result = await provider.txStatus(hash, window.accountId)
  console.log(result);
  if(result.transaction.actions.includes("CreateAccount") && result.transaction_outcome.outcome.status.SuccessReceiptId){
    return Promise.all([deployNEARProjectContract(), createNEARProject()]);
  }
  return Promise.resolve();
}