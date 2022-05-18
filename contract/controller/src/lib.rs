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
                let ending_index = if offset + limit + 1 > projects.len() {
                    projects.len()
                } else {
                    offset + limit + 1
                };

                AllSchema {
                    entries: (&projects[offset..ending_index]).to_vec(),
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

    pub fn get_project(&self, contract_address: String, account_id: String) -> ProjectRef {
        let projects = self.dev_project_map.get(&account_id);
        let template_project = ProjectRef::new("".to_string(), "".to_string(), "".to_string(), 0);
        
        return match projects {
            Some(projects) => {
                let mut project_ret = template_project;
                for project in projects.iter() {
                    if project.contract_address == contract_address {
                        project_ret = project.clone();
                    }
                }
                project_ret
            }
            None => template_project
        }
    }
}