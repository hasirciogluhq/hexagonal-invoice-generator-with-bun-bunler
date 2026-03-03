import { useState } from 'react'
import { createRoot } from 'react-dom/client'

// import "./globals.css"
import App from '../app/app'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)