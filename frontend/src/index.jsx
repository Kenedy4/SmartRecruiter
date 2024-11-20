import React from 'react';
import ReactDOM from 'react-dom/client'; // Use `react-dom/client`
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import App from './App';
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
