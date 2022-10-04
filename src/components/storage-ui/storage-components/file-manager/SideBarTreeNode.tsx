import React from 'react'
import FolderIcon from '@mui/icons-material/Folder'
import { Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const OFFSET = 16

export default function SideBarTreeNode({
	node,
	labels,
	structure,
	currentPath,
	setCurrentPath,
	collapsed,
	setCollapsed,
	level,
}: any) {
	return (
		<div className="SideBar-TreeNode">
			<div
				className={`TreeNode-Name${
					currentPath === node.path ? ' TreeNode-Current' : ''
				}`}
				onClick={() => {
					if (currentPath === node.path) {
						setCollapsed({ ...collapsed, [node.path]: !collapsed[node.path] })
					} else {
						setCollapsed({ ...collapsed, [node.path]: false })
					}
					setCurrentPath(node.path)
				}}
				style={{ paddingLeft: `${8 + (level || 0) * OFFSET}px` }}
				aria-hidden="true"
			>
				{!collapsed[node.path] && structure[node.path] ? (
					<ArrowDropDownIcon />
				) : (
					<FolderIcon />
				)}
				&nbsp;
				<Typography
					variant="h6"
					noWrap
					sx={{
						flexGrow: 1,
						fontSize: '16px',
						display: { xs: 'none', sm: 'block' },
					}}
				>
					{node.name || labels.root}
				</Typography>
			</div>
			{!!node.children && !!node.children.length && !collapsed[node.path] && (
				<div className="TreeNode-Children">
					{node.children.map((item: any) => (
						<SideBarTreeNode
							key={node.path}
							node={item}
							labels={labels}
							level={(level || 0) + 1}
							currentPath={currentPath}
							setCurrentPath={setCurrentPath}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							structure={structure}
						/>
					))}
				</div>
			)}
		</div>
	)
}
