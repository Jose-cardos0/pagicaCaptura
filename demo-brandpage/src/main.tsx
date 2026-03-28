import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        className: '!bg-zinc-800 !text-white !border !border-zinc-600',
        duration: 2800,
      }}
    />
  </StrictMode>,
)
