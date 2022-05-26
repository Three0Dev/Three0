import React from 'react'
import { Core } from './Core'
import { initContract } from './utils'
import { createRoot } from 'react-dom/client';


initContract()
  .then(() => {
    const container = document.querySelector('#root');
    const root = createRoot(container);
    root.render(<Core />);
  })
  .catch(console.error)
