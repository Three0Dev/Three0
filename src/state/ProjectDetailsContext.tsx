import { createContext } from 'react'

type State = {
	pid: string
	projectDetails: any
	projectContract: any
}
const obj: State = {} as State
const ProjectDetailsContext = createContext(obj)

export default ProjectDetailsContext
