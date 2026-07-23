import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { BookOpen, Terminal, Layers, Globe } from "lucide-react";
import { cn } from "../lib/utils";

export const DeveloperPortal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"sdk" | "plugins" | "webhooks">("sdk");

  return (
    <>
      <Helmet>
        <title>Developer Platform Hub & Plugin SDK | CHC Bharno</title>
      </Helmet>

      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {/* Banner header */}
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
            <Layers className="text-blue-600" />
            Developer Platform Ecosystem
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Build custom extensions, register webhooks, and extend the core hospital EHR schema dynamically.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-slate-150 pb-2">
          <button
            onClick={() => setActiveSubTab("sdk")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
              activeSubTab === "sdk" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <Terminal size={14} />
            EHR Core SDK
          </button>
          <button
            onClick={() => setActiveSubTab("plugins")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
              activeSubTab === "plugins" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <BookOpen size={14} />
            Plugin Framework
          </button>
          <button
            onClick={() => setActiveSubTab("webhooks")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
              activeSubTab === "webhooks" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <Globe size={14} />
            Outbound Webhooks
          </button>
        </div>

        {/* Console Workspace */}
        {activeSubTab === "sdk" && (
          <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-inner font-mono text-xs space-y-4 max-w-4xl">
            <div className="text-slate-400">// CHC Bharno Integration SDK Example</div>
            <div>
              <span className="text-pink-400">import</span> {"{"} EHRClient {"}"} <span className="text-pink-400">from</span> <span className="text-emerald-300">"@chc-bharno/sdk"</span>;
            </div>
            <div>
              <span className="text-blue-400">const</span> client = <span className="text-pink-400">new</span> <span className="text-yellow-300">EHRClient</span>({"{"}
              <br />
              &nbsp;&nbsp;apiKey: <span className="text-emerald-300">"chc_live_9a8b7c8d9e"</span>,
              <br />
              &nbsp;&nbsp;endpoint: <span className="text-emerald-300">"https://his.chcbharno.in/api/v1"</span>
              <br />
              {"}"});
            </div>
            <div className="text-slate-400">// Fetch patient diagnostics record by UID</div>
            <div>
              <span className="text-blue-400">const</span> patient = <span className="text-pink-400">await</span> client.patients.<span className="text-yellow-300">getDetails</span>(<span className="text-emerald-300">"UHID-815FA12E"</span>);
              <br />
              console.<span className="text-yellow-300">log</span>(<span className="text-emerald-300">`Verified patient: ${"{"}patient.name{"}"}`</span>);
            </div>
          </div>
        )}

        {activeSubTab === "plugins" && (
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 max-w-4xl">
            <h3 className="text-sm font-bold text-slate-800">Dynamic Plugin Architecture</h3>
            <p className="text-xs text-slate-500">
              Plugins should be uploaded as standalone packages inside the `/plugins` directory. Once detected, the ecosystem automatically registers the declared schemas, navigation configurations, and APIs:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl font-mono text-[11px] text-slate-700">
              {"{"}
              <br />
              &nbsp;&nbsp;"name": "radiology-viewer",
              <br />
              &nbsp;&nbsp;"version": "1.0.0",
              <br />
              &nbsp;&nbsp;"requiredPermissions": ["view_xray", "upload_scan"],
              <br />
              &nbsp;&nbsp;"navigation": {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;"label": "Radiology Scans",
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;"path": "/dashboard/radiology"
              <br />
              &nbsp;&nbsp;{"}"}
              <br />
              {"}"}
            </div>
          </div>
        )}

        {activeSubTab === "webhooks" && (
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 max-w-4xl">
            <h3 className="text-sm font-bold text-slate-800">Outbound Webhook Dispatcher</h3>
            <p className="text-xs text-slate-500">
              Send notifications to third-party endpoints (e.g., Ayushman Bharat interface, external laboratory sync systems) when patient records update.
            </p>
            <div className="border border-slate-100 rounded-xl divide-y divide-slate-50">
              <div className="p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700">Govt Health Registry sync</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Event: PATIENT_REGISTERED</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700">Govt Insurance sync</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Event: BILLING_COMPLETED</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeveloperPortal;
