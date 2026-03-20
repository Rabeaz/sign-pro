import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for environments where window.fetch is read-only and some library tries to overwrite it
(function() {
  try {
    const originalFetch = window.fetch;
    if (originalFetch) {
      Object.defineProperty(window, 'fetch', {
        get() { return originalFetch; },
        set() { 
          console.warn('An attempt to overwrite window.fetch was blocked to prevent a TypeError.');
        },
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    console.warn('Could not wrap window.fetch:', e);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
