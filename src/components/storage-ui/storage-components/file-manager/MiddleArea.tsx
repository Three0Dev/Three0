import React from 'react'
import SideBar from './SideBar'
import Body from './Body'

export default function MiddleArea({
	collapsed,
	setCollapsed,
	structure,
	currentPath,
	setCurrentPath,
	openFile,
	reload,
	rename,
	selection,
	setSelection,
	labels,
	loading,
	enabledFeatures,
}) {
	return (
		<div className="FileManager-MiddleArea">
			<SideBar
				labels={labels}
				structure={structure}
				currentPath={currentPath}
				setCurrentPath={setCurrentPath}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
			/>
			<Body
				structure={structure}
				rename={rename}
				currentPath={currentPath}
				setCurrentPath={setCurrentPath}
				openFile={openFile}
				reload={reload}
				selection={selection}
				setSelection={setSelection}
				enabledFeatures={enabledFeatures}
			/>
		</div>
	)
}
