import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { HospitalProvider } from "./context/HospitalContext";

// ── Layout ────────────────────────────────────────────────────────────────────
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";

// ── Public Website Pages ──────────────────────────────────────────────────────
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import SchemesPage from "./pages/SchemesPage";
import HealthCampsPage from "./pages/HealthCampsPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AppointmentPage from "./pages/AppointmentPage";

// ── Auth Pages ────────────────────────────────────────────────────────────────
import StaffLoginPage from "./pages/auth/StaffLoginPage";

// ── Dashboard Layout ──────────────────────────────────────────────────────────
import DashboardLayout from "./components/dashboard/DashboardLayout";

// ── Dashboard Pages ───────────────────────────────────────────────────────────
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ReceptionDashboard from "./pages/dashboard/ReceptionDashboard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import LaboratoryDashboard from "./pages/dashboard/LaboratoryDashboard";
import PharmacyDashboard from "./pages/dashboard/PharmacyDashboard";
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import { ITAdminDashboard } from "./pages/dashboard/ITAdminDashboard";
import TechOpsDashboard from "./pages/dashboard/TechOpsDashboard";
import { EnterpriseOpsDashboard } from "./pages/dashboard/EnterpriseOpsDashboard";
import { DeveloperPortal } from "./pages/DeveloperPortal";
import { PlatformSettings } from "./pages/dashboard/PlatformSettings";

// ─── Placeholder for upcoming phases ─────────────────────────────────────────
const PlaceholderPage: React.FC<{ title: string; icon?: string }> = ({
  title,
  icon = "🏗️",
}) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 py-32 bg-slate-50">
    <div className="text-6xl">{icon}</div>
    <h1 className="text-2xl font-bold font-display text-slate-800">{title}</h1>
    <p className="text-slate-500 text-sm">Phase 3 — coming soon.</p>
    <a href="/" className="btn-primary mt-2">
      ← Back to Home
    </a>
  </div>
);

// ─── AppContent ───────────────────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <div className="flex-1">
        <Routes>
          {/* ── Public Website ─────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/health-camps" element={<HealthCampsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />

          {/* ── Auth (Phase 3) ──────────────────────────────────────── */}
          <Route path="/login" element={<StaffLoginPage />} />
          <Route path="/login/staff" element={<StaffLoginPage />} />
          <Route
            path="/login/patient"
            element={<PlaceholderPage title="Patient Login" icon="👤" />}
          />
          <Route
            path="/forgot-password"
            element={<PlaceholderPage title="Forgot Password" icon="🔑" />}
          />
          <Route
            path="/reset-password"
            element={<PlaceholderPage title="Reset Password" icon="🔒" />}
          />

          {/* ── Dashboards (Phase 4 Layout Integration) ──────────────── */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              path="patient"
              element={<PatientDashboard />}
            />
            <Route
              path="doctor"
              element={<DoctorDashboard />}
            />
            <Route
              path="reception"
              element={<ReceptionDashboard />}
            />
            <Route
              path="lab"
              element={<LaboratoryDashboard />}
            />
            <Route
              path="laboratory"
              element={<LaboratoryDashboard />}
            />
            <Route
              path="pharmacy"
              element={<PharmacyDashboard />}
            />
            <Route
              path="inventory"
              element={<PlaceholderPage title="Inventory Dashboard" icon="📦" />}
            />
            <Route
              path="admin"
              element={<AdminDashboard />}
            />
            <Route
              path="it-admin"
              element={<ITAdminDashboard />}
            />
            <Route
              path="tech-ops"
              element={<TechOpsDashboard />}
            />
            <Route
              path="ops"
              element={<EnterpriseOpsDashboard />}
            />
            <Route
              path="developer"
              element={<DeveloperPortal />}
            />
            <Route
              path="settings"
              element={<PlatformSettings />}
            />
          </Route>

          {/* ── Legal ──────────────────────────────────────────────── */}
          <Route
            path="/privacy"
            element={<PlaceholderPage title="Privacy Policy" icon="📄" />}
          />
          <Route
            path="/terms"
            element={<PlaceholderPage title="Terms of Use" icon="📋" />}
          />
          <Route
            path="/sitemap"
            element={<PlaceholderPage title="Sitemap" icon="🗺️" />}
          />

          {/* ── 404 ────────────────────────────────────────────────── */}
          <Route
            path="*"
            element={<PlaceholderPage title="404 — Page Not Found" icon="🔍" />}
          />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <HelmetProvider>
      <HospitalProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </HospitalProvider>
    </HelmetProvider>
  );
}

export default App;
