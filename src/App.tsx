import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { useSmoothScrolling } from './hooks/useSmoothScrolling';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import ThankYouPage from './pages/ThankYouPage';

function App() {
  useSmoothScrolling();

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent1 overflow-x-hidden">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;