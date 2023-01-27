import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ProductsProvider } from "./contexts/products.context";
import { CartProvider } from "./contexts/cart.context";

import App from "./App";
import { UserProvider } from "./contexts/user.context";
import "./index.scss";

const rootElement = document.getElementById("root");

render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </ProductsProvider>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
