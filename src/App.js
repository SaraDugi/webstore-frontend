import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import HomePage from './pages/homepage';
import ProductsPage from './pages/productspage';
import UserProfile from './pages/userprofile';
import UserOrders from './pages/orders';
import SettingsPage from './pages/settings';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
