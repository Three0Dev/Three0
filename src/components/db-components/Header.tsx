import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Toolbar, AppBar } from '@mui/material'
import StorageIcon from '@mui/icons-material/Storage'
import Search from '../templates/Search'

export default function Header() {
	const navigate = useNavigate()

	function handleKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key === 13) {
			if (event.target.value.length > 0) {
				navigate(`./search?q=${event.target.value}`)
			} else {
				navigate('./')
			}
		}
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar color="primary" position="static" sx={{ borderRadius: 5 }}>
				<Toolbar>
					<StorageIcon />
					&nbsp;
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
						align="left"
					>
						Database
					</Typography>
					<Search
						placeholder="Search…"
						onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyUp(e)}
						onChange={() => {}}
					/>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
