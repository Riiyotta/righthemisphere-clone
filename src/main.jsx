import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './pages/pages.css';
import Router from './Router.jsx';

// Router renders the existing <App/> unchanged for "/".
createRoot(document.getElementById('root')).render(<Router />);
