import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './services/audioArbiter';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Portal Master Pen Training">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
