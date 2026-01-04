import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 应用入口：将 App 组件挂载到 DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
