// /*
//  * This is an example of an AssemblyScript smart contract with two simple,
//  * symmetric functions:
//  *
//  * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
//  *    user (account_id) who sent the request
//  * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
//  *    defaulting to "Hello"
//  *
//  * Learn more about writing NEAR smart contracts with AssemblyScript:
//  * https://docs.near.org/docs/develop/contracts/as/intro
//  *
//  */

import {
  Context,
  logging,
  base64,
  math,
} from "near-sdk-as";

import * as user from "./user";
import * as dev from "./dev";

export {dev, user};

// Delete later
export function getID(): string {
  return "hi" + '!';
}
