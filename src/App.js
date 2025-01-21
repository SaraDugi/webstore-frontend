import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import UserOrders from './pages/OrderPage';
import SettingsPage from './pages/SettingsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutusPage';
import PaymentHistory from './pages/PaymentHistory';
import { LogInProvider, LogInContext } from './contexts/LoginContext';
import { CartProvider } from './contexts/CartContext';
import UsersPage from './pages/UsersPage';

const App = () => {
  return (
    <LogInProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/orders" element={<PrivateRoute component={UserOrders} />} />
            <Route path="/settings" element={<PrivateRoute component={SettingsPage} />} />
            <Route path="/payment-history" element={<PrivateRoute component={PaymentHistory} />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </LogInProvider>
  );
};

// PrivateRoute component ensures the user is logged in before accessing protected pages
const PrivateRoute = ({ component: Component }) => {
  const { loggedInUser } = React.useContext(LogInContext);
  return loggedInUser ? <Component /> : <Navigate to="/login" />;
};

export default App;