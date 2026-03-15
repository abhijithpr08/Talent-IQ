import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider, } from "@tanstack/react-query"
import { ThemeProvider } from './context/ThemeContext'

console.log("main.jsx: Starting application");

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

console.log("main.jsx: Clerk key found, initializing providers");
const queryClient = new QueryClient()

console.log("main.jsx: Rendering app");
createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>

)
