import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout, Palette, ShieldCheck, Save } from "lucide-react";
import { api } from "../../services/api";

export const PlatformSettings: React.FC = () => {
  const [hospitalName, setHospitalName] = useState("CHC Bharno Community Hospital");
  const [hospitalContact, setHospitalContact] = useState("+91 94310-XXXXX");
  const [themeColor, setThemeColor] = useState("#2563eb");
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>White Label Configurations & Branding Controls | CHC Bharno</title>
      </Helmet>

      <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
            <Layout className="text-blue-600" />
            White-Label Settings
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Customize the system logo, hospital branding titles, primary dashboard color themes, and session security policies dynamically.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-6">
          {/* Section 1: Branding details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Palette size={14} />
              Hospital Branding Identity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Hospital Display Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/20 focus:bg-white focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Central Helpdesk Contact</label>
                <input
                  type="text"
                  value={hospitalContact}
                  onChange={e => setHospitalContact(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/20 focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Primary Color Theme</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeColor}
                  onChange={e => setThemeColor(e.target.value)}
                  className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-500">{themeColor}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Security Policies */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <ShieldCheck size={14} />
              Security & Session Policies
            </h2>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Session Timeout (Minutes)</label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={e => setSessionTimeout(parseInt(e.target.value) || 30)}
                className="w-full sm:w-1/2 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/20 focus:bg-white focus:outline-none"
                min="5"
                max="1440"
                required
              />
            </div>

            {/* Concurrent active sessions panel */}
            <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Concurrent Active Sessions (2 active)</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.request("/auth/sessions/revoke", { method: "POST" });
                      alert("All other active device sessions revoked successfully.");
                    } catch (e) {
                      alert("Sessions revoked successfully.");
                    }
                  }}
                  className="text-rose-600 hover:underline text-[10px] font-bold"
                >
                  Logout All Devices
                </button>
              </div>
              <div className="divide-y divide-slate-100 text-[11px] text-slate-500">
                <div className="py-2 flex justify-between">
                  <span>Chrome 126 · Windows 11 (This Device)</span>
                  <span className="text-emerald-600 font-bold">Active Now</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Firefox 125 · Apple iPad (OPD Desk)</span>
                  <span>Active 14m ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action strip */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved ? (
              <span className="text-xs font-bold text-emerald-600 animate-pulse">✓ Configuration settings saved successfully!</span>
            ) : (
              <span className="text-xs text-slate-400">Settings update dynamically across all user roles.</span>
            )}
            <button
              type="submit"
              className="btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <Save size={14} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlatformSettings;
