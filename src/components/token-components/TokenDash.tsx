import React from 'react'

interface TokenDashProps {
	pid: string
}

export default function TokenDash({ pid }: TokenDashProps) {
	return (
		<div>
			<h1>Token Dash for {pid}</h1>
		</div>
	)
}
