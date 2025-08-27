import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {MotionConfig} from 'motion/react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig viewport={{ once: true }}>
      <App />
    </MotionConfig>    
  </StrictMode>,
)
