use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::near_bindgen;
use near_sdk::serde::{Deserialize, Serialize};

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Contract {
    pub file_map = LookupMap<String, Web4Response>,
}

#[near_bindgen]
impl Contract {
    pub fn add_to_map(&mut self, key: String, value: Web4Response) {
        self.file_map.insert(&key, &value);
    }
    
    /// Learn more about web4 here: https://web4.near.page
    pub fn web4_get(&self, request: Web4Request) -> Web4Response {
        if request.path == "/" {
            Web4Response::Body {
                content_type: "text/html; charset=UTF-8".to_owned(),
                body: "<h1>Hello from Web4 on NEAR!</h1>".as_bytes().to_owned().into(),
            }
        } else if request.path == "/testHTML" {
            Web4Response::Body {
                content_type: "text/html; charset=UTF-8".to_owned(),
                body: 
                "<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset=\"utf-8\">
                    <title>Simple</title>
                
                  </head>
                  <body>
                    <h1>Simple html file to deploy</h1>
                    <p>The button console logs that you clicked it</p>
                    <button id=\"button\">Click Me</button>
                    <script>
                    function log() {
                        console.log('You clicked the button yay');
                    }
                    var button = document.getElementById('button');
                    button.addEventListener('click', log);
                    </script>
                    <a href=\"subpageHTML\">Subpage</a>
                  </body>
                </html>
                ".as_bytes().to_owned().into(),
            }
        } else if request.path == "/subpageHTML" {
            Web4Response::Body {
                content_type: "text/html; charset=UTF-8".to_owned(),
                body: 
                "<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset=\"utf-8\">
                    <title>subpage</title>
                
                  </head>
                  <body>
                    <h1>you were redirected to a subpage wowow</h1>
                    <p>this does the same thing as the other page</p>
                    <p>The button console logs that you clicked it</p>
                    <button id=\"button\">Click Me</button>
                    <script>
                    function log() {
                        console.log('You clicked the button');
                    }
                    var button = document.getElementById('button');
                    button.addEventListener('click', log);
                    </script>
                    <!-- create a link to a subpage -->
                    <p>click this to go back to the other page</p>
                    <a href=\"testHTML\">Subpage</a>
                  </body>
                </html>
                ".as_bytes().to_owned().into(),
            }
        } else if request.path == "/Three0" {
            Web4Response::BodyUrl {
                body_url: "https://www.Three0Dev.com".to_owned(),
            }
        } else if request.path == "/demo" {
            Web4Response::BodyUrl {
                body_url: "https://ipfs.io/ipfs/bafybeibhr6dkmwq4yqtjosufaciucgzfuisp7zm5xsbxei7evdbzpijhre/demo.html".to_owned(),
            }
        } else {
            Web4Response::Body {
                content_type: "text/html; charset=UTF-8".to_owned(),
                body: format!("<h1>Some page</h1><pre>{:#?}</pre>", request).into_bytes().into(),
            } 
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
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



#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}