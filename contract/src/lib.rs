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
use near_sdk::collections::{UnorderedMap};

pub use crate::types::*;

pub type PID = String;


setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Three0 {
    project_map: UnorderedMap<String, Project>,
    project_counter: u16,
}

impl Default for Three0 {
  fn default() -> Self {
    Self {
      project_map: UnorderedMap::new(b"project_map".to_vec()),
      project_counter: 0,
    }
  }
}

#[near_bindgen]
impl Three0 {
    pub fn create_project(&mut self, name: String, description: String) -> String {
        let project_id = format!("project_{}", self.project_counter);
        let project = Project::new(project_id.clone(), name, description);
        self.project_map.insert(&project_id, &project);
        self.project_counter += 1;
        project_id
    }

    pub fn get_project(&self, project_id: PID) -> ProjectReturnSchema {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.get_project_return(),
            None => env::panic(b"Project not found"),
        }
    }

    pub fn update_project(&mut self, project_id: PID, project_name: String, project_description: String){
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else( || env::panic(b"Project not found"));
        project.name = project_name;
        project.description = project_description;
        self.project_map.insert(&project_id, &project);
    }

    pub fn delete_project(&mut self, project_id: PID){
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else( || env::panic(b"Project not found"));
        project.users.clear();
        self.project_map.remove(&project_id);
    }

    pub fn get_all_projects(&self, offset: usize, limit: usize) -> AllSchema<ProjectReturnSchema> {
        let project_size = self.project_map.len();
        let mut new_skip:usize = 0;

        if project_size as usize > offset + limit {
            new_skip = (project_size as usize) - (offset + limit);
        }

        let mut projects:Vec<ProjectReturnSchema> = self.project_map.values()
            .skip(new_skip)
            .take(limit)
            .map(|project| project.get_project_return())
            .collect();
        
        projects.reverse();
        
        AllSchema {
            entries: projects,
            num: project_size as u16,
        }
    }

    pub fn add_database(&mut self, project_id: PID, database_details: Database){
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else( || env::panic(b"Project not found"));
        project.databases.insert(&database_details.address, &database_details);
        project.num_databases += 1;
        self.project_map.insert(&project_id, &project);
    }

    pub fn delete_database(&mut self, project_id: PID, database_name: String){
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else(|| env::panic(b"Project not found"));
        let success = project.databases.remove(&database_name);
        if success.is_some() {
            project.num_databases -= 1;
        }
        self.project_map.insert(&project_id, &project);
    }

    pub fn get_project_users(&self, project_id: PID, offset: u16, limit: u16) -> Vec<User> {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.users.values().skip(offset as usize).take(limit as usize).collect(),
            None => env::panic(b"Project not found")
        }
    }

    pub fn create_user(&mut self, project_id: PID){
        let mut project = self.project_map.get(&project_id).unwrap();
        let user = User::new(env::signer_account_id());
        project.users.insert(&env::signer_account_id(), &user);
        self.project_map.insert(&project_id, &project);
    }

    pub fn user_exists(&self, project_id: PID, account_id: AccountId) -> bool {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.users.get(&account_id).is_some(),
            None =>  env::panic(b"Project not found")
        }
    }

    pub fn user_action(&mut self, project_id: PID, action: String) {
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else(|| env::panic(b"Project not found"));
        let mut user = project.users.get(&env::signer_account_id()).unwrap_or_else(|| User::new(env::signer_account_id()));
        
        match action.as_str() {
            "LOGIN" => user.login(),
            "LOGOUT" => user.logout(),
            _ => env::panic(b"Invalid action")
        }

        project.users.insert(&env::signer_account_id(), &user);
        self.project_map.insert(&project_id, &project);
    }

    pub fn get_user(&self, project_id: PID, account_id: AccountId) -> User {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.users.get(&account_id).unwrap_or_else(|| env::panic(b"User not found")),
            None => env::panic(b"Project not found")
        }
    }
}