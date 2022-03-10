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

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc, AccountId};
use near_sdk::collections::{UnorderedMap, LookupMap, Vector};
use uuid::Uuid;
use near_sdk::serde::{Serialize, Deserialize};


setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Three0 {
    dev_project_map: LookupMap<String, Vector<String>>,
    project_map: UnorderedMap<String, Project>,
}

impl Default for Three0 {
  fn default() -> Self {
    Self {
      dev_project_map: LookupMap::new(b"dev_project".to_vec()),
      project_map: UnorderedMap::new(b"project_map".to_vec()),
    }
  }
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Project {
    pid: String,
    name: String,
    description: String,
    owner: AccountId,
    users: UnorderedMap<String, User>,
    databases: UnorderedMap<String, Database>
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ProjectReturnSchema {
    pub pid: String,
    pub name: String,
    pub description: String,
    pub num_users: u32,
    pub num_databases: u32
}

impl ProjectReturnSchema {
    pub fn new(project: Project) -> Self{
        Self {
            pid: project.pid,
            name: project.name,
            description: project.description,
            num_users: project.users.len() as u32,
            num_databases: project.databases.len() as u32
        }
    }

    pub fn plain() -> ProjectReturnSchema {
        Self {
            pid: "".to_string(),
            name: "".to_string(),
            description: "".to_string(),
            num_users: 0,
            num_databases: 0
        }
    }
}

impl Project {
    pub fn new(pid: String, name: String, description: String, owner: AccountId) -> Project {
        let users_prefix = format!("{}_users", &pid);
        let database_prefix = format!("{}_database", &pid);
        Project {
            pid,
            name,
            description,
            owner,
            users: UnorderedMap::new(users_prefix.as_bytes()),
            databases: UnorderedMap::new(database_prefix.as_bytes())
        }
    }

    pub fn get_project_return(self) -> ProjectReturnSchema {
        ProjectReturnSchema::new(self)
    }
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Database {
    pub address: String,
    pub name: String,
    pub db_type: String, 
}

impl Database {
    pub fn new(address: String, name: String, db_type: String) -> Database {
        Database {
            address,
            name,
            db_type,
        }
    }
    
    pub fn plain() -> Database {
        Database {
            address: "".to_string(),
            name: "".to_string(),
            db_type: "".to_string(),
        }
    }
}

impl Clone for Database {
    fn clone(&self) -> Self {
        Database {
            address: self.address.clone(),
            name: self.name.clone(),
            db_type: self.db_type.clone(),
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct User {
    account_id: AccountId,
    is_online: bool,
}

impl User {
    pub fn new(account_id: AccountId) -> Self {
        Self {
            account_id,
            is_online: true,
        }
    }

    pub fn login(&mut self){
        self.is_online = true;
    }

    pub fn logout(&mut self){
        self.is_online = false;
    }
}

#[near_bindgen]
impl Three0 {
    pub fn dev_exist(&self, account_id: String) -> bool {
        self.dev_project_map.contains_key(&account_id)
    }

    pub fn create_dev(&mut self){
        let account_id = env::signer_account_id();
        let project_list = Vector::new(account_id.as_bytes());
        self.dev_project_map.insert(&account_id, &project_list);
    }

    pub fn create_project(&mut self, project_name: String, project_description: String) -> String {
        let project_id = Uuid::new_v4().to_string();
        let project = Project::new(project_id.clone(), project_name, project_description, env::signer_account_id());
        self.project_map.insert(&project_id, &project);
        project_id
    }

    pub fn get_project(&self, project_id: String) -> ProjectReturnSchema {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => project.get_project_return(),
            None => ProjectReturnSchema::plain()
        }
    }

    pub fn get_project_users(&self, project_id: String) -> Vec<User> {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => {
                let mut users = Vec::new();
                for user in project.users.values() {
                    users.push(user);
                }
                users
            },
            None => Vec::new()
        }
    }

    pub fn update_project(&mut self, project_id: String, project_name: String, project_description: String) -> bool{
        let project_ref = self.project_map.get(&project_id);
        if project_ref.is_none() {
            return false;
        }
        let mut project = project_ref.unwrap();
        project.name = project_name;
        project.description = project_description;
        self.project_map.insert(&project_id, &project);
        true
    }

    pub fn delete_project(&mut self, project_id: String) -> bool {
        let project_ref = self.project_map.get(&project_id);
        if project_ref.is_none() {
            return false;
        }
        let mut project = project_ref.unwrap();
        project.databases.clear();
        project.users.clear();
        self.project_map.remove(&project_id).is_some()
    }

    pub fn get_all_projects(&self) -> Vec<ProjectReturnSchema> {
        let mut projects = Vec::<ProjectReturnSchema>::new();
        for (_key, value) in self.project_map.iter() {
            let project = value.get_project_return();
            projects.push(project);
        }
        projects
    }

    pub fn add_database(&mut self, #[serializer(borsh)] project_id: String, #[serializer(borsh)] database_details: Database) -> bool {
        let project_ref = self.project_map.get(&project_id);
        if project_ref.is_none() {
            return false;
        }
        let mut project = project_ref.unwrap();
        project.databases.insert(&database_details.address, &database_details);
        self.project_map.insert(&project_id, &project);
        true
    }

    pub fn get_database(&self, project_id: String, address: String) -> Database {
        let project = self.project_map.get(&project_id);
        match project {
            Some(project) => {
                let database = project.databases.get(&address);
                database.unwrap_or_else(Database::plain)
            },
            None => Database::plain()
        }
    }

    pub fn delete_database(&mut self, project_id: String, database_name: String) -> bool{
        let project_ref = self.project_map.get(&project_id);
        if project_ref.is_none() {
            return false;
        }
        let mut project = project_ref.unwrap();
        let success = project.databases.remove(&database_name);
        self.project_map.insert(&project_id, &project);
        success.is_some()
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
            None => false,
        }
    }

    pub fn user_login(&mut self, project_id: String) -> bool {
        let project_ref = self.project_map.get(&project_id);
        if project_ref.is_none() {
            return false;
        }
        let mut project = project_ref.unwrap();
        let mut user = project.users.get(&env::signer_account_id()).unwrap_or_else(|| User::new(env::signer_account_id()));
        user.login();
        project.users.insert(&env::signer_account_id(), &user);
        self.project_map.insert(&project_id, &project);
        true
    }

    pub fn user_logout(&mut self, project_id: String) -> bool{
        let project_ref = self.project_map.get(&project_id);
        if project_ref.is_none() {
            return false;
        }
        let mut project = project_ref.unwrap();
        let user_ref = project.users.get(&env::signer_account_id());
        if user_ref.is_none() {
            return false;
        }
        let mut user = user_ref.unwrap();
        user.logout();
        project.users.insert(&env::signer_account_id(), &user);
        self.project_map.insert(&project_id, &project);
        true
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
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
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
            epoch_height: 19,
        }
    }

    #[test]
    fn dev_exists_and_create_dev_test() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();
        assert_eq!(
            false,
            contract.dev_exist("bob_near".to_string())
        );
        contract.create_dev();
        assert_eq!(
            true,
            contract.dev_exist("bob_near".to_string())
        );
    }

    #[test]
    fn create_and_get_project_test() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();
        let project_name = "project_name".to_string();
        let project_description = "project_description".to_string();
        let pid = contract.create_project(project_name.clone(), project_description.clone());

        let project = contract.get_project(pid.clone());
        assert_eq!(project.pid, pid);
        assert_eq!(project.name, project_name);
        assert_eq!(project.description, project_description);
        assert_eq!(project.num_databases, 0);
        assert_eq!(project.num_users, 0);
    }

    #[test]
    fn get_all_projects_test(){
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();

        let mut id_tracker = Vec::new();

        for x in 0..10 {
            let project_name = format!("project_name_{}", x);
            let project_description = format!("project_description_{}", x);
            let pid = contract.create_project(project_name.clone(), project_description.clone());
            id_tracker.push(pid);
        }

        let projects = contract.get_all_projects();
        assert_eq!(projects.len(), 10);
        for x in 0..10 {
            assert_eq!(projects[x].pid, id_tracker[x]);
            assert_eq!(projects[x].name, format!("project_name_{}", x));
            assert_eq!(projects[x].description, format!("project_description_{}", x));
            assert_eq!(projects[x].num_users, 0);
            assert_eq!(projects[x].num_databases, 0);
        }
    }

    #[test]
    fn update_project_test(){
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();

        let project_name = "project_name".to_string();
        let project_description = "project_description".to_string();
        let pid = contract.create_project(project_name.clone(), project_description.clone());

        let project = contract.get_project(pid.clone());
        assert_eq!(project.pid, pid);
        assert_eq!(project.name, project_name);
        assert_eq!(project.description, project_description);
        assert_eq!(project.num_databases, 0);
        assert_eq!(project.num_users, 0);

        let new_project_name = "new_project_name".to_string();
        let new_project_description = "new_project_description".to_string();
        let success = contract.update_project(pid.clone(), new_project_name.clone(), new_project_description.clone());

        assert!(success);

        let project = contract.get_project(pid.clone());
        assert_eq!(project.pid, pid);
        assert_eq!(project.name, new_project_name);
        assert_eq!(project.description, new_project_description);
        assert_eq!(project.num_databases, 0);
        assert_eq!(project.num_users, 0);

        let failed_update = contract.update_project(String::from("no_id"), String::from(""), String::from(""));
        assert!(!failed_update);
    }

    #[test]
    fn delete_project_test(){
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();

        let project_name = "project_name".to_string();
        let project_description = "project_description".to_string();
        let pid = contract.create_project(project_name.clone(), project_description.clone());

        let success = contract.delete_project(pid.clone());
        assert!(success);

        let project = contract.get_project(pid.clone());
        assert_eq!(project.pid, String::from(""));
        assert_eq!(project.name, String::from(""));
        assert_eq!(project.description, String::from(""));
        assert_eq!(project.num_databases, 0);
        assert_eq!(project.num_users, 0);
    }

    #[test]
    fn users_test(){
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();

        let project_name = "project_name".to_string();
        let project_description = "project_description".to_string();
        let pid = contract.create_project(project_name.clone(), project_description.clone());

        let mut user_exists = contract.user_exists(pid.clone(), "bob_near".to_string());
        assert!(!user_exists);

        contract.create_user(pid.clone());

        user_exists = contract.user_exists(pid.clone(), String::from("bob_near"));
        assert!(user_exists);

        let success_logout = contract.user_logout(pid.clone());
        assert!(success_logout);

        let success_login = contract.user_login(pid.clone());
        assert!(success_login);

        let all_users = contract.get_project_users(pid.clone());
        assert_eq!(all_users.len(), 1);
    }

    #[test]
    fn database_test(){
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Three0::default();
        let project_name = "project_name";
        let project_description = "project_description";
        let pid = contract.create_project(project_name.to_string(), project_description.to_string());

        let database_details = Database::new("db_address".to_string(), "db_name".to_string(),
         "db_type".to_string());

        contract.add_database(pid.clone(), database_details.clone());

        let project = contract.get_project(pid.clone());
        assert_eq!(project.num_databases, 1);

        let database = contract.get_database(pid.clone(), database_details.address.clone());
        assert_eq!(database.name, database_details.name);
        assert_eq!(database.db_type, database_details.db_type);
        assert_eq!(database.address, database_details.address);

        let success = contract.delete_database(pid.clone(), database_details.address.clone());
        assert!(success);

        let project = contract.get_project(pid.clone());
        assert_eq!(project.num_databases, 0);

        let database = contract.get_database(pid.clone(), database_details.address.clone());
        assert_eq!(database.name, String::from(""));
        assert_eq!(database.db_type, String::from(""));
        assert_eq!(database.address, String::from(""));
    }
}