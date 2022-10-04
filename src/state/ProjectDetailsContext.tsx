import { createContext } from 'react'

type State = {
    projectDetails: any
}
const obj: State = {} as State;
const ProjectDetailsContext = createContext(obj)

export default ProjectDetailsContext
