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