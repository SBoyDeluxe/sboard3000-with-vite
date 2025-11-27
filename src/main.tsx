import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './modules/react/components/App.tsx'
import { FirebaseAPIClient } from './modules/firebaseapiClient.ts'
import { BrowserRouter, Router } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter basename='/sboard3000-with-vite/' >
    <App firebaseClient={new FirebaseAPIClient} />
    </BrowserRouter>
)
