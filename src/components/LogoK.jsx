import React from 'react';

// Isotipo "K" de Kuentas Klaras incrustado (mismo dibujo que /KKiso.svg). Como
// <img>, Safari en iOS a veces no lo pintaba dentro de la barra animada al
// cambiar de pestaña; un SVG en linea siempre se dibuja.
const LogoK = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 709 726" className={className} role="img" aria-label="Kuentas Klaras">
    <path d="M35.957,116.916l0,480.847l252.318,-252.318l-252.318,-228.529Z" fill="#2dbc8b" />
    <path d="M35.727,116.875l165.471,-104.525l-0.509,700.574l-164.962,-115.173l0,-480.876Z" fill="#2dbc8b" />
    <path d="M35.957,322.147l383.337,-309.796l274.684,-0l-658.25,585.412l0.23,-275.616Z" fill="#6de0b3" />
    <path d="M35.727,369.85l383.273,343.074l274.978,0l-658.25,-596.009l0,252.935Z" fill="#6de0b3" />
  </svg>
);

export default LogoK;
