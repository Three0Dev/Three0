// import React from 'react'
import { createRoot } from 'react-dom/client'
import Core from './Core'
import { initContract } from './utils'

export {}
declare global {
	interface Window {
		contract: any
		accountId: string
		near: any
		walletConnection: any
	}
}

initContract()
	.then(() => {
		const container = document.querySelector('#root')
		const root = createRoot(container as any)
		// eslint-disable-next-line react/jsx-filename-extension
		root.render(<Core />)
	})
	.catch(console.error)
