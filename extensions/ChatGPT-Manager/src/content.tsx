import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ContentPage from "./scripts/content";

const root = document.createElement("div");
root.id = "__ChatGPT_Manager";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ContentPage />
  </React.StrictMode>
);
