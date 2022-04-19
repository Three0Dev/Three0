import React from 'react'
import ReactDOM from 'react-dom'
import { Core } from './Core'
import { initContract } from './utils'


initContract()
  .then(() => {
    ReactDOM.render(
      <Core  />,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
