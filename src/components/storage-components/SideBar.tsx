import React from 'react'
import { Paper, Box } from '@mui/material'
import SideBarTreeNode from './SideBarTreeNode'

export default function SideBar({
	structure,
	currentPath,
	setCurrentPath,
	collapsed,
	setCollapsed,
	labels,
}: any) {
	const tree: any[] = []
	const nodesByPath: any = {}

	Object.keys(structure || {}).forEach((path) => {
		const parts = path.split('/')
		let tmpPath = ''
		let childNodes = tree
		parts.forEach((part, index) => {
			tmpPath += (index > 0 ? '/' : '') + part
			if (!nodesByPath[tmpPath as keyof typeof nodesByPath]) {
				const node = { name: part, path: tmpPath, children: [] }
				childNodes.push(node)
				nodesByPath[tmpPath] = node
			}
			childNodes = nodesByPath[tmpPath as keyof typeof nodesByPath].children
			if (index === parts.length - 1) {
				const children = (structure[tmpPath] || [])
					.filter((item: { type: number }) => item.type === 2)
					.map((item: { name: any }) => ({
						name: item.name,
						path: `${tmpPath}/${item.name}`,
						children: [],
					}))
				children.forEach((item: { name: any }) => {
					if (!childNodes.find((node) => node.name === item.name)) {
						childNodes.push(item)
						nodesByPath[`${tmpPath}/${item.name}`] = item
					}
				})
			}
		})
	})

	return (
		<Box component={Paper} className="FileManager-SideBar">
			<SideBarTreeNode
				node={tree[0] || {}}
				labels={labels}
				structure={structure}
				currentPath={currentPath}
				setCurrentPath={setCurrentPath}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
				level={0}
			/>
		</Box>
	)
}
