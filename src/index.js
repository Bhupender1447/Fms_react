import React from "react";
import axios from "axios";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./design-system/tokens.css";
import "./design-system/primitives.css";
import App from "./App";

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <HelmetProvider>
  <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
  </React.StrictMode>
);
// basename="/new"
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
