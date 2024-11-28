import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

// Clear any existing content and create fresh root
while (rootElement.firstChild) {
  rootElement.removeChild(rootElement.firstChild)
}

createRoot(rootElement).render(
  <AuthProvider>
    <App key={Date.now()} /> {/* Force remount with unique key */}
  </AuthProvider>
)