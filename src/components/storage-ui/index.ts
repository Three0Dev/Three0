import FileManager from './storage-components/file-manager/FileManager'

export const paths = {
	'': [
		{ name: 'New folder 1', type: 2 },
		{ name: 'New folder 2', type: 2 },
		{ name: 'New folder 3', type: 2 },
		{ name: 'file.txt', type: 1 },
	],
	'/New folder 1': [
		{ name: 'New folder 2', type: 2 },
		{ name: 'file 2.txt', type: 1 },
	],
	'/New folder 2': [{ name: 'file 5.txt', type: 1 }],
	'/New folder 3': [{ name: 'file 6.txt', type: 1 }],
	'/New folder 1/New folder 2': [{ name: 'New folder 3', type: 2 }],
	'/New folder 1/New folder 2/New folder 3': [
		{ name: 'New folder 4', type: 2 },
	],
	'/New folder 1/New folder 2/New folder 3/New folder 4': [],
}

export const getList = (path) =>
	new Promise((resolve, reject) => {
		setTimeout(() => (paths[path] ? resolve(paths[path]) : reject()), 100)
	})

export const createDirectory = (path) =>
	new Promise((resolve) => {
		setTimeout(resolve, 100)
	})

export const deletePaths = (paths) =>
	new Promise((resolve) => {
		setTimeout(resolve, 100)
	})

export const openFile = (path) => {
	alert(`openFile ${path}`)
}

export const rename = (path) =>
	new Promise((resolve) => {
		setTimeout(resolve, 100)
	})

export const uploadFiles = (path, files) =>
	new Promise((resolve) => {
		setTimeout(resolve, 100)
	})

export default FileManager
