import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Core from './Core'
import { initContract } from './utils'


window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      // <App />
      <Core />,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
