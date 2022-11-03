use crate::*;
use std::collections::HashSet;

#[near_bindgen]
impl Contract {
    pub fn list_files(&self, path: String) -> Vec<String> {
        let mut path_ = path.to_owned();
        if path_.starts_with('/') {
            path_ = path_[1..path_.len()].to_string()
        }
        let mut files: HashSet<String> = HashSet::new();
        let all_files = &self.filesys.keys_as_vector();
        for file in all_files.iter() {
            if file.starts_with(&path_) {
                let subpath = file.split_at(path_.len()).1; 
                if subpath.contains('/') {
                    let split = subpath.split('/');
                    let vec: Vec<&str> = split.collect();
                    let mut folder = vec[0].to_string();
                    folder.push_str("/");
                    files.insert(folder.to_string());
                } else {
                    let file = subpath;
                    files.insert(file.to_string());
                }
            }
        }
        let mut list_of_files: Vec<String> =  files.into_iter().collect();
        list_of_files.sort();
        return list_of_files;
    }

    pub fn get_file(&self, file_path: String) -> TokenMetadata {
        let existing = self.filesys.get(&file_path);
        assert!(existing.is_some(), "File does not exist");
        return self.token_metadata_by_id.get(&existing.unwrap()).unwrap();
    }
}