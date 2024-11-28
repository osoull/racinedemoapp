import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Force a fresh render by clearing and recreating the root
const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

const root = createRoot(rootElement)
root.render(<App key={Date.now()} />)