import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Context Providers
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
);
