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
    base64,
    math,
    PersistentMap
  } from "near-sdk-as";
  import { Database, Project, User, DatabaseInfoSchema, ProjectReturnSchema } from "./model";

const DNA_DIGITS = 8;

export const DEV_PROJECT_MAP = new PersistentMap<string, Array<string>>("devProjectMap");
export const PROJECT_MAP = new PersistentMap<string, Project>("projectMap");

export function devExist(id: string): bool {
  return DEV_PROJECT_MAP.contains(id);
}

export function createDev(): void {
  assert(!DEV_PROJECT_MAP.contains(Context.sender));
  DEV_PROJECT_MAP.set(Context.sender, new Array<string>());
  logging.log("Created dev account");
}

export function createProject(name: string, description: string): string {
  assert(DEV_PROJECT_MAP.contains(Context.sender));
  let project = new Project(Context.sender, name, description);

  const pid = _randomNum().toString();

  PROJECT_MAP.set(pid, project);

  let devProjects = DEV_PROJECT_MAP.get(Context.sender);
  devProjects = devProjects ? devProjects : new Array<string>();
  devProjects.push(pid);
  DEV_PROJECT_MAP.set(Context.sender, devProjects);

  logging.log(`Created project ${name} by ${Context.sender}`);
  return pid;
}

function _randomNum(): u32 {
  let buf = math.randomBuffer(4);
  return (
    (((0xff & buf[0]) << 24) |
      ((0xff & buf[1]) << 16) |
      ((0xff & buf[2]) << 8) |
      ((0xff & buf[3]) << 0))
  );
}

export function updateProject(pid: string, name: string, description: string): void {
  assert(DEV_PROJECT_MAP.contains(Context.sender));
  
  // TODO check ownership of project
  let project = PROJECT_MAP.get(pid);
  if (!project) return;
  project.name = name;
  project.description = description;
  PROJECT_MAP.set(pid, project);
  logging.log(`Updated project ${name} by ${Context.sender}`);
}

export function deleteProject(pid: string): void {
  assert(DEV_PROJECT_MAP.contains(Context.sender));

  // TODO check ownership of project

  let devProjects = DEV_PROJECT_MAP.get(Context.sender);
  if (!devProjects) return;
  assert(devProjects.includes(pid));

  let project = PROJECT_MAP.get(pid);
  if (!project) return;

  PROJECT_MAP.delete(pid);
  for(let i = 0; i < devProjects.length; i++) {
    if (devProjects[i] === pid) {
      devProjects = devProjects.splice(i, 1);
      break;
    }
  }
  DEV_PROJECT_MAP.set(Context.sender, devProjects);
  logging.log(`Deleted project ${pid}`);
}

export function addDatabase(details: DatabaseInfoSchema, pid: string): void {
  assert(DEV_PROJECT_MAP.contains(Context.sender));
  
  // TODO check ownership of project

  let project = PROJECT_MAP.get(pid);
  if (!project) return;
  let database = new Database(details.address, details.name, details.type);
  project.addDatabase(database);
  logging.log(`Added database ${details.address} to project ${pid}`);
}

export function deleteDatabase(pid: string, address: string): void {
  let project = PROJECT_MAP.get(pid);
  
  // TODO check ownership of project

  if (!project) return;
  project.databases.delete(address);
  logging.log(`Deleted database ${address} from project ${pid}`);
}

export function getProjectDetails(pid: string): Project | null {
  logging.log(`Getting project details for ${pid}`);
  return PROJECT_MAP.get(pid);
}

export function getAllProjects(sender: string): Array<ProjectReturnSchema> {
  let projects: Array<ProjectReturnSchema> = [];
  const project_ids = DEV_PROJECT_MAP.get(sender);
  if (!project_ids) return projects;
  for(let i = 0; i < project_ids.length; i++) {
    const pid = project_ids[i];
    let project = PROJECT_MAP.get(pid);
    if (project) {
      let projectReturn: ProjectReturnSchema = {
        pid: pid,
        name: project.name,
        description: project.description,
        numUsers: project.users.size,
        numDatabases: project.databases.size,
      }
      projects.push(projectReturn);
    }
  }
  return projects;
}

// export function createUser(pid: string): void {
//     let project = PROJECT_MAP.get(pid);
//     if (!project) return;
//     let user = new User(Context.sender);
//     project.addUser(user);
//     logging.log(`Created user ${Context.sender} in project ${pid}`);
//   }
  
//   export function userExists(pid: string): bool {
//     let project = PROJECT_MAP.get(pid);
//     return project != null && project.users.has(Context.sender);
//   }