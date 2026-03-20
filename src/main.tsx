import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for environments where window.fetch is read-only
try {
  if (typeof window !== 'undefined' && !window.fetch) {
    // Only attempt to define if it's missing, but the error suggests it's a getter.
    // We can't easily fix a read-only getter, but we can try to wrap the app
    // or ensure no library tries to overwrite it.
  }
} catch (e) {
  console.warn('Could not check/fix window.fetch:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
