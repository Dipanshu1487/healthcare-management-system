import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, Search, Home, ChevronRight } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import UserProfileDropdown from "./UserProfileDropdown";
import AIAssistantButton from "../ai/AIAssistantButton";

interface TopNavProps {
  onToggleSidebar: () => void;
  role: string;
  onOpenAi: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, role, onOpenAi }) => {
  const location = useLocation();
  const [healthOpen, setHealthOpen] = useState(false);

  // Helper to build breadcrumbs dynamically based on path
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      
      // Formatting breadcrumb names
      let label = value.charAt(0).toUpperCase() + value.slice(1);
      if (value === "opd") label = "OPD";
      if (value === "lab") label = "Lab";
      
      return { label, to, last };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md md:px-6 shadow-sm">
      {/* ── Left Side: Hamburger & Breadcrumbs ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-xl lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Home size={14} />
          </Link>
          {breadcrumbs.map((bc) => (
            <React.Fragment key={bc.to}>
              <ChevronRight size={12} className="text-slate-300" />
              {bc.last ? (
                <span className="text-slate-800 font-bold max-w-[120px] truncate">{bc.label}</span>
              ) : (
                <Link to={bc.to} className="hover:text-blue-600 transition-colors">
                  {bc.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* ── Center: Search Bar ── */}
      <div className="hidden md:flex max-w-xs w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Global system search..."
          className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
        />
      </div>

      {/* ── Right Side: Controls ── */}
      <div className="flex items-center gap-3">
        {/* System Health Indicator (Admin and IT-Admin only) */}
        {(role === "admin" || role === "it-admin") && (
          <div className="relative">
            <button
              onClick={() => setHealthOpen(!healthOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 border border-green-200 hover:bg-green-100/50 text-green-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span>🟢 System Healthy</span>
            </button>

            {healthOpen && (
              <div className="absolute right-0 mt-2 w-56 p-3 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-xs text-slate-700">
                <h4 className="font-bold border-b pb-1.5 mb-2 text-slate-800">Telemetry Health Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Backend Server</span><span className="text-green-600 font-bold">🟢 Online</span></div>
                  <div className="flex justify-between"><span>Database Client</span><span className="text-green-600 font-bold">🟢 Connected</span></div>
                  <div className="flex justify-between"><span>RAG AI Gateway</span><span className="text-green-600 font-bold">🟢 Operational</span></div>
                  <div className="flex justify-between"><span>Storage Buckets</span><span className="text-green-600 font-bold">🟢 Healthy</span></div>
                  <div className="flex justify-between"><span>Background Workers</span><span className="text-green-600 font-bold">🟢 Active</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Assistant Button */}
        <AIAssistantButton onClick={onOpenAi} />

        {/* Notification Center */}
        <NotificationCenter />

        <span className="h-6 w-px bg-slate-200" />

        {/* User Profile */}
        <UserProfileDropdown role={role} />
      </div>
    </header>
  );
};

export default TopNav;
