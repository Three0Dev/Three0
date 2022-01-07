/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, logging, PersistentMap, base64, math} from 'near-sdk-as'
import {User, Database, Project} from './model'

// Dev Functions

let devProjectMap = new PersistentMap<string, Array<string>>('devProjectMap');
let projectMap = new PersistentMap<string, Project>('projectMap')

const DNA_DIGITS = 8

export function createDev(): void {
    if(devProjectMap.contains(Context.sender)) return
    devProjectMap.set(Context.sender, [])
    logging.log('Created dev account')
}

export function createProject(name: string = `Untitled Project`): void {
    if(!devProjectMap.contains(Context.sender)) return
    let project = new Project(Context.sender, name)

    const pid = base64.encode(math.randomBuffer(DNA_DIGITS));

    projectMap.set(pid, project)
    devProjectMap.get(Context.sender)?.push(pid)
    logging.log(`Created project ${name} by ${Context.sender}`)
}

export function addDatabase(details: any, pid: string): void {
    if(!devProjectMap.contains(Context.sender)) return
    let project = projectMap.get(pid)
    if(!project) return
    let database = new Database(details.url, details.name, details.type)
    project.addDatabase(database)
    logging.log(`Added database ${details.url} to project ${pid}`)
}

export function getProjectDetails(pid: string): Project | null{
  logging.log(`Getting project details for ${pid}`)
    return projectMap.get(pid)
}

export function getAllProjects(): Array<any> {
    let projects:Array<any> = []
    const project_ids = devProjectMap.get(Context.sender) || []
    project_ids.forEach(pid => {
        let project = projectMap.get(pid)
        if(project){
            projects.push({
                name: project.name,
                numUsers: project.users.size,
                numDatabases: project.databases.length,
            })
        }
    })
    return projects
}

// User Functions

export function createUser(pid: string, orbitID: string): void {
    let project = projectMap.get(pid)
    if(!project) return
    let user = new User(Context.sender, orbitID)
    project.addUser(user)
    logging.log(`Created user ${Context.sender} in project ${pid}`)
}

export function getDatabases(pid: string): Array<Database> {
    let project = projectMap.get(pid)
    logging.log(`Got databases for project ${pid}`)
    return project && project.users.has(Context.sender) ? project.databases : []
}