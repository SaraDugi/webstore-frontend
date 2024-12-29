import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ItemPage from './pages/ItemPage';
import UserOrders from './pages/OrderPage';
import SettingsPage from './pages/SettingsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutusPage';
import { LogInContext } from './contexts/LoginContext';

const App = () => {
  const { loggedInUser } = React.useContext(LogInContext);

  const PrivateRoute = ({ children }) => {
    return loggedInUser ? children : <Navigate to="/login" />;
  };

  const products = [
    { id: 1, name: 'Product 1', price: '$19.99', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: '$29.99', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: '$39.99', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', price: '$49.99', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Product 5', price: '$59.99', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Product 6', price: '$69.99', image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Product 7', price: '$79.99', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage products={products} />} />
        <Route path="/products/:id" element={<ItemPage products={products} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <UserOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;