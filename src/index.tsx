import React from 'react';
import { createRoot } from 'react-dom/client';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import * as serviceWorker from "./serviceWorker";


import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container!);

// const googleClientId = config.google?.token || 'your-default-client-id'; // Provide a default or fallback client ID

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
