import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MiteshRealEstateApp from "../mitesh-realestate.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MiteshRealEstateApp />
  </React.StrictMode>
);
