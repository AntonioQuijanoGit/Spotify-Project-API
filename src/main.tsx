import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        if (import.meta.env.DEV) {
          if (import.meta.env.DEV) {
            console.log('SW registered: ', registration);
          }
        }
      })
      .catch((registrationError) => {
        if (import.meta.env.DEV) {
          if (import.meta.env.DEV) {
            console.error('SW registration failed: ', registrationError);
          }
        }
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
