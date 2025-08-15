
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { useSmoothScrolling } from './hooks/useSmoothScrolling';
import { useMediaQuery } from './hooks/useMediaQuery';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import ThankYouPage from './pages/ThankYouPage';
import ProductCardDemo from './pages/ProductCardDemo';

function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  useSmoothScrolling({ enabled: isDesktop });

  return (
    <ToastProvider>
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
              <Route path="/product-card-demo" element={<ProductCardDemo />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;