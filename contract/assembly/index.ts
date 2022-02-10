// /*
//  * This is an example of an AssemblyScript smart contract with two simple,
//  * symmetric functions:
//  *
//  * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
//  *    user (account_id) who sent the request
//  * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
//  *    defaulting to "Hello"
//  *
//  * Learn more about writing NEAR smart contracts with AssemblyScript:
//  * https://docs.near.org/docs/develop/contracts/as/intro
//  *
//  */

import {
  Context,
  logging,
  PersistentMap,
  base64,
  math,
  storage,
} from "near-sdk-as";
import { User, Database, Project } from "./model";

const DEFAULT_MESSAGE = "Hello";

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>("universal", DEFAULT_MESSAGE);
}

export function setGreeting(message: string): void {
  const accountId = Context.sender;
  // Use logging.log to record logs permanently to the blockchain!
  logging.log(`Saving greeting "${message}" for account "${accountId}"`);
  storage.set("universal", message);
}

// // Dev Functions

// let devProjectMap = new PersistentMap<string, Array<string>>("devProjectMap");
// let projectMap = new PersistentMap<string, Project>("projectMap");

// const DNA_DIGITS = 8;

// export function createDev(): void {
//   assert(!devProjectMap.contains(Context.sender));
//   devProjectMap.set(Context.sender, new Array<string>(0));
//   logging.log("Created dev account");
// }

// export function createProject(name: string = `Untitled Project`): string {
//   assert(devProjectMap.contains(Context.sender));
//   let project = new Project(Context.sender, name);

//   const pid = base64.encode(math.randomBuffer(DNA_DIGITS));

//   projectMap.set(pid, project);

//   const devProjects: Array<string> =
//     devProjectMap.get(Context.sender) ?? new Array<string>(0);
//   devProjects.push(pid);
//   devProjectMap.set(Context.sender, devProjects);

//   logging.log(`Created project ${name} by ${Context.sender}`);
//   return pid;
// }

// export function updateProject(pid: string, name: string): void {
//   assert(devProjectMap.contains(Context.sender));
//   let project = projectMap.get(pid);
//   if (!project) return;
//   project.name = name;
//   logging.log(`Updated project ${name} by ${Context.sender}`);
// }

// export function deleteProject(pid: string): void {
//   assert(devProjectMap.contains(Context.sender) && projectMap.contains(pid));

//   let devProjects = devProjectMap.get(Context.sender);
//   if (!devProjects) return;
//   assert(devProjects?.includes(pid));

//   let project = projectMap.get(pid);
//   if (!project) return;
//   // project.databases = [];

//   projectMap.delete(pid);
//   devProjects = devProjects?.filter((projectID) => projectID !== pid);
//   devProjectMap.set(Context.sender, devProjects);
//   logging.log(`Deleted project ${pid}`);
// }

// export function addDatabase(details: any, pid: string): void {
//   assert(devProjectMap.contains(Context.sender));
//   let project = projectMap.get(pid);
//   if (!project) return;
//   let database = new Database(details.url, details.name, details.type);
//   project.addDatabase(database);
//   logging.log(`Added database ${details.url} to project ${pid}`);
// }

// export function deleteDatabase(pid: string, name: string): void {
//   let project = projectMap.get(pid);
//   if (!project) return;
//   for (let i = 0; i < project.databases.length; i++) {
//     let database = project.databases[i];
//     if (database.name == name) {
//       project.databases.splice(i, 1);
//       break;
//     }
//   }
//   logging.log(`Deleted database ${name} from project ${pid}`);
// }

// export function getProjectDetails(pid: string): Project | null {
//   logging.log(`Getting project details for ${pid}`);
//   return projectMap.get(pid);
// }

// export function getAllProjects(): Array<any> {
//   let projects: Array<any> = [];
//   const project_ids = devProjectMap.get(Context.sender) || [];
//   project_ids.forEach((pid) => {
//     let project = projectMap.get(pid);
//     if (project) {
//       projects.push({
//         name: project.name,
//         numUsers: project.users.size,
//         numDatabases: project.databases.length,
//       });
//     }
//   });
//   return projects;
// }

// // User Functions

// // export function createUser(pid: string): void {
// //   let project = projectMap.get(pid);
// //   if (!project) return;
// //   let user = new User(Context.sender);
// //   project.addUser(user);
// //   logging.log(`Created user ${Context.sender} in project ${pid}`);
// // }

// // export function userExists(pid: string): bool {
// //   let project = projectMap.get(pid);
// //   return project != null && project.users.has(Context.sender);
// // }

// export function getDatabaseAddress(pid: string, name: string): Database | null {
//   let project = projectMap.get(pid);
//   logging.log(`Got databases for project ${pid}`);
//   if (!project) return null;
//   for (let i = 0; i < project.databases.length; i++) {
//     let database = project.databases[i];
//     if (database.name == name) {
//       return database;
//     }
//   }
//   return null;
// }
