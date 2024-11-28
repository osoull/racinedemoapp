import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

// Clear any existing content
while (rootElement.firstChild) {
  rootElement.removeChild(rootElement.firstChild)
}

const root = createRoot(rootElement)

// Force a fresh render with a unique timestamp
root.render(
  <AuthProvider>
    <App key={`app-${Date.now()}`} />
  </AuthProvider>
)