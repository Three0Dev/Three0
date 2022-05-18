import { keyStores, transactions, KeyPair, utils } from "near-api-js";
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

  window.history.replaceState({}, document.title, "/app");
}

export async function deployNEARProjectContract(){
  let {pid, name, description} = JSON.parse(localStorage.getItem("projectDetails"));
  const account = await window.near.account(pid);
  const status = await account.state();

  if(status.code_hash != "11111111111111111111111111111111") {
    localStorage.removeItem("projectDetails");
    window.history.replaceState({}, document.title, "/app");
    return;
  }

  const contract = await fetch(NEAR_CONTRACT);

  const buf = await contract.arrayBuffer();

  await account.signAndSendTransaction({
    receiverId: pid,
    actions: [
      transactions.deployContract(new Uint8Array(buf)),
      transactions.functionCall(
        "init",
        {name, pid, description},
        10000000000000,
        "0"
      )
    ]
  });
}