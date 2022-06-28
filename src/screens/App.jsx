import React, { useEffect } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { IconButton, AppBar, Toolbar, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import UpdatedLogo from '../assets/logos/UpdatedLogo.png'
import { logout } from '../utils'

function TopBar() {
	return (
		<AppBar
			sx={{
				background: 'whitesmoke',
			}}
		>
			<Toolbar>
				<Link to="/">
					<img width="75" src={UpdatedLogo} alt="Logo" />
				</Link>
				<Typography fontWeight="bold" variant="h5" color="primary">
					Three0
				</Typography>
				<IconButton
					style={{
						position: 'absolute',
						right: '2%',
						color: '#707070',
					}}
					aria-label="logout"
					onClick={logout}
				>
					<LogoutIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}

export default function App() {
	const navigate = useNavigate()
	useEffect(() => {
		if (!window.walletConnection.isSignedIn()) {
			navigate('/login')
		}
	}, [])

	return (
		<>
			<TopBar />
			{/* DO NOT REMOVE - THIS EXISTS FOR SPACING AS RECOMMENDED BY MATERIAL UI */}
			<Toolbar />
			<Outlet />
		</>
	)
}
