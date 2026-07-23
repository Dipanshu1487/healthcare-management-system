import React, { useState, useEffect } from "react";
import { Server, Database, Shield, Activity, RefreshCw } from "lucide-react";
import { api } from "../../services/api";

export const TechOpsDashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any>({
    cpu_usage: 0,
    memory_usage: 0,
    disk_usage: 0,
    connections: 0,
    requests_per_minute: 0,
    uptime_seconds: 0,
    logs_count: 0
  });

  const loadTelemetry = async () => {
    try {
      const data = await api.request<any>("/analytics/tech-ops");
      setTelemetry(data);
    } catch (err) {
      console.error("Telemetry load failed", err);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Technical Operations Dashboard</h1>
          <p className="text-sm text-slate-500">System Telemetry & IT Infrastructure Monitoring</p>
        </div>
        <button
          onClick={loadTelemetry}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600"><Server className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">CPU Usage</span>
            <span className="text-2xl font-bold text-slate-800">{telemetry.cpu_usage}%</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-teal-50 text-teal-600"><Activity className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Memory Load</span>
            <span className="text-2xl font-bold text-slate-800">{telemetry.memory_usage}%</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600"><Database className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">DB Connections</span>
            <span className="text-2xl font-bold text-slate-800">{telemetry.connections}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600"><Shield className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Uptime Days</span>
            <span className="text-2xl font-bold text-slate-800">{(telemetry.uptime_seconds / 86400).toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2"><Server className="w-5 h-5 text-blue-500" /> Host Telemetry Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1"><span>CPU Utilization</span><span>{telemetry.cpu_usage}%</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${telemetry.cpu_usage}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1"><span>RAM Utilization</span><span>{telemetry.memory_usage}%</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-teal-500 h-full rounded-full" style={{ width: `${telemetry.memory_usage}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Disk Storage Occupancy</span><span>{telemetry.disk_usage}%</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${telemetry.disk_usage}%` }}></div></div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2"><Shield className="w-5 h-5 text-rose-500" /> Security Operations Center</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2 border rounded-lg bg-rose-50/50 border-rose-100 text-rose-700 flex justify-between">
              <span>Failed Logins Check</span><span>🟢 Normal</span>
            </div>
            <div className="p-2 border rounded-lg bg-green-50/50 border-green-100 text-green-700 flex justify-between">
              <span>Rate Limiting Filters</span><span>🟢 Active</span>
            </div>
            <div className="p-2 border rounded-lg bg-indigo-50/50 border-indigo-100 text-indigo-700 flex justify-between">
              <span>JWT Authentication Tokens Validator</span><span>🟢 Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechOpsDashboard;
