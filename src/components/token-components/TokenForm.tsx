import React from 'react'
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	IconButton,
	TextField,
	Typography,
} from '@mui/material'
import Close from '@mui/icons-material/Close'

interface TokenFormProps {
	pid: string
}

export default function TokenForm({ pid }: TokenFormProps) {
	const [useIcon, setUseIcon] = React.useState(true)
	const [icon, setIcon] = React.useState('')

	return (
		<FormControl fullWidth sx={{ margin: '2% 0' }}>
			<Typography variant="h6">Set up your token</Typography>
			<br />
			<TextField
				id="token-name"
				label="Token Name"
				defaultValue={pid}
				helperText={
					<FormHelperText>The human-readable name of the token</FormHelperText>
				}
			/>
			<br />
			<TextField
				id="token-symbol"
				label="Token Symbol"
				helperText={
					<FormHelperText>The abbreviation, like wETH or AMPL.</FormHelperText>
				}
				// defaultValue={pid}
				// variant="filled"
			/>
			<br />
			<TextField
				id="token-decimals"
				label="Token Significant Digits"
				type="number"
				helperText={
					<FormHelperText>
						Check out{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://docs.openzeppelin.com/contracts/3.x/erc20#a-note-on-decimals"
						>
							this article
						</a>{' '}
						for more information
					</FormHelperText>
				}
				defaultValue={18}
				// variant="filled"
			/>
			<br />
			<TextField
				id="token-supply"
				label="Token Initial Supply"
				type="number"
				helperText={
					<FormHelperText>
						Initial supply of the token sent to your project account
					</FormHelperText>
				}
				defaultValue={1000000000000000}
				// variant="filled"
			/>
			<br />
			<TextField
				id="token-exchange"
				label="Token Exchange Rate"
				type="number"
				helperText={
					<FormHelperText>
						How many FTs are needed to be worth 1 NEAR
					</FormHelperText>
				}
				defaultValue={10}
				// variant="filled"
			/>
			<FormControlLabel
				control={
					<Checkbox
						checked={useIcon}
						onChange={(event) => {
							setUseIcon(event.target.checked)
						}}
						name="use-icon"
						id="use-icon"
						color="primary"
					/>
				}
				label="Choose an icon for your token"
			/>
			{useIcon && (
				<FormControl fullWidth sx={{ margin: '2% 0' }}>
					<Button variant="contained" component="label" color="primary">
						Upload icon
						<input
							hidden
							accept="image/*"
							type="file"
							id="token-icon"
							onChange={(event) => {
								const file = event.target.files![0]
								const reader = new FileReader()
								reader.onloadend = () => {
									setIcon(reader.result)
								}
								reader.readAsDataURL(file)
							}}
						/>
					</Button>
				</FormControl>
			)}
			{useIcon && icon !== '' && (
				<>
					<br />
					<Box>
						<img
							src={icon}
							id="token-icon-preview"
							alt="token-icon"
							style={{
								width: '100px',
								height: '100px',
							}}
						/>
						<IconButton
							onClick={() => setIcon('')}
							sx={{ position: 'relative', right: '0', top: '0' }}
							title="Remove selected icon"
						>
							<Close />
						</IconButton>
					</Box>
				</>
			)}
		</FormControl>
	)
}
