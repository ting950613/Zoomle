import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Zoomle from './games/Zoomle';
import Emovi from './games/Emovi';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/zoomle" element={<Zoomle />} />
        <Route path="/emovi" element={<Emovi />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
