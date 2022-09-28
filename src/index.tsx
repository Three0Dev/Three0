// import React from 'react'
import { createRoot } from 'react-dom/client'
import Core from './Core'
import { initContract } from './utils'

initContract()
	.then(() => {
		const container = document.querySelector('#root')
		const root = createRoot(container)
		// eslint-disable-next-line react/jsx-filename-extension
		root.render(<Core />)
	})
	.catch(console.error)
