import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css'; // Tailwind CSS import
import Zoomle from './games/Zoomle';
import Emovi from './games/Emovi';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/zoomle" replace />} />
        <Route path="/zoomle" element={<Zoomle />} />
        <Route path="/emovi" element={<Emovi />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
