import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// TODO: Replace with a dedicated MobileApp component if available.
// You can fork src/App.tsx into src/MobileApp.tsx and import it here instead.

const rootElement = document.getElementById('mobile-root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Mobile root element not found');
}
