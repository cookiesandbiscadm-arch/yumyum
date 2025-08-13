
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { useSmoothScrolling } from './hooks/useSmoothScrolling';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load non-critical components
const ProductCatalog = lazy(() => import('./pages/ProductCatalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const ProductCardDemo = lazy(() => import('./pages/ProductCardDemo'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  useSmoothScrolling();


  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent1 overflow-x-hidden">
            <Header />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/catalog" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ProductCatalog />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/product/:id" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ProductDetail />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/cart" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <CartPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/thank-you" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ThankYouPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/product-card-demo" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ProductCardDemo />
                    </Suspense>
                  } 
                />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;