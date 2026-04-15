import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import JobList from "./pages/Jobs/JobList";
import NewJob from "./pages/Jobs/NewJob";
import JobDetail from "./pages/Jobs/JobDetail";
import CustomerList from "./pages/Customers/CustomerList";
import PricingConfig from "./pages/Pricing/PricingConfig";
import InvoiceList from "./pages/Invoices/InvoiceList";
import Reports from "./pages/Reports/Reports";

function Protected({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<JobList />} />
        <Route path="jobs/new" element={<NewJob />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="customers" element={<CustomerList />} />
        <Route
          path="pricing"
          element={
            <AdminOnly>
              <PricingConfig />
            </AdminOnly>
          }
        />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
