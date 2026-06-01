import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#121212' }}>
    <div className="text-center">
      <div
        className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
      />
      <p className="text-white/70 text-sm">Loading PitchCraft...</p>
    </div>
  </div>
);

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);

// Performance monitoring (development only)
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('📊 Performance Metrics:');
        console.log(`  DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
        console.log(`  Page Load: ${Math.round(perfData.loadEventEnd)}ms`);
      }
    }, 0);
  });
}

// Register service worker for production (PWA support)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}
