use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::near_bindgen;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::collections::{LookupMap};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Three0Hosting {
    pub file_map: LookupMap<String, Web4Response>,
}

impl Default for Three0Hosting {
    fn default() -> Self {
      Self {
        file_map: LookupMap::new(b"hosting_map".to_vec()),
      }
    }
  }

impl Three0Hosting {
    pub fn add_to_map(&mut self, path: String, body: String, content_type: String) {
        let response = Web4Response::Body {
            content_type,
            body: body.as_bytes().to_owned().into(),
        };
        self.file_map.insert(&path, &response);
    }

    /// Learn more about web4 here: https://web4.near.page
    pub fn web4_get(&self, request: Web4Request) -> Web4Response {
        let key = request.path;
        let value = self.file_map.get(&key).unwrap();
        value
    }
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Web4Request {
    #[serde(rename = "accountId")]
    pub account_id: Option<String>,
    pub path: String,
    #[serde(default)]
    pub params: std::collections::HashMap<String, String>,
    #[serde(default)]
    pub query: std::collections::HashMap<String, Vec<String>>,
    pub preloads: Option<std::collections::HashMap<String, Web4Response>>,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde", untagged)]
pub enum Web4Response {
    Body {
        #[serde(rename = "contentType")]
        content_type: String,
        body: near_sdk::json_types::Base64VecU8,
    },
    BodyUrl {
        #[serde(rename = "bodyUrl")]
        body_url: String,
    },
    PreloadUrls {
        #[serde(rename = "preloadUrls")]
        preload_urls: Vec<String>,
    },
}