import React from 'react';
import { createRoot } from 'react-dom/client';
import Veylora from './Veylora.jsx';
import Startup from './Startup.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><Startup><Veylora /></Startup></React.StrictMode>
);
