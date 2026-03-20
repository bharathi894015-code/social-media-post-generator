// Global error handler for easy debugging on blank screens
window.onerror = function(message, source, lineno, colno, error) {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;color:red;padding:20px;font-family:monospace;z-index:9999;overflow:auto;';
  div.innerHTML = `<h1>Runtime Error Detected</h1><p><b>Message:</b> ${message}</p><p><b>Location:</b> ${source}:${lineno}:${colno}</p><pre style="background:#f5f5f5;padding:10px;border-radius:8px;margin-top:10px;">${error ? error.stack : 'No stack trace available'}</pre>`;
  document.body.appendChild(div);
  return false;
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log("🟢 main.tsx loaded! Starting createRoot...");
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
