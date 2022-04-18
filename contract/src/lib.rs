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
use near_sdk::{env, near_bindgen, setup_alloc};
use near_sdk::collections::{UnorderedMap};

pub use crate::types::*;

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

    pub fn get_project(&self, project_id: String) -> ProjectReturnSchema {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.get_project_return(),
            None => env::panic(b"Project not found"),
        }
    }

    pub fn update_project(&mut self, project_id: String, project_name: String, project_description: String){
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else( || env::panic(b"Project not found"));
        project.name = project_name;
        project.description = project_description;
        self.project_map.insert(&project_id, &project);
    }

    pub fn delete_project(&mut self, project_id: String){
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

    pub fn add_database(&mut self, project_id: String, database_details: Database){
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else( || env::panic(b"Project not found"));
        project.databases.insert(&database_details.address, &database_details);
        project.num_databases += 1;
        self.project_map.insert(&project_id, &project);
    }

    pub fn delete_database(&mut self, project_id: String, database_name: String){
        let project_ref = self.project_map.get(&project_id);
        let mut project = project_ref.unwrap_or_else(|| env::panic(b"Project not found"));
        let success = project.databases.remove(&database_name);
        if success.is_some() {
            project.num_databases -= 1;
        }
        self.project_map.insert(&project_id, &project);
    }

    pub fn get_project_users(&self, project_id: String, offset: u16, limit: u16) -> Vec<User> {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.users.values().skip(offset as usize).take(limit as usize).collect(),
            None => env::panic(b"Project not found")
        }
    }

    pub fn create_user(&mut self, project_id: String){
        let mut project = self.project_map.get(&project_id).unwrap();
        let user = User::new(env::signer_account_id());
        project.users.insert(&env::signer_account_id(), &user);
        self.project_map.insert(&project_id, &project);
    }

    pub fn user_exists(&self, project_id: String, account_id: String) -> bool {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.users.get(&account_id).is_some(),
            None =>  env::panic(b"Project not found")
        }
    }

    pub fn user_action(&mut self, project_id: String, action: String) {
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

    pub fn get_user(&self, project_id: String, account_id: String) -> User {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.users.get(&account_id).unwrap_or_else(|| env::panic(b"User not found")),
            None => env::panic(b"Project not found")
        }
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use near_sdk::MockedBlockchain;
//     use near_sdk::{testing_env, VMContext};

//     // mock the context for testing, notice "signer_account_id" that was accessed above from env::
//     fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
//         VMContext {
//             current_account_id: "alice_near".to_string(),
//             signer_account_id: "bob_near".to_string(),
//             signer_account_pk: vec![0, 1, 2],
//             predecessor_account_id: "carol_near".to_string(),
//             input,
//             block_index: 0,
//             block_timestamp: 0,
//             account_balance: 0,
//             account_locked_balance: 0,
//             storage_usage: 0,
//             attached_deposit: 0,
//             prepaid_gas: 10u64.pow(18),
//             random_seed: vec![0, 1, 2],
//             is_view,
//             output_data_receivers: vec![],
//             epoch_height: 19,
//         }
//     }

//     #[test]
//     fn create_and_get_project_test() {
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Three0::default();
//         let project_name = "project_name".to_string();
//         let project_description = "project_description".to_string();
//         let pid = contract.create_project(project_name.clone(), project_description.clone());

//         let project = contract.get_project(pid.clone());
//         assert_eq!(project.pid, pid);
//         assert_eq!(project.name, project_name);
//         assert_eq!(project.description, project_description);
//         assert_eq!(project.num_databases, 0);
//         assert_eq!(project.num_users, 0);
//     }

//     #[test]
//     fn get_all_projects_test(){
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Three0::default();

//         let mut id_tracker = Vec::new();

//         for x in 0..10 {
//             let project_name = format!("project_name_{}", x);
//             let project_description = format!("project_description_{}", x);
//             let pid = contract.create_project(project_name.clone(), project_description.clone());
//             id_tracker.push(pid);
//         }

//         let projects = contract.get_all_projects();
//         assert_eq!(projects.len(), 10);
//         for x in 0..10 {
//             assert_eq!(projects[x].pid, id_tracker[x]);
//             assert_eq!(projects[x].name, format!("project_name_{}", x));
//             assert_eq!(projects[x].description, format!("project_description_{}", x));
//             assert_eq!(projects[x].num_users, 0);
//             assert_eq!(projects[x].num_databases, 0);
//         }
//     }

//     #[test]
//     fn update_project_test(){
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Three0::default();

//         let project_name = "project_name".to_string();
//         let project_description = "project_description".to_string();
//         let pid = contract.create_project(project_name.clone(), project_description.clone());

//         let project = contract.get_project(pid.clone());
//         assert_eq!(project.pid, pid);
//         assert_eq!(project.name, project_name);
//         assert_eq!(project.description, project_description);
//         assert_eq!(project.num_databases, 0);
//         assert_eq!(project.num_users, 0);

//         let new_project_name = "new_project_name".to_string();
//         let new_project_description = "new_project_description".to_string();
//         contract.update_project(pid.clone(), new_project_name.clone(), new_project_description.clone());

//         let project = contract.get_project(pid.clone());
//         assert_eq!(project.pid, pid);
//         assert_eq!(project.name, new_project_name);
//         assert_eq!(project.description, new_project_description);
//         assert_eq!(project.num_databases, 0);
//         assert_eq!(project.num_users, 0);
//     }

//     #[test]
//     #[should_panic]
//     fn update_project_test_fail(){
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Three0::default();

//         contract.update_project(String::from("no_id"), String::from(""), String::from(""));
//     }

//     #[test]
//     #[should_panic]
//     fn delete_project_test(){
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Three0::default();

//         let project_name = "project_name".to_string();
//         let project_description = "project_description".to_string();
//         let pid = contract.create_project(project_name.clone(), project_description.clone());

//         contract.delete_project(pid.clone());

//         contract.get_project(pid.clone());
//     }

//     #[test]
//     fn users_test(){
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Three0::default();

//         let project_name = "project_name".to_string();
//         let project_description = "project_description".to_string();
//         let pid = contract.create_project(project_name.clone(), project_description.clone());

//         let mut user_exists = contract.user_exists(pid.clone(), "bob_near".to_string());
//         assert!(!user_exists);

//         contract.create_user(pid.clone());

//         user_exists = contract.user_exists(pid.clone(), String::from("bob_near"));
//         assert!(user_exists);

//         let all_users = contract.get_project_users(pid.clone());
//         assert_eq!(all_users.len(), 1);
//     }

//     #[test]
//     #[should_panic]
//     fn database_test(){
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Three0::default();
//         let project_name = "project_name";
//         let project_description = "project_description";
//         let pid = contract.create_project(project_name.to_string(), project_description.to_string());

//         let database_details = Database::new("db_address".to_string(), "db_name".to_string(),
//          "db_type".to_string());

//         contract.add_database(pid.clone(), database_details.clone());

//         let project = contract.get_project(pid.clone());
//         assert_eq!(project.num_databases, 1);

//         let database = contract.get_database(pid.clone(), database_details.address.clone());
//         assert_eq!(database.name, database_details.name);
//         assert_eq!(database.db_type, database_details.db_type);
//         assert_eq!(database.address, database_details.address);

//         contract.delete_database(pid.clone(), database_details.address.clone());

//         let project = contract.get_project(pid.clone());
//         assert_eq!(project.num_databases, 0);

//         contract.get_database(pid.clone(), database_details.address.clone());
//     }
// }