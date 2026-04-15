import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15,10,30,0.95)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
