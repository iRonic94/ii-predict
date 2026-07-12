import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import './styles/main.scss'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#1f1f1f',
            color: '#fff',
            border: '1px solid #333',
          },
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>,


)
