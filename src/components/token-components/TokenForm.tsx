import React from 'react'
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	TextField,
} from '@mui/material'

interface TokenFormProps {
	pid: string
}

export default function TokenForm({ pid }: TokenFormProps) {
	const [useDefault, setUseDefault] = React.useState(false)

	return (
		<FormControl fullWidth sx={{ margin: '2% 0' }}>
			<FormControlLabel
				control={
					<Checkbox
						checked={useDefault}
						onChange={(event) => {
							setUseDefault(event.target.checked)
						}}
						name="default"
						id="default"
					/>
				}
				label="Use default token metadata"
			/>
			{!useDefault && (
				<FormControl fullWidth sx={{ margin: '2% 0' }}>
					<TextField
						id="token-name"
						label="Token Name"
						defaultValue={pid}
						// variant="filled"
					/>
					<br />
					<TextField
						id="token-symbol"
						label="Token Symbol"
						// defaultValue={pid}
						// variant="filled"
					/>
					<br />
					<Button variant="contained" component="label">
						Upload icon
						<input hidden accept="image/*" multiple type="file" />
					</Button>
				</FormControl>
			)}
		</FormControl>
	)
}
