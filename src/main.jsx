import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App_HourofAI.jsx'
import './styles/index.css'

console.log('main.jsx loaded')
console.log('root element:', document.getElementById('root'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
) 