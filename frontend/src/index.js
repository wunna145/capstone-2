import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider from './auth/UserProvider';

// Get the root element where the React application will be mounted
const rootElement = document.getElementById('root');

// Create a root using createRoot from 'react-dom/client'
const root = createRoot(rootElement);

// Render the application within a UserProvider for managing user context
root.render(
  <React.StrictMode>
    <UserProvider>
      <div style={{ backgroundColor: '#05161A', color: 'white', minHeight: '100vh', height: '100%', paddingBottom: '20px' }}>
        <App />
      </div>
    </UserProvider>
  </React.StrictMode>
);

// Report web vitals for performance monitoring
reportWebVitals();
