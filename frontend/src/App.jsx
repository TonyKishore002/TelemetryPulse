import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Workstation from './pages/Workstation';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page — preserved exactly as designed */}
        <Route path="/" element={<LandingPage />} />

        {/* Unified SRE Workstation — single-page 3-section dashboard */}
        <Route path="/workstation" element={<Workstation />} />

        {/* Legacy sub-routes redirect to unified workstation */}
        <Route path="/command-center" element={<Navigate to="/workstation" replace />} />
        <Route path="/investigation" element={<Navigate to="/workstation" replace />} />
        <Route path="/verification" element={<Navigate to="/workstation" replace />} />
        <Route path="/results" element={<Navigate to="/workstation" replace />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
