use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::near_bindgen;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::collections::LookupMap;

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

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct FileContents {
    pub path: String,
    pub redirect_url: String, 
}

#[near_bindgen]

impl Three0Hosting {
    // #[init]
    // pub fn init(&self) {
    //     let response = Web4Response {
    //         body: 
    //             "<!DOCTYPE html>
    //             <html>
    //               <head>
    //                 <meta charset=\"utf-8\">
    //                 <title>Three0 Hosting</title>
    //               </head>
    //               <body>
    //                 <h1>Welcome to Hosting!</h1>
    //                 <p>please upload your files to host your project</p>
    //                 <p>this site will then be replaced by your project!/p>
    //               </body>
    //             </html>
    //             ".as_bytes().to_owned().into(),
    //         content_type: "text/html; charset=UTF-8".to_owned(),
    //     };
    //     self.file_map.insert("https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/", &response);
    // }

    // #[init]
    // pub fn init() -> Self {
    //     let response = Web4Response {
    //         body: 
    //             "<!DOCTYPE html>
    //             <html>
    //               <head>
    //                 <meta charset=\"utf-8\">
    //                 <title>Three0 Hosting</title>
    //               </head>
    //               <body>
    //                 <h1>Welcome to Hosting!</h1>
    //                 <p>please upload files to host your project</p>
    //                 <p>this site will then be replaced by your project!/p>
    //               </body>
    //             </html>
    //             ".as_bytes().to_owned().into(),
    //         content_type: "text/html; charset=UTF-8".to_owned(),

    //     };
    //     let mut file_map = LookupMap::new(b"hosting_map".to_vec());
    //     file_map.insert("https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/", &response);
    // }


    pub fn add_to_map(&mut self, content: Vec<FileContents>) {
        for file in content {
            let response = Web4Response::BodyUrl {
                body_url: file.redirect_url,
            };
            self.file_map.insert(&file.path, &response);
        }
    }

    /// Learn more about web4 here: https://web4.near.page
    pub fn web4_get(&self, request: Web4Request) -> Web4Response {
        let mut key = request.path;
        if key == "/" {
            key = "/index.html".to_string();
        }
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
//create unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    fn get_context(predecessor_account_id: String) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id,
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 0,
        }
    }

    #[test]
    fn test_add_to_map() {
        let context = get_context("bob_near".to_string());
        testing_env!(context);
        let mut contract = Three0Hosting::default();
        let content = vec![
            FileContents {
                path: "/index.html".to_string(),
                redirect_url: "https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/".to_string(),
            },
            FileContents {
                path: "/style.css".to_string(),
                redirect_url: "https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/style.css".to_string(),
            },
        ];
        contract.add_to_map(content);
        assert_eq!(
            contract.file_map.get("/index.html").unwrap(),
            Web4Response::BodyUrl {
                body_url: "https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/".to_string()
            }
        );
        assert_eq!(
            contract.file_map.get("/style.css").unwrap(),
            Web4Response::BodyUrl {
                body_url: "https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/style.css".to_string()
            }
        );
    }

    #[test]
    fn test_web4_get() {
        let context = get_context("bob_near".to_string());
        testing_env!(context);
        let mut contract = Three0Hosting::default();
        let content = vec![
            FileContents {
                path: "/index.html".to_string(),
                redirect_url: "https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/".to_string(),
            },
            FileContents {
                path: "/style.css".to_string(),
                redirect_url: "https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/style.css".to_string(),
            },
        ];
        contract.add_to_map(content);
        let request = Web4Request {
            account_id: None,
            path: "/index.html".to_string(),
            params: std::collections::HashMap::new(),
            query: std::collections::HashMap::new(),
            preloads: None,
        };
        assert_eq!(
            contract.web4_get(request),
            Web4Response::BodyUrl {
                body_url: "https://testing-q8op5t6xnxb2hcfeceqxsr.testnet.page/".to_string()
            }
        );
    }
}