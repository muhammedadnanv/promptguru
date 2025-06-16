
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from '@/pages/Home';
import Workspace from '@/pages/Workspace';
import NotFound from '@/pages/NotFound';
import Imaging from '@/pages/Imaging';
import Payment from '@/pages/Payment';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/auth" element={<div className="min-h-screen flex items-center justify-center text-2xl text-white">Authentication has been disabled.</div>} />
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/imaging" element={<Imaging />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
