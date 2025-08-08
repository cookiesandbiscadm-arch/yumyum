import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { useSmoothScrolling } from './hooks/useSmoothScrolling';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import { LazyCatalog, LazyProductDetail, LazyCart, LazyThankYou } from './components/LazyRoutes';

function App() {
  useSmoothScrolling();

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent1 overflow-x-hidden">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<LazyCatalog />} />
            <Route path="/product/:id" element={<LazyProductDetail />} />
            <Route path="/cart" element={<LazyCart />} />
            <Route path="/thank-you" element={<LazyThankYou />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;