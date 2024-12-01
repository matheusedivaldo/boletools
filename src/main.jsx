import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//Fontes
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)