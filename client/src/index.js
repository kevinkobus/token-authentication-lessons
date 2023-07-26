import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import "./css/styles.css"
import { UserContextProvider } from "./context/UserContextProvider"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <UserContextProvider>
      <App />
    </UserContextProvider> 
    </BrowserRouter>
  </React.StrictMode>
);
