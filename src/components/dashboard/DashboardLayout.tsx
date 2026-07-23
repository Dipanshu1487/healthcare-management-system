import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { DemoSimulation } from "../shared/DemoSimulation";
import AIAssistantDrawer from "../ai/AIAssistantDrawer";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();

  // Dynamically determine the dashboard role based on current url path
  const getRoleFromPath = (path: string): string => {
    const segments = path.split("/").filter((x) => x);
    // Path looks like: /dashboard/admin/staff or /dashboard/doctor
    if (segments.length >= 2 && segments[0] === "dashboard") {
      return segments[1]; // Returns 'admin', 'doctor', 'reception', 'lab', 'pharmacy', 'patient'
    }
    return "staff"; // Default fallback
  };

  const role = getRoleFromPath(location.pathname);

  // Close mobile sidebar on transition
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* ── Collapsible Sidebar ── */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        role={role} 
      />

      {/* ── Main Content Container ── */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Sticky Header */}
        <TopNav 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          role={role} 
          onOpenAi={() => setAiOpen(true)}
        />

        {/* Dynamic Nested Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <Outlet />
        </main>

        {/* Reusable right-side AI Drawer */}
        <AIAssistantDrawer
          isOpen={aiOpen}
          onClose={() => setAiOpen(false)}
          role={role}
        />

        {/* Floating Interactive Hospital Simulation Widget */}
        <DemoSimulation />
      </div>
    </div>
  );
};

export default DashboardLayout;

