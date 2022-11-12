import { useParams, useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react'
import {
	Box,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import StorageIcon from '@mui/icons-material/Storage'
import PublicIcon from '@mui/icons-material/Public'
import KeyIcon from '@mui/icons-material/Key'
import HomeIcon from '@mui/icons-material/Home'

export default function Navigation() {
	const [selectedIndex, setSelectedIndex] = React.useState(0)

	const tabs = ['Home', 'Authentication', 'Database', 'Storage', 'Hosting']
	const tabIcon = [
		<HomeIcon />,
		<KeyIcon />,
		<StorageIcon />,
		<FolderIcon />,
		<PublicIcon />,
	]

	const navigate = useNavigate()
	const { pid } = useParams()

	const location = useLocation()

	useEffect(() => {
		const path = location.pathname.split('/')
		const index = tabs.map((tab) => tab.toLowerCase()).indexOf(path[3])
		setSelectedIndex(index === -1 ? 0 : index)
	}, [])

	useEffect(() => {
		let url = `/${pid}`
		switch (selectedIndex) {
			case 1:
				url += '/auth'
				break
			case 2:
				url += '/database'
				break
			case 3:
				url += '/storage'
				break
			case 4:
				url += '/hosting'
				break
			default:
				break
		}
		navigate(url)
	}, [selectedIndex])

	// TODO Indicate selected tab
	return (
		<Box sx={{ bgcolor: 'primary.main', padding: '1%' }}>
			<List component="nav">
				{tabs.map((tab, index) => (
					<ListItemButton
						selected={index === selectedIndex}
						key={tab}
						style={{ color: 'white' }}
						onClick={() => setSelectedIndex(index)}
					>
						<ListItemIcon style={{ color: 'white' }}>
							{tabIcon[index]}
						</ListItemIcon>
						<ListItemText primary={tab} />
					</ListItemButton>
				))}
			</List>
		</Box>
	)
}
