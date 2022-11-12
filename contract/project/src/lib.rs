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
    owner: AccountId,
    pid: String,
    databases: LookupMap<String, Database>,
    users: UnorderedMap<String, User>,
    storage: Option<AccountId>,
    hosting: Option<AccountId>,
    tokenization: Option<AccountId>
}

#[near_bindgen]
impl Three0Project {
    
    #[init]
    pub fn init(pid: String) -> Self {
        Self {
            owner: env::signer_account_id(),
            pid,
            databases: LookupMap::new(b"databases".to_vec()),
            users: UnorderedMap::new(b"users".to_vec()),
            storage: None,
            hosting: None,
            tokenization: None,
        }
    }

    pub fn get_project(&self) -> ProjectReturnSchema {
        ProjectReturnSchema {
            pid: self.pid.clone(),
            num_users: self.users.len() as u32,
        }
    }

    pub fn add_database(&mut self, database_details: Database){
        self.databases.insert(&database_details.address, &database_details);
    }

    pub fn valid_database(&self, address: String) -> bool {
        self.databases.contains_key(&address)
    }

    pub fn delete_database(&mut self, database_name: String){
        self.databases.remove(&database_name);
    }

    pub fn get_users(&self, offset: usize, limit: usize) -> AllSchema {
        let user_size = self.users.len();
        let new_skip:usize = if user_size as usize > offset + limit {
            (user_size as usize) - (offset + limit)
        }else{
            0
        };

        let users = self.users.values()
            .skip(new_skip)
            .take(limit)
            .collect::<Vec<User>>();

        AllSchema {
            entries: users,
            num: user_size as u16,
        }
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

    pub fn set_storage(&mut self, storage_account: AccountId) {
        self.storage = Some(storage_account);
    }

    pub fn has_storage(&self) -> bool {
        return !self.storage.is_none()
    }

    pub fn get_storage(&self) -> AccountId {
        return self.storage.as_ref().unwrap().to_string()
    }

    pub fn set_hosting(&mut self, hosting_account: AccountId) {
        self.hosting = Some(hosting_account);
    }

    pub fn has_hosting(&self) -> bool {
        return !self.hosting.is_none()
    }

    pub fn get_hosting(&self) -> AccountId {
        return self.hosting.as_ref().unwrap().to_string()
    }

    pub fn set_tokenization(&mut self, hosting_account: AccountId) {
        self.tokenization = Some(hosting_account);
    }

    pub fn has_tokenization(&self) -> bool {
        return !self.tokenization.is_none()
    }

    pub fn get_tokenization(&self) -> AccountId {
        return self.tokenization.as_ref().unwrap().to_string()
    }
}

// create unit tests in this file
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // Initializing the context for the test
    // See https://docs.rs/near-sdk/3.1.0/near_sdk/struct.VMContext.html
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 0,
        }
    }

    // test for the get user function
    #[test]
    fn test_get_user() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        contract.user_action("LOGIN".to_string());
        let user = contract.get_user("bob_near".to_string());
        assert_eq!(user.account_id, "bob_near".to_string());
    }

    // test for the get users function
    #[test]
    fn test_get_users() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        contract.user_action("LOGIN".to_string());
        let users = contract.get_users(0, 1);
        assert_eq!(users.entries.len(), 1);
        assert_eq!(users.num, 1);
    }

    // test for the user action function
    #[test]
    fn test_user_action() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        contract.user_action("LOGIN".to_string());
        let user = contract.get_user("bob_near".to_string());
        // assert_eq!(user.account_id, "bob_near".to_string());
        assert_eq!(user.is_online, true);
    }

    // test for the get project function
    #[test]
    fn test_get_project() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = Three0Project::init("test".to_string());
        let project = contract.get_project();
        assert_eq!(project.pid, "test".to_string());
        assert_eq!(project.num_users, 0);
    }

    // test for the add database function
    #[test]
    fn test_add_database() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        let database = Database {
            address: "test".to_string(),
            name: "test".to_string(),
            db_type: "test".to_string(),
        };
        contract.add_database(database);
        assert_eq!(contract.valid_database("test".to_string()), true);
    }

    // test for the delete database function
    #[test]
    fn test_delete_database() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        let database = Database {
            address: "test".to_string(),
            name: "test".to_string(),
            db_type: "test".to_string(),

        };
        contract.add_database(database);
        assert_eq!(contract.valid_database("test".to_string()), true);
        contract.delete_database("test".to_string());
        assert_eq!(contract.valid_database("test".to_string()), false);
    }

    // test for valid database function
    #[test]
    fn test_valid_database() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        let database = Database {
            address: "test".to_string(),
            name: "test".to_string(),
            db_type: "test".to_string(),

        };
        contract.add_database(database);
        assert_eq!(contract.valid_database("test".to_string()), true);
    }

    //test for the set storage function
    #[test]
    fn test_storage() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        assert_eq!(contract.has_storage(), false);
        contract.set_storage("test".to_string());
        assert_eq!(contract.has_storage(), true);
        assert_eq!(contract.get_storage(), "test".to_string());
    }

    //test for the set hosting function
    #[test]
    fn test_hosting() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        assert_eq!(contract.has_hosting(), false);
        contract.set_hosting("test".to_string());
        assert_eq!(contract.has_hosting(), true);
        assert_eq!(contract.get_hosting(), "test".to_string());
    }

    //test for the set tokenization function
    #[test]
    fn test_tokenization() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0Project::init("test".to_string());
        assert_eq!(contract.has_tokenization(), false);
        contract.set_tokenization("test".to_string());
        assert_eq!(contract.has_tokenization(), true);
        assert_eq!(contract.get_tokenization(), "test".to_string());
    }
}
