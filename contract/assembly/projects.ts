import { Context, logging, PersistentMap, base64, math } from "near-sdk-as";
import { User, Database, Project } from "./model";

// Dev Functions

let devProjectMap = new PersistentMap<string, Array<string>>("devProjectMap");
let projectMap = new PersistentMap<string, Project>("projectMap");

const DNA_DIGITS = 8;

export function createDev(): void {
  assert(!devProjectMap.contains(Context.sender));
  devProjectMap.set(Context.sender, new Array<string>(0));
  logging.log("Created dev account");
}

export function createProject(name: string = `Untitled Project`): string {
  assert(devProjectMap.contains(Context.sender));
  let project = new Project(Context.sender, name);

  const pid = base64.encode(math.randomBuffer(DNA_DIGITS));

  projectMap.set(pid, project);

  const devProjects: Array<string> =
    devProjectMap.get(Context.sender) ?? new Array<string>(0);
  devProjects.push(pid);
  devProjectMap.set(Context.sender, devProjects);

  logging.log(`Created project ${name} by ${Context.sender}`);
  return pid;
}

export function updateProject(pid: string, name: string): void {
  assert(devProjectMap.contains(Context.sender));
  let project = projectMap.get(pid);
  if (!project) return;
  project.name = name;
  logging.log(`Updated project ${name} by ${Context.sender}`);
}

export function deleteProject(pid: string): void {
  assert(devProjectMap.contains(Context.sender) && projectMap.contains(pid));

  let devProjects = devProjectMap.get(Context.sender);
  if (!devProjects) return;
  assert(devProjects?.includes(pid));

  let project = projectMap.get(pid);
  if (!project) return;
  // project.databases = [];

  projectMap.delete(pid);
  devProjects = devProjects?.filter((projectID) => projectID !== pid);
  devProjectMap.set(Context.sender, devProjects);
  logging.log(`Deleted project ${pid}`);
}

export function addDatabase(details: any, pid: string): void {
  assert(devProjectMap.contains(Context.sender));
  let project = projectMap.get(pid);
  if (!project) return;
  let database = new Database(details.url, details.name, details.type);
  project.addDatabase(database);
  logging.log(`Added database ${details.url} to project ${pid}`);
}

export function deleteDatabase(pid: string, name: string): void {
  let project = projectMap.get(pid);
  if (!project) return;
  for (let i = 0; i < project.databases.length; i++) {
    let database = project.databases[i];
    if (database.name == name) {
      project.databases.splice(i, 1);
      break;
    }
  }
  logging.log(`Deleted database ${name} from project ${pid}`);
}

export function getProjectDetails(pid: string): Project | null {
  logging.log(`Getting project details for ${pid}`);
  return projectMap.get(pid);
}

export function getAllProjects(): Array<any> {
  let projects: Array<any> = [];
  const project_ids = devProjectMap.get(Context.sender) || [];
  project_ids.forEach((pid) => {
    let project = projectMap.get(pid);
    if (project) {
      projects.push({
        name: project.name,
        numUsers: project.users.size,
        numDatabases: project.databases.length,
      });
    }
  });
  return projects;
}

// User Functions

// export function createUser(pid: string): void {
//   let project = projectMap.get(pid);
//   if (!project) return;
//   let user = new User(Context.sender);
//   project.addUser(user);
//   logging.log(`Created user ${Context.sender} in project ${pid}`);
// }

// export function userExists(pid: string): bool {
//   let project = projectMap.get(pid);
//   return project != null && project.users.has(Context.sender);
// }

export function getDatabaseAddress(pid: string, name: string): Database | null {
  let project = projectMap.get(pid);
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
