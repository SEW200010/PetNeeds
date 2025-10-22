import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Ensure global styles are loaded
import logo from "./assets/logoNew.png";

// Dynamically set favicon
const link = document.querySelector("link[rel~='icon']");
if (link) link.href = logo;


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
