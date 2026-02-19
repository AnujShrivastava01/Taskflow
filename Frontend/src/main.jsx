// =============================================================
// MAIN ENTRY POINT - main.jsx
// =============================================================
// This is the first JavaScript file that runs when the app loads.
//
// It does two things:
// 1. Imports the global CSS (which includes TailwindCSS)
// 2. Renders the <App /> component into the DOM
//
// createRoot vs ReactDOM.render:
// createRoot is the React 18+ API that enables:
// - Concurrent rendering (smoother UI updates)
// - Automatic batching (fewer re-renders)
// - Transitions API
//
// StrictMode:
// Wrapping in <StrictMode> helps catch bugs by:
// - Double-invoking effects in development
// - Detecting deprecated APIs
// - Warning about unsafe lifecycle methods
// =============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
