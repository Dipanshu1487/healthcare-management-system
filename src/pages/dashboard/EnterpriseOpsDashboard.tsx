import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Database, 
  Cpu, 
  HardDrive, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight, 
  Wrench, 
  Download, 
  Play
} from "lucide-react";
import { cn } from "../../lib/utils";

interface ServiceStatus {
  database: string;
  ai_service: string;
  background_scheduler: string;
  notification_service: string;
  file_storage: string;
}

interface Telemetry {
  server_uptime: string;
  active_sessions: number;
  cpu_utilization: string;
  ram_utilization: string;
  disk_usage: string;
}

interface BackupLog {
  id: string;
  timestamp: string;
  size: string;
  type: string;
  status: string;
}

interface BackgroundJob {
  id: string;
  name: string;
  type: string;
  status: string;
  retries: number;
}

export const EnterpriseOpsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"telemetry" | "flags" | "maintenance" | "backups">("telemetry");
  const [services, setServices] = useState<ServiceStatus | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [flags, setFlags] = useState<Record<string, boolean>>({
    ai_assistant: true,
    laboratory: true,
    pharmacy: true,
    billing: true,
    analytics: true
  });
  const [maintenance, setMaintenance] = useState({
    is_enabled: false,
    message: "System undergoing scheduled database maintenance.",
    expected_end_time: "22:00"
  });
  const [backups, setBackups] = useState<BackupLog[]>([]);
  const [jobs, setJobs] = useState<BackgroundJob[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    // Populate stats, backups and job lists on mount
    setServices({
      database: "Healthy",
      ai_service: "Healthy",
      background_scheduler: "Healthy",
      notification_service: "Healthy",
      file_storage: "Healthy"
    });
    setTelemetry({
      server_uptime: "99.98%",
      active_sessions: 82,
      cpu_utilization: "14%",
      ram_utilization: "42%",
      disk_usage: "38%"
    });
    setBackups([
      { id: "b-01", timestamp: "2026-07-18 04:00:00", size: "4.2 MB", type: "Database", status: "Completed" },
      { id: "b-02", timestamp: "2026-07-18 04:05:00", size: "18.5 MB", type: "Files/Uploads", status: "Completed" }
    ]);
    setJobs([
      { id: "job-101", name: "Email Notification Dispatch", type: "Email", status: "Completed", retries: 0 },
      { id: "job-102", name: "Daily Analytics Cache Rebuilder", type: "Cache", status: "Completed", retries: 0 },
      { id: "job-103", name: "NHM Insurance Claim Synchronizer", type: "Sync", status: "Failed", retries: 3 }
    ]);
  }, []);

  const toggleFlag = (flagName: string) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  const triggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup: BackupLog = {
        id: `b-0${backups.length + 1}`,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        size: "4.5 MB",
        type: "Database",
        status: "Completed"
      };
      setBackups(prev => [newBackup, ...prev]);
      setIsBackingUp(false);
    }, 2000);
  };

  const retryJob = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "Completed", retries: j.retries + 1 } : j));
  };

  return (
    <>
      <Helmet>
        <title>Enterprise Operations & Technical Control Center | CHC Bharno</title>
      </Helmet>

      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {/* Dashboard Title Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800 tracking-tight">
              Enterprise Operations Center
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              IT Administration, Service Telemetry, Security Control & Backup Orchestrator
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["telemetry", "flags", "maintenance", "backups"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                  activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content workspace */}
        {activeTab === "telemetry" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Infrastructure Services Status */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Active Services Telemetry</h2>
              <div className="space-y-3">
                {services && Object.entries(services).map(([srv, state]) => (
                  <div key={srv} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/20">
                    <span className="text-xs font-semibold text-slate-600 capitalize">{srv.replace("_", " ")}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Metrics & System Loads */}
            <div className="lg:col-span-2 space-y-6">
              {/* Load Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">CPU Load</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{telemetry?.cpu_utilization}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Database size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">RAM Usage</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{telemetry?.ram_utilization}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <HardDrive size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Disk Space</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{telemetry?.disk_usage}</p>
                  </div>
                </div>
              </div>

              {/* Active Jobs queues panel */}
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Centralized Background Tasks</h2>
                <div className="divide-y divide-slate-50">
                  {jobs.map(job => (
                    <div key={job.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-700">{job.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Type: {job.type} · Retries: {job.retries}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                          job.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                        )}>
                          {job.status}
                        </span>
                        {job.status === "Failed" && (
                          <button
                            onClick={() => retryJob(job.id)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                            title="Retry Task"
                          >
                            <Play size={14} className="text-blue-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Flags console */}
        {activeTab === "flags" && (
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Dynamic Feature Management Center</h2>
              <p className="text-xs text-slate-400 mt-1">Enable or disable core system features in real-time without redeploying code.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {Object.entries(flags).map(([key, val]) => (
                <div key={key} className="py-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 capitalize">{key.replace("_", " ")} Module</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Expose controls and menus to active users</p>
                  </div>
                  <button 
                    onClick={() => toggleFlag(key)}
                    className="text-slate-600 transition-transform active:scale-95"
                  >
                    {val ? (
                      <ToggleRight size={38} className="text-blue-600" />
                    ) : (
                      <ToggleLeft size={38} className="text-slate-350" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance Config panel */}
        {activeTab === "maintenance" && (
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Wrench size={16} className="text-teal-650" />
                Hospital Maintenance Configurations
              </h2>
              <p className="text-xs text-slate-400 mt-1">Place the system offline for maintenance checks. Only administrators can bypass this wall.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-550/5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-700">Activate Maintenance Mode</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Block all non-admin route entry requests</p>
                </div>
                <button 
                  onClick={() => setMaintenance(prev => ({ ...prev, is_enabled: !prev.is_enabled }))}
                  className="text-slate-600"
                >
                  {maintenance.is_enabled ? (
                    <ToggleRight size={38} className="text-teal-600" />
                  ) : (
                    <ToggleLeft size={38} className="text-slate-350" />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-450 uppercase">Offline Banner Message</label>
                <textarea
                  value={maintenance.message}
                  onChange={e => setMaintenance(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50/20 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Expected Duration</label>
                  <input
                    type="text"
                    value={maintenance.expected_end_time}
                    onChange={e => setMaintenance(prev => ({ ...prev, expected_end_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Administrative Bypass</label>
                  <span className="inline-flex items-center justify-center bg-teal-50 text-teal-800 text-[10px] font-bold px-3 py-2 border border-teal-100 rounded-lg">
                    System Administrators Allowed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backups & Restore controller */}
        {activeTab === "backups" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Trigger backups */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Disaster Recovery Operations</h2>
              <p className="text-xs text-slate-400">Force manual system snapshot backups containing current patients history, medical templates, billing registries, and diagnostics reports.</p>
              
              <button
                onClick={triggerBackup}
                disabled={isBackingUp}
                className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={13} className={cn(isBackingUp && "animate-spin")} />
                <span>{isBackingUp ? "Saving System Snapshot..." : "Trigger Manual Backup"}</span>
              </button>
            </div>

            {/* Right: Backup execution lists */}
            <div className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex items-center justify-between">
                <span>Backup History Logs</span>
                <span className="text-[10px] text-slate-400 font-bold">{backups.length} archived snapshots</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-3">Snapshot Timestamp</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Size</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {backups.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="py-3.5 font-bold text-slate-700">{log.timestamp}</td>
                        <td className="py-3.5 font-medium text-slate-500">{log.type}</td>
                        <td className="py-3.5 font-bold text-blue-600">{log.size}</td>
                        <td className="py-3.5">
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button 
                            onClick={() => alert(`Downloading archive ${log.id}...`)}
                            className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1 text-[10px]"
                          >
                            <Download size={11} />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EnterpriseOpsDashboard;
