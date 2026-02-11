import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'flag-icons/css/flag-icons.min.css';
import { SaveEditor } from './components/SaveEditor'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div className="app-container">
            <h1>PMD Save Editor</h1>
            <SaveEditor />
        </div>
    </StrictMode>,
)
