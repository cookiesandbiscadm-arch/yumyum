import React, { Suspense } from 'react';

// Lazy load route components for code splitting
const ProductCatalog = React.lazy(() => import('../pages/ProductCatalog'));
const ProductDetail = React.lazy(() => import('../pages/ProductDetail'));
const CartPage = React.lazy(() => import('../pages/CartPage'));
const ThankYouPage = React.lazy(() => import('../pages/ThankYouPage'));

// Loading fallback component
const RouteLoader: React.FC = () => (
  <div className="pt-20 min-h-screen bg-secondary flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">🍪</div>
      <p className="font-poppins text-textBody">Loading delicious content...</p>
    </div>
  </div>
);

// Wrapped lazy components with Suspense
export const LazyCatalog: React.FC = () => (
  <Suspense fallback={<RouteLoader />}>
    <ProductCatalog />
  </Suspense>
);

export const LazyProductDetail: React.FC = () => (
  <Suspense fallback={<RouteLoader />}>
    <ProductDetail />
  </Suspense>
);

export const LazyCart: React.FC = () => (
  <Suspense fallback={<RouteLoader />}>
    <CartPage />
  </Suspense>
);

export const LazyThankYou: React.FC = () => (
  <Suspense fallback={<RouteLoader />}>
    <ThankYouPage />
  </Suspense>
);
