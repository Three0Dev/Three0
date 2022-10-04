import React, { useEffect, useState } from 'react'
import TopBar from './TopBar'
import Footer from './Footer'
import MiddleArea from './MiddleArea'
import './FileManager.css'

const defaultLabels = {
	fileSingle: 'file',
	fileMultiple: 'files',
	folderSingle: 'folder',
	folderMultiple: 'folders',
	root: 'Root',
	home: 'Home',
	up: 'Up',
	reload: 'Reload',
	upload: 'Upload',
	download: 'Download',
	delete: 'Delete',
	rename: 'Rename',
	createDirectory: 'Create directory',
}

export default function FileManager({
	getList,
	createDirectory,
	deletePaths,
	openFile,
	uploadFiles,
	rename,
	translations,
	features,
}: any) {
	const [collapsed, setCollapsed] = useState({})
	const [structure, setStructure] = useState({})
	const [currentPath, setCurrentPath] = useState('')
	const [lastPath, setLastPath] = useState('')
	const [selection, setSelection] = useState([])
	const [loading, setLoading] = useState(false)

	const labels = translations || defaultLabels

	const enabledFeatures = features || []
	if (!features) {
		if (createDirectory) {
			enabledFeatures.push('createDirectory')
		}
		if (deletePaths) {
			enabledFeatures.push('deletePaths')
		}
		if (uploadFiles) {
			enabledFeatures.push('uploadFiles')
		}
		if (rename) {
			enabledFeatures.push('rename')
		}
	}

	const load = async (path: string) => {
		try {
			const response = await getList(path)
			return response.map((item: { name: any; type: number }) => ({
				name: item.name,
				type: item.type === 1 ? 1 : 2,
			}))
		} catch (error: any) {
			console.error(error)
			return `Error: ${error.message}`
		}
	}

	const reload = async () => {
		setLoading(true)
		const updated: any = {}
		const notChanged: any = {}
		try {
			const paths = Object.keys(structure).filter((path) => {
				if (
					currentPath.indexOf(path) === 0 ||
					path.indexOf(currentPath) === 0
				) {
					return true
				}
				notChanged[path] = structure[path as keyof typeof structure]
				return false
			})
			if (paths.indexOf(currentPath) === -1) {
				paths.push(currentPath)
			}
			await Promise.all(
				paths.map((path) => {
					const promise = load(path)
					promise
						.then((list) => {
							if (list !== undefined) {
								updated[path] = list
								if (path === currentPath) {
									setLastPath(currentPath)
								}
							}
						})
						.catch(console.error)
					return promise
				})
			)
			setLoading(false)
		} catch (error) {
			setLoading(false)
			setCurrentPath(lastPath)
		}
		const processed = { ...notChanged, ...updated }
		const ordered: any = {}
		Object.keys(processed)
			.sort((a, b) => {
				if (a > b) {
					return 1
				}
				if (a < b) {
					return -1
				}
				return 0
			})
			.forEach((path) => {
				ordered[path] = processed[path]
			})
		setStructure(ordered)
	}

	useEffect(() => {
		reload()
		setSelection([])
	}, [currentPath])

	return (
		<div className={`FileManager${loading ? ' FileManager-Loading' : ''}`}>
			<TopBar
				currentPath={currentPath}
				setCurrentPath={setCurrentPath}
				createDirectory={createDirectory}
				uploadFiles={uploadFiles}
				labels={labels}
				reload={reload}
				enabledFeatures={enabledFeatures}
			/>
			<Footer
				structure={structure}
				setStructure={setStructure}
				currentPath={currentPath}
				selection={selection}
				enabledFeatures={enabledFeatures}
				labels={labels}
				deletePaths={deletePaths}
				reload={reload}
				rename={rename}
			/>
			<MiddleArea
				collapsed={collapsed}
				setCollapsed={setCollapsed}
				structure={structure}
				currentPath={currentPath}
				setCurrentPath={setCurrentPath}
				openFile={openFile}
				reload={reload}
				selection={selection}
				setSelection={setSelection}
				enabledFeatures={enabledFeatures}
				labels={labels}
				loading={loading}
				rename={rename}
			/>
		</div>
	)
}
