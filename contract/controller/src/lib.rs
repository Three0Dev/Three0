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
use near_sdk::{env, near_bindgen, setup_alloc, AccountId};
use near_sdk::collections::{LookupMap};

pub use crate::types::*;

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Three0 {
    dev_project_map: LookupMap<AccountId, Vec<ProjectRef>>,
}

impl Default for Three0 {
  fn default() -> Self {
    Self {
      dev_project_map: LookupMap::new(b"project_map".to_vec()),
    }
  }
}

#[near_bindgen]
impl Three0 {
    pub fn create_project(&mut self, chain_type: String, contract_address: String) {
        let project = ProjectRef::new(chain_type.clone(), contract_address.clone(), env::signer_account_id(), env::block_timestamp());
        let projects_ref = self.dev_project_map.get(&env::signer_account_id());
        let mut projects = match projects_ref {
            Some(projects) => projects,
            None => Vec::new(),
        };

        projects.push(project);
        self.dev_project_map.insert(&env::signer_account_id(), &projects);
    }

    pub fn delete_project(&mut self, contract_address: String) -> bool{
        let projects = self.dev_project_map.get(&env::signer_account_id());
        match projects {
            Some(projects) => {
                let mut projects = projects.clone();
                let mut index = 0;
                for project in projects.iter() {
                    if project.contract_address == contract_address {
                        projects.remove(index);
                        self.dev_project_map.insert(&env::signer_account_id(), &projects);
                        return true;
                    }
                    index += 1;
                }
                return false;
            }
            None => {
                return false;
            }
        }
    }

    pub fn get_all_projects(&self, owner: AccountId, offset: usize, limit: usize) -> AllSchema {
        let projects = self.dev_project_map.get(&owner);

        return match projects {
            Some(projects) => {
                let entries = projects
                    .iter()
                    .rev()
                    .skip(offset)
                    .take(limit)
                    .map(|x| x.clone())
                    .collect::<Vec<ProjectRef>>();

                AllSchema {
                    entries: entries,
                    num: projects.len() as u16,
                }
            },
            None => 
                AllSchema {
                    entries: Vec::new(),
                    num: 0,
                }
        }
    }

    pub fn get_project(&self, contract_address: String, account_id: String) -> AllSchema {
        let projects = self.dev_project_map.get(&account_id);
        let mut entries = Vec::new();
        
        match projects {
            Some(projects) => {
                for project in projects.iter() {
                    if project.contract_address.contains(&contract_address) {
                        entries.push(project.clone());
                    }
                }
            }
            None => {}
        }

        let len = entries.len();

        AllSchema{
            entries,
            num: len as u16,
        }
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

    // test for creating a project
    #[test]
    fn test_create_project() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();
        contract.create_project("eth".to_string(), "0x123".to_string());
        let projects = contract.get_all_projects(env::signer_account_id(), 0, 10);
        assert_eq!(projects.entries.len(), 1);
    }

    // test for deleting a project
    #[test]
    fn test_delete_project() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();
        contract.create_project("eth".to_string(), "0x123".to_string());
        contract.create_project("eth".to_string(), "0x456".to_string());
        contract.create_project("eth".to_string(), "0x789".to_string());
        let projects = contract.get_all_projects(env::signer_account_id(), 0, 10);
        assert_eq!(projects.entries.len(), 3);
        contract.delete_project("0x456".to_string());
        let projects = contract.get_all_projects(env::signer_account_id(), 0, 10);
        assert_eq!(projects.entries.len(), 2);
    }

    // test for getting a project
    #[test]
    fn test_get_project() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();
        contract.create_project("eth".to_string(), "0x123".to_string());
        contract.create_project("eth".to_string(), "0x456".to_string());
        contract.create_project("eth".to_string(), "0x789".to_string());
        let projects = contract.get_project("0x456".to_string(), env::signer_account_id());
        assert_eq!(projects.entries.len(), 1);
    }

    // test for getting all projects
    #[test]
    fn test_get_all_projects() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();
        contract.create_project("eth".to_string(), "0x123".to_string());
        contract.create_project("eth".to_string(), "0x456".to_string());
        contract.create_project("eth".to_string(), "0x789".to_string());
        let projects = contract.get_all_projects(env::signer_account_id(), 0, 10);
        assert_eq!(projects.entries.len(), 3);
    }
}



