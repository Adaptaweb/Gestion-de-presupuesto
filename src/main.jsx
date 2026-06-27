import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import UpdateBanner from './components/UpdateBanner.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <UpdateBanner />
  </React.StrictMode>
);
