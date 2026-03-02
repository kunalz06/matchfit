import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Customer from './pages/Customer';
import TrackOrder from './pages/TrackOrder';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TailorLogin from './pages/TailorLogin';
import TailorDashboard from './pages/TailorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tailor-login" element={<TailorLogin />} />
        <Route path="/tailor-dashboard" element={<TailorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
