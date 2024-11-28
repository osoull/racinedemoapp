import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

createRoot(rootElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)