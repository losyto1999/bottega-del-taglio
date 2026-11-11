import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './bottega.css'
import './i18n'
import './portfolio/fromPortfolio'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
