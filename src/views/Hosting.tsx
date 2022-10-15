import React from 'react'
import { UploadSystem } from '../components/hosting-components'

export default function Hosting() {
	const [isHostingEnabled, setIsHostingEnabled] = React.useState(false)

	const isHostingEnabledCheck = () => {
		setIsHostingEnabled(true)
	}

	React.useEffect(() => isHostingEnabledCheck(), [])

	return isHostingEnabled ? <UploadSystem /> : <>hi</>
}