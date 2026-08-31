import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import UpdateBanner from './components/UpdateBanner.jsx';
// Solo el subconjunto latino. El paquete completo arrastraba devanagari,
// cirilico y latin-ext al build: el archivo devanagari solo pesaba cinco veces
// mas que el latino que si se usa.
//
// Los pesos reales evitan que el navegador sintetice la negrita, que es lo que
// pasaba con 337 usos de font-black y 275 de font-bold sobre un unico peso 400.
// Poppins solo para la landing.
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import '@fontsource/poppins/latin-900.css';
import './index.css';
import { initNotify } from './lib/notify.js';
// Bones capturadas del UI real (boneyard-js). Se regeneran con `npm run bones`.
import './bones/registry.js';

initNotify();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <UpdateBanner />
    </BrowserRouter>
  </React.StrictMode>
);
