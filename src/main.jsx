
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import { ToastProvider } from './providers/ToastProvider';
import { ConfirmProvider } from './providers/ConfirmProvider';
import { LoadingProvider } from './providers/LoadingProvider';
import { DialogProvider } from './providers/DialogProvider';

import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './styles/global.css';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <ToastProvider>
      <DialogProvider>
        <ConfirmProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </ConfirmProvider>
      </DialogProvider>
    </ToastProvider>
  </React.StrictMode>
);