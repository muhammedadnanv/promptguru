import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Imaging from '@/pages/Imaging';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/auth" element={<div className="min-h-screen flex items-center justify-center text-2xl text-white">Authentication has been disabled.</div>} />
          <Route path="/" element={<Index />} />
          <Route path="/imaging" element={<Imaging />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
