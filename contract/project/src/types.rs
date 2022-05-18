use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{AccountId, env};
use near_sdk::serde::{Serialize, Deserialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
    account_id: AccountId,
    is_online: bool,
    created_at: u64,
    last_online: u64,
}

impl User {
    pub fn new(account_id: AccountId) -> Self {
        Self {
            account_id,
            is_online: true,
            created_at: env::block_timestamp(),
            last_online: env::block_timestamp(),
        }
    }

    pub fn login(&mut self){
        self.is_online = true;
    }

    pub fn logout(&mut self){
        self.is_online = false;
        self.last_online = env::block_timestamp();
    }
}

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ProjectReturnSchema {
    pub pid: String,
    pub name: String,
    pub description: String,
    pub num_users: u32,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Database {
    pub address: String,
    pub name: String,
    pub db_type: String, 
}