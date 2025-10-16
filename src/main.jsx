import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './Route.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Toaster />
          <App />
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  </StrictMode>,
)
