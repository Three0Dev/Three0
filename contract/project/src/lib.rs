/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

mod types;

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{PanicOnDefault, near_bindgen, setup_alloc, AccountId, env};
use near_sdk::collections::{LookupMap, UnorderedMap};

pub use crate::types::*;

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Three0Project {
    name: String,
    description: String,
    owner: AccountId,
    pid: String,
    databases: LookupMap<String, Database>,
    users: UnorderedMap<String, User>,
}

#[near_bindgen]
impl Three0Project {
    
    #[init]
    pub fn init(name: String, pid: String, description: String) -> Self {
        Self {
            name,
            owner: env::signer_account_id(),
            pid,
            description,
            databases: LookupMap::new(b"databases".to_vec()),
            users: UnorderedMap::new(b"users".to_vec()),
        }
    }

    pub fn get_project(&self) -> ProjectReturnSchema {
        ProjectReturnSchema {
            pid: self.pid.clone(),
            name: self.name.clone(),
            num_users: self.users.len() as u32,
            description: self.description.clone()
        }
    }

    pub fn update_project(&mut self, project_name: String, project_description: String) {
        self.name = project_name;
        self.description = project_description;
    }

    pub fn add_database(&mut self, database_details: Database){
        self.databases.insert(&database_details.address, &database_details);
    }

    pub fn delete_database(&mut self, database_name: String){
        self.databases.remove(&database_name);
    }

    pub fn get_users(&self, offset: usize, limit: usize) -> Vec<User> {
        let user_size = self.users.len();
        let new_skip:usize = if user_size as usize > offset + limit {
            (user_size as usize) - (offset + limit)
        }else{
            0
        };

        self.users.values()
            .skip(new_skip)
            .take(limit)
            .collect()
    }

    pub fn user_action(&mut self, action: String) {
        let mut user = self.users.get(&env::signer_account_id()).unwrap_or_else(|| User::new(env::signer_account_id()));
        
        match action.as_str() {
            "LOGIN" => user.login(),
            "LOGOUT" => user.logout(),
            _ => env::panic(b"Invalid action")
        }

        self.users.insert(&env::signer_account_id(), &user);
    }

    pub fn get_user(&self, account_id: AccountId) -> User {
        self.users.get(&account_id).unwrap_or_else(|| env::panic(b"User not found"))
    }
}