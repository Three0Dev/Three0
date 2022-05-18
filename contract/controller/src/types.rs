use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{AccountId};
use near_sdk::serde::{Serialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct ProjectRef {
    pub chain_type: String,
    pub contract_address: String,
    pub owner: AccountId,
    pub created_at: u64,
}

impl ProjectRef {
    pub fn new(chain_type: String, contract_address: String, owner: AccountId, created_at: u64) -> ProjectRef {
        ProjectRef {
            chain_type,
            contract_address,
            owner,
            created_at,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AllSchema {
    pub num: u16,
    pub entries: Vec<ProjectRef>, 
}