import {
    Context,
    logging,
  } from "near-sdk-as";
  import { Database, User } from "./model";
  import { PROJECT_MAP } from "./datastore";

export function createUser(pid: string): void {
  let project = PROJECT_MAP.get(pid);
  if (!project) return;
  let user = new User(Context.sender);
  project.addUser(user);
  logging.log(`Created user ${Context.sender} in project ${pid}`);
}

export function userExists(pid: string): bool {
  let project = PROJECT_MAP.get(pid);
  return project != null && project.users.has(Context.sender);
}

export function getDatabaseAddress(pid: string, name: string): Database | null {
  let project = PROJECT_MAP.get(pid);
  logging.log(`Got databases for project ${pid}`);
  if (!project) return null;
  for (let i = 0; i < project.databases.length; i++) {
    let database = project.databases[i];
    if (database.name == name) {
      return database;
    }
  }
  return null;
}