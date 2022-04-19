import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

export const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  window.near = near;

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: ["get_all_projects", "get_project", "get_project_users", "get_user"],
      changeMethods: ["create_project", "update_project", "delete_project", "add_database", "delete_database"],
      // View methods are read only. They don't modify the state, but usually return some value.
      // Change methods can modify the state. But you don't receive the returned value when called.
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(`${window.location.origin}/login`)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  const starter = window.location.origin;
  window.walletConnection.requestSignIn(nearConfig.contractName, "Three0", `${starter}/app`, `${starter}/login`);
}
