import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider from './auth/UserProvider';

// Create a root for concurrent rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application within a UserProvider for managing user context
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

// Report web vitals for performance monitoring
reportWebVitals();
