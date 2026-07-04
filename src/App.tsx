import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";

// ─── Placeholder pages (to be built in subsequent phases) ────────────────────
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 py-32">
    <div className="text-6xl">🏗️</div>
    <h1 className="text-2xl font-bold font-display text-slate-800">{title}</h1>
    <p className="text-slate-500">This page is coming soon — next in the build queue.</p>
    <a href="/" className="btn-primary mt-2">← Back to Home</a>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* ── Public Website ── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<PlaceholderPage title="About CHC Bharno" />} />
              <Route path="/departments" element={<PlaceholderPage title="Departments" />} />
              <Route path="/doctors" element={<PlaceholderPage title="Our Doctors" />} />
              <Route path="/schemes" element={<PlaceholderPage title="Health Schemes" />} />
              <Route path="/health-camps" element={<PlaceholderPage title="Health Camps" />} />
              <Route path="/gallery" element={<PlaceholderPage title="Gallery" />} />
              <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
              <Route path="/appointment" element={<PlaceholderPage title="Book Appointment" />} />

              {/* ── Auth ── */}
              <Route path="/login" element={<PlaceholderPage title="Staff Login" />} />
              <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />

              {/* ── Dashboards ── */}
              <Route path="/dashboard/patient" element={<PlaceholderPage title="Patient Dashboard" />} />
              <Route path="/dashboard/doctor" element={<PlaceholderPage title="Doctor Dashboard" />} />
              <Route path="/dashboard/reception" element={<PlaceholderPage title="Reception Dashboard" />} />
              <Route path="/dashboard/lab" element={<PlaceholderPage title="Laboratory Dashboard" />} />
              <Route path="/dashboard/pharmacy" element={<PlaceholderPage title="Pharmacy Dashboard" />} />
              <Route path="/dashboard/inventory" element={<PlaceholderPage title="Inventory Dashboard" />} />
              <Route path="/dashboard/admin" element={<PlaceholderPage title="Admin Dashboard" />} />

              {/* ── Legal ── */}
              <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
              <Route path="/terms" element={<PlaceholderPage title="Terms of Use" />} />
              <Route path="/sitemap" element={<PlaceholderPage title="Sitemap" />} />

              {/* ── 404 ── */}
              <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
