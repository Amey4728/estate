import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MiteshRealEstateApp from "../mitesh-realestate.jsx";

// Admin-only leads page at /#/dashboard — loaded on demand so visitors to the
// public site never download it.
const Dashboard = lazy(() => import("./Dashboard.jsx"));
const onDashboard = () => window.location.hash.startsWith("#/dashboard");

function Root() {
  const [dashboard, setDashboard] = useState(onDashboard);

  useEffect(() => {
    const sync = () => setDashboard(onDashboard());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return dashboard
    ? <Suspense fallback={null}><Dashboard /></Suspense>
    : <MiteshRealEstateApp />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
