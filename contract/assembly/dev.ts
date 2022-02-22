import {
    Context,
    logging,
    base64,
    math,
  } from "near-sdk-as";
  import { Database, Project } from "./model";
  import { DEV_PROJECT_MAP, PROJECT_MAP } from "./datastore";

const DNA_DIGITS = 8; 

export function createDev(): void {
  assert(!DEV_PROJECT_MAP.contains(Context.sender));
  DEV_PROJECT_MAP.set(Context.sender, new Array<string>());
  logging.log("Created dev account");
}

export function createProject(name: string = `Untitled Project`): string {
  assert(DEV_PROJECT_MAP.contains(Context.sender));
  let project = new Project(Context.sender, name);

  const pid = base64.encode(math.randomBuffer(DNA_DIGITS));

  PROJECT_MAP.set(pid, project);

  let devProjects = DEV_PROJECT_MAP.get(Context.sender);
  devProjects = devProjects ? devProjects : new Array<string>();
  devProjects.push(pid);
  DEV_PROJECT_MAP.set(Context.sender, devProjects);

  logging.log(`Created project ${name} by ${Context.sender}`);
  return pid;
}

export function updateProject(pid: string, name: string): void {
  assert(DEV_PROJECT_MAP.contains(Context.sender));
  let project = PROJECT_MAP.get(pid);
  if (!project) return;
  project.name = name;
  logging.log(`Updated project ${name} by ${Context.sender}`);
}

export function deleteProject(pid: string): void {
  assert(DEV_PROJECT_MAP.contains(Context.sender));

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

@nearBindgen
export class DatabaseInfoSchema {
  url: string;
  name: string;
  type: string;
}

export function addDatabase(details: DatabaseInfoSchema, pid: string): void {
  assert(DEV_PROJECT_MAP.contains(Context.sender));
  let project = PROJECT_MAP.get(pid);
  if (!project) return;
  let database = new Database(details.url, details.name, details.type);
  project.addDatabase(database);
  logging.log(`Added database ${details.url} to project ${pid}`);
}

export function deleteDatabase(pid: string, name: string): void {
  let project = PROJECT_MAP.get(pid);
  if (!project) return;
  for(let i = 0; i < project.databases.length; i++) {
    if (project.databases[i].name === name) {
      project.databases = project.databases.splice(i, 1);
      break;
    }
  }
  logging.log(`Deleted database ${name} from project ${pid}`);
}

export function getProjectDetails(pid: string): Project | null {
  logging.log(`Getting project details for ${pid}`);
  return PROJECT_MAP.get(pid);
}

@nearBindgen
export class ProjectReturnSchema {
    pid: string;
    name: string;
    numUsers: number;
    numDatabases: number;
}

export function getAllProjects(): Array<ProjectReturnSchema> {
  let projects: Array<ProjectReturnSchema> = [];
  const project_ids = DEV_PROJECT_MAP.get(Context.sender);
  if (!project_ids) return projects;
  for(let i = 0; i < project_ids.length; i++) {
    const pid = project_ids[i];
    let project = PROJECT_MAP.get(pid);
    if (project) {
      let projectReturn: ProjectReturnSchema = {
        pid: pid,
        name: project.name,
        numUsers: project.users.size,
        numDatabases: project.databases.length,
      }
      projects.push(projectReturn);
    }
  }
  return projects;
}