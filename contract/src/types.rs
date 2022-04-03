use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{AccountId};
use near_sdk::collections::{UnorderedMap, LookupMap};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
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

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Project {
    pub pid: String,
    pub name: String,
    pub description: String,
    pub users: UnorderedMap<String, User>,
    pub databases: LookupMap<String, Database>,
    pub num_databases: u16,
}

impl Project {
    pub fn new(pid: String, name: String, description: String) -> Project {
        Project {
            pid: pid.clone(),
            name,
            description,
            users: UnorderedMap::new(format!("{}_users", &pid).as_bytes()),
            databases: LookupMap::new(format!("{}_database", &pid).as_bytes()),
            num_databases: 0,
        }
    }

    pub fn get_project_return(self) -> ProjectReturnSchema {
        ProjectReturnSchema::new(self)
    }
}

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ProjectReturnSchema {
    pub pid: String,
    pub name: String,
    pub description: String,
    pub num_users: u16,
    pub num_databases: u16
}

impl ProjectReturnSchema {
    pub fn new(project: Project) -> Self{
        Self {
            pid: project.pid,
            name: project.name,
            description: project.description,
            num_users: project.users.len() as u16,
            num_databases: project.num_databases as u16
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Clone, Deserialize)]
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
}

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AllSchema<T> {
    pub num: u16,
    pub entries: Vec<T>, 
}