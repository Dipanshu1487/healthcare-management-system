import React from "react";
import { Helmet } from "react-helmet-async";
import { useHospital } from "../../context/useHospital";
import { selectAdminStats } from "../../context/selectors";
import { 
  BedDouble, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  PlusCircle,
  FileSpreadsheet,
  Settings,
  UserCheck
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie,
  Cell
} from "recharts";
import { cn } from "../../lib/utils";

// ─── Dummy Analytics Data ─────────────────────────────────────────────────────
const trafficData = [
  { day: "Mon", opd: 140, admissions: 12 },
  { day: "Tue", opd: 165, admissions: 18 },
  { day: "Wed", opd: 184, admissions: 14 },
  { day: "Thu", opd: 150, admissions: 10 },
  { day: "Fri", opd: 172, admissions: 16 },
  { day: "Sat", opd: 120, admissions: 8 },
  { day: "Sun", opd: 45, admissions: 4 },
];

const departmentData = [
  { name: "General Medicine", value: 45, color: "#2563eb" },
  { name: "M Maternal Health", value: 30, color: "#0d9488" },
  { name: "Emergency Ward", value: 15, color: "#dc2626" },
  { name: "Dental Care", value: 8, color: "#d97706" },
  { name: "Other Specialty", value: 12, color: "#7c3aed" },
];

const departmentSummary = [
  { name: "General Medicine", doctors: "6 On-duty", queue: 14, status: "Normal", color: "text-blue-600 bg-blue-50" },
  { name: "Maternal & Child Health", doctors: "4 On-duty", queue: 8, status: "Normal", color: "text-teal-600 bg-teal-50" },
  { name: "Emergency & Trauma", doctors: "3 On-duty", queue: 6, status: "Busy", color: "text-red-600 bg-red-50" },
  { name: "Dental Care", doctors: "1 On-duty", queue: 3, status: "Normal", color: "text-amber-600 bg-amber-50" },
  { name: "Laboratory Unit", doctors: "2 On-duty", queue: 12, status: "Busy", color: "text-purple-600 bg-purple-50" },
];

const recentActivities = [
  { id: 1, title: "Emergency Admission", detail: "Trauma Case (Road accident) admitted in ICU Bed 3.", time: "10 mins ago", type: "critical" },
  { id: 2, title: "Inventory Reorder", detail: "Dispensing unit requested 200 vials of Rabies Vaccine.", time: "25 mins ago", type: "warning" },
  { id: 3, title: "Kayakalp Audit Report", detail: "Sanitation & Hygiene score updated: 94.2% (Grade A).", time: "1 hour ago", type: "success" },
  { id: 4, title: "Duty Roster Modified", detail: "Dr. Priya Sharma assigned as CMO Night Duty Lead.", time: "2 hours ago", type: "info" },
];

// ─── Admin Dashboard Component ────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const { state } = useHospital();
  const stats = selectAdminStats(state);

  const combinedActivities = [
    ...state.auditLogs.map((log) => ({
      id: log.id,
      title: log.action.replace(/_/g, " "),
      detail: `${log.actorName}: ${log.description}`,
      time: log.timestamp.split(" ")[1] || log.timestamp,
      type: log.action.includes("EMERGENCY") ? "critical" : log.action.includes("LAB") ? "warning" : "info",
    })),
    ...recentActivities,
  ].slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — CHC Bharno HMS</title>
      </Helmet>

      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800">Hospital Overview</h1>
            <p className="text-slate-500 text-xs mt-0.5">Real-time status of CHC Bharno operations.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm">
              <Calendar size={14} className="text-slate-400" />
              <span>July 13, 2026</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm">
              <Clock size={14} className="text-slate-400" />
              <span>Live System</span>
            </span>
          </div>
        </div>

        {/* ── Stats Summary Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Today's OPD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Activity size={20} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                <TrendingUp size={12} />
                Live OPD
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{180 + stats.todayAppointments}</h3>
              <p className="text-xs text-slate-500 mt-1">Today's OPD Consultations</p>
            </div>
            <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{stats.todayAppointments} Active Tokens</span>
              <span className="text-blue-600 font-semibold cursor-pointer flex items-center gap-0.5 hover:underline">
                Queue <ArrowRight size={10} />
              </span>
            </div>
          </div>

          {/* Card 2: Today's Admissions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <UserCheck size={20} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                <TrendingDown size={12} />
                Live
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{12 + stats.activeEmergencies}</h3>
              <p className="text-xs text-slate-500 mt-1">Today's New Admissions</p>
            </div>
            <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{stats.activeEmergencies} Emergency Cases Active</span>
              <span className="text-teal-600 font-semibold cursor-pointer flex items-center gap-0.5 hover:underline">
                Records <ArrowRight size={10} />
              </span>
            </div>
          </div>

          {/* Card 3: Available Beds */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <BedDouble size={20} />
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                Cap: 30
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{Math.max(0, 30 - (20 + stats.activeEmergencies))}</h3>
              <p className="text-xs text-slate-500 mt-1">Beds Available Currently</p>
            </div>
            <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{20 + stats.activeEmergencies}/30 Beds Occupied</span>
              <span className="text-purple-600 font-semibold cursor-pointer flex items-center gap-0.5 hover:underline">
                Bed Map <ArrowRight size={10} />
              </span>
            </div>
          </div>

          {/* Card 4: Monthly Revenue (Demo) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <DollarSign size={20} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                <TrendingUp size={12} />
                +8%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">₹1.8L</h3>
              <p className="text-xs text-slate-500 mt-1">Monthly Scheme Reimbursement</p>
            </div>
            <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>PM-JAY Claim settlements</span>
              <span className="text-amber-600 font-semibold cursor-pointer flex items-center gap-0.5 hover:underline">
                Claims <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </div>

        {/* ── Visual Analytics Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: OPD traffic trends */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Weekly Patient Traffic</h2>
                <p className="text-[11px] text-slate-400">Comparison of OPD vs In-patient Admissions</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                  OPD Patients
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded bg-teal-500" />
                  Admissions
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Area type="monotone" dataKey="opd" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorOpd)" />
                  <Area type="monotone" dataKey="admissions" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorAdmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Dept Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-2">OPD Department Load</h2>
            <p className="text-[11px] text-slate-400 mb-6">Percentage share of active registrations today</p>
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black font-display text-slate-700">184</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-1.5 mt-2">
              {departmentData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-bold text-slate-700">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Details: Quick Actions & Recent Activities ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1: Department Status Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800">Specialty Units Status</h2>
                <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 font-semibold cursor-pointer hover:underline">
                  All 8 Specialty Details
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-3 font-semibold">Specialty</th>
                      <th className="pb-3 font-semibold">Doctors</th>
                      <th className="pb-3 font-semibold text-center">Queue Count</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {departmentSummary.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 font-bold text-slate-800">{d.name}</td>
                        <td className="py-3 text-slate-500">{d.doctors}</td>
                        <td className="py-3 text-center font-semibold text-slate-700">{d.queue}</td>
                        <td className="py-3 text-right">
                          <span className={cn(
                            "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                            d.status === "Busy" 
                              ? "bg-rose-50 text-rose-700 border-rose-100" 
                              : "bg-emerald-50 text-emerald-700 border-emerald-100"
                          )}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center text-xs">
              <span className="text-slate-400">Out-Patient operations active till 2:00 PM</span>
              <button className="text-blue-600 font-bold hover:underline flex items-center gap-1.5">
                Manage OPD Slots <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Section 2: Recent Activity Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-4">Operations Log</h2>
              <div className="space-y-4">
                {combinedActivities.map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <div className="relative">
                      {/* Timeline dot */}
                      <span className={cn(
                        "w-2 h-2 rounded-full block mt-1.5",
                        act.type === "critical" ? "bg-rose-500" :
                        act.type === "warning" ? "bg-amber-500" :
                        act.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                      )} />
                      {/* Connecting line */}
                      <span className="w-px bg-slate-100 absolute top-4 bottom-[-16px] left-1" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-xs font-bold text-slate-700">{act.title}</span>
                        <span className="text-[10px] text-slate-400">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <button className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1.5 w-full justify-center">
                Download Today's Audit Log <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick Command Panel ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Operational Tasks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/20 transition-all text-center group">
              <PlusCircle className="text-blue-500 group-hover:scale-110 transition-transform mb-2" size={24} />
              <span className="text-xs font-bold text-slate-700">Admit Patient</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Register In-Patient</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/20 transition-all text-center group">
              <UserCheck className="text-teal-500 group-hover:scale-110 transition-transform mb-2" size={24} />
              <span className="text-xs font-bold text-slate-700">Modify Duty List</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Manage Doctor Roster</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/20 transition-all text-center group">
              <FileSpreadsheet className="text-purple-500 group-hover:scale-110 transition-transform mb-2" size={24} />
              <span className="text-xs font-bold text-slate-700">Reimbursement</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Ayushman PM-JAY</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-center group">
              <Settings className="text-slate-500 group-hover:scale-110 transition-transform mb-2" size={24} />
              <span className="text-xs font-bold text-slate-700">System Setup</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Configurations</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
