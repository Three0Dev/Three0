import { PersistentMap } from "near-sdk-as";
import { Project } from "./model";

export const DEV_PROJECT_MAP = new PersistentMap<string, Array<string>>("devProjectMap");
export const PROJECT_MAP = new PersistentMap<string, Project>("projectMap");