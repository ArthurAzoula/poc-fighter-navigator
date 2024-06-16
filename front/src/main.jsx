import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const modes = {
  production: '🚀',
  development: '🔧',
  test: '🧪',
};

document.title = `${modes[import.meta.env.MODE]} ${document.title}`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
