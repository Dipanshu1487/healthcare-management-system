import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Printer,
  FlaskConical,
  FileText,
  TestTube,
  Search,
  Activity,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useHospital } from "../../context/useHospital";
import { createAuditLog } from "../../context/helpers";



// ─── Interfaces ───────────────────────────────────────────────────────────────
interface LabOrder {
  sampleId: string;
  name: string;
  uhid: string;
  testName: string;
  doctor: string;
  collectionTime: string;
  priority: "Routine" | "Urgent" | "Critical";
  status: "Sample Pending" | "Sample Collected" | "Testing" | "Report Ready" | "Completed";
  sampleType: string;
  collectorName?: string;
  technicianName?: string;
  resultValue?: string;
  normalRange?: string;
  remarks?: string;
}

interface CriticalAlert {
  id: string;
  patientName: string;
  testName: string;
  finding: string;
  urgency: string;
  time: string;
}

interface ActiveTestItem {
  id: string;
  patientName: string;
  testName: string;
  status: string;
  eta: string;
}

interface RecentReportItem {
  id: string;
  patientName: string;
  testName: string;
  completedTime: string;
  status: "Normal" | "Abnormal" | "Critical";
  findings: string;
}

// ─── Initial Dummy Data ───────────────────────────────────────────────────────
const initialOrdersList: LabOrder[] = [
  { sampleId: "SMP-101", name: "Suresh Oraon", uhid: "UHID-20260710-0012", testName: "Complete Blood Count (CBC)", doctor: "Dr. Priya Sharma", collectionTime: "--", priority: "Routine", status: "Sample Pending", sampleType: "Blood" },
  { sampleId: "SMP-102", name: "Anjali Devi", uhid: "UHID-20260710-0045", testName: "Random Blood Sugar (RBS)", doctor: "Dr. Kavita Devi", collectionTime: "09:30 AM", priority: "Urgent", status: "Sample Collected", sampleType: "Blood" },
  { sampleId: "SMP-103", name: "Bipin Kujur", uhid: "UHID-20260710-0089", testName: "Widal Test (Typhoid)", doctor: "Dr. Meena Kumari", collectionTime: "09:45 AM", priority: "Routine", status: "Testing", sampleType: "Blood" },
  { sampleId: "SMP-104", name: "Lalmohan Singh", uhid: "UHID-20260710-0112", testName: "Dengue NS1 Antigen", doctor: "Dr. Anita Singh", collectionTime: "10:10 AM", priority: "Critical", status: "Report Ready", sampleType: "Blood" },
  { sampleId: "SMP-105", name: "Ramesh Mahto", uhid: "UHID-20260710-0155", testName: "Urine Routine & Microscopy", doctor: "Dr. Ramesh Gupta", collectionTime: "--", priority: "Routine", status: "Sample Pending", sampleType: "Urine" },
  { sampleId: "SMP-106", name: "Phulo Oraon", uhid: "UHID-20260710-0199", testName: "Kidney Function Test (KFT)", doctor: "Dr. Suresh Mahto", collectionTime: "10:30 AM", priority: "Urgent", status: "Testing", sampleType: "Blood" },
  { sampleId: "SMP-107", name: "Janki Devi", uhid: "UHID-20260710-0234", testName: "Liver Function Test (LFT)", doctor: "Dr. Kavita Devi", collectionTime: "--", priority: "Routine", status: "Sample Pending", sampleType: "Blood" },
];

const initialCriticalAlerts: CriticalAlert[] = [
  { id: "CRT-01", patientName: "Mangra Munda", testName: "Complete Blood Count (CBC)", finding: "Extremely Low Hemoglobin: 5.8 g/dL (Normal: 12-16)", urgency: "Critical Triage", time: "10:45 AM" },
  { id: "CRT-02", patientName: "Suniya Kumari", testName: "Random Blood Sugar (RBS)", finding: "High Blood Glucose: 398 mg/dL (Normal: 70-140)", urgency: "Critical Triage", time: "11:02 AM" },
  { id: "CRT-03", patientName: "Budhwa Oraon", testName: "Peripheral Smear Test", finding: "Positive Plasmodium Falciparum Malaria Smear", urgency: "Urgent Alert", time: "11:15 AM" },
];

const initialActiveTests: ActiveTestItem[] = [
  { id: "SMP-103", patientName: "Bipin Kujur", testName: "Widal Test (Typhoid)", status: "Incubation (37°C)", eta: "12 mins remaining" },
  { id: "SMP-106", patientName: "Phulo Oraon", testName: "Kidney Function Test (KFT)", status: "Centrifugation", eta: "8 mins remaining" },
  { id: "SMP-108", patientName: "Budhwa Oraon", testName: "Malaria Smear", status: "Microscope Stain", eta: "15 mins remaining" }
];

const initialRecentReports: RecentReportItem[] = [
  { id: "SMP-098", patientName: "Munni Kumari", testName: "Random Blood Sugar (RBS)", completedTime: "10:45 AM", status: "Normal", findings: "110 mg/dL" },
  { id: "SMP-099", patientName: "Kundan Gope", testName: "Widal Test (Typhoid)", completedTime: "11:00 AM", status: "Abnormal", findings: "1:160 Positive" },
  { id: "SMP-100", patientName: "Sunita Ekka", testName: "Urine Routine", completedTime: "11:15 AM", status: "Normal", findings: "Pus Cells: 1-2 /hpf" }
];

const LaboratoryDashboard: React.FC = () => {
  const { state, dispatch } = useHospital();

  const contextOrders: LabOrder[] = state.labOrders.map((o) => ({
    sampleId: o.sampleId || o.id || "SMP-001",
    name: o.name,
    uhid: o.uhid || "JHR-2026-LIVE",
    testName: o.testName,
    doctor: o.doctor,
    collectionTime: o.collectionTime || "10:30 AM",
    priority: (o.priority as any) || "Routine",
    status: o.status === "Pending Collection" ? "Sample Pending" : (o.status as any),
    sampleType: o.sampleType || "Blood",
    resultValue: o.resultValue,
  }));
  const orders = contextOrders.length > 0 ? contextOrders : initialOrdersList;

  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>(initialCriticalAlerts);
  const [activeTests, setActiveTests] = useState<ActiveTestItem[]>(initialActiveTests);
  const [recentReports, setRecentReports] = useState<RecentReportItem[]>(initialRecentReports);

  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Form states for Sample Collection Workspace
  const [collectCollector, setCollectCollector] = useState("Technician Vijay");
  const [collectSampleType, setCollectSampleType] = useState("Blood");

  // Form states for Report Entry Panel
  const [reportResult, setReportResult] = useState("");
  const [reportNormalRange, setReportNormalRange] = useState("");
  const [reportRemarks, setReportRemarks] = useState("");
  const [reportTechnician, setReportTechnician] = useState("Dr. Arvind Munda (Lab Officer)");
  const [reportVerified, setReportVerified] = useState(false);

  // Quick Action Search input
  const [qaSearchInput, setQaSearchInput] = useState("");

  // Notification Banner
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const triggerBanner = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(null), 5000);
  };

  // Stats Calculator
  const pendingSamplesCount = orders.filter(o => o.status === "Sample Pending").length;
  const collectedTodayCount = orders.filter(o => o.status !== "Sample Pending").length + recentReports.length;
  const testsInProgressCount = activeTests.length;
  const completedTodayCount = recentReports.length;

  // Search & Filter
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.testName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && o.status === statusFilter;
  });

  // Action: Mark Sample Collected
  const handleConfirmCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const targetLab = state.labOrders.find((l) => l.sampleId === selectedOrder.sampleId || l.id === selectedOrder.sampleId);
    if (targetLab) {
      dispatch({
        type: "UPDATE_LAB_ORDER_STATUS",
        payload: {
          sampleId: targetLab.sampleId || targetLab.id || selectedOrder.sampleId,
          status: "Collected",
          audit: createAuditLog("lab", "Laboratory", "SAMPLE_COLLECTED", "LabOrder", targetLab.id || selectedOrder.sampleId, `Sample collected for ${selectedOrder.name}`),
        },
      });
    }

    triggerBanner(`Success: Sample registered for ${selectedOrder.name} (${selectedOrder.sampleId})`);
    setSelectedOrder(null);
  };

  // Action: Dispatch Completed Report
  const handleDispatchReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const targetLab = state.labOrders.find((l) => l.sampleId === selectedOrder.sampleId || l.id === selectedOrder.sampleId);
    if (targetLab) {
      dispatch({
        type: "UPDATE_LAB_ORDER_STATUS",
        payload: {
          sampleId: targetLab.sampleId || targetLab.id || selectedOrder.sampleId,
          status: "Completed",
          resultValue: reportResult,
          audit: createAuditLog("lab", "Laboratory", "TESTING_COMPLETED", "LabOrder", targetLab.id || selectedOrder.sampleId, `Test completed for ${selectedOrder.name}: ${reportResult}`),
        },
      });
    }

    // Determine status based on value
    let statusClass: "Normal" | "Abnormal" | "Critical" = "Normal";
    const valUpper = reportResult.toUpperCase();
    if (valUpper.includes("POSITIVE") || valUpper.includes("HIGH") || valUpper.includes("LOW") || valUpper.includes("CRITICAL")) {
      statusClass = "Abnormal";
    }
    if (selectedOrder.priority === "Critical" || valUpper.includes("SEVERE") || valUpper.includes("EXTREME")) {
      statusClass = "Critical";
    }

    const newReport: RecentReportItem = {
      id: selectedOrder.sampleId,
      patientName: selectedOrder.name,
      testName: selectedOrder.testName,
      completedTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      status: statusClass,
      findings: reportResult
    };

    setRecentReports(prev => [newReport, ...prev]);

    // If report is critical, add to Critical alerts panel
    if (statusClass === "Critical") {
      const newAlert: CriticalAlert = {
        id: `CRT-0${criticalAlerts.length + 1}`,
        patientName: selectedOrder.name,
        testName: selectedOrder.testName,
        finding: `${selectedOrder.testName} finding: ${reportResult}`,
        urgency: "Critical Triage",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setCriticalAlerts(prev => [newAlert, ...prev]);
    }

    // Clean up active tests if it was in incubation
    setActiveTests(prev => prev.filter(t => t.id !== selectedOrder.sampleId));

    triggerBanner(`Lab Report finalized and signed off for ${selectedOrder.name}. Dispatch sent to OPD desk.`);
    setSelectedOrder(null);
    setReportResult("");
    setReportNormalRange("");
    setReportRemarks("");
    setReportVerified(false);
  };

  // Action: Print barcode action
  const handlePrintBarcode = (sampleId: string) => {
    alert(`Generating & Printing Barcode:\n\n[|| |||| | |||]\nID: ${sampleId}\nFacility: CHC Bharno Pathology Lab`);
  };

  // Quick Action Search
  const handleQuickActionSearch = () => {
    if (!qaSearchInput) return;
    const match = orders.find(o => 
      o.sampleId.toLowerCase() === qaSearchInput.toLowerCase() ||
      o.uhid.toLowerCase() === qaSearchInput.toLowerCase()
    );
    if (match) {
      setSelectedOrder(match);
      triggerBanner(`Sample ${match.sampleId} found in work queue.`);
    } else {
      triggerBanner(`Alert: Sample ID or UHID "${qaSearchInput}" not found in pending register.`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Laboratory Dashboard (LIS) — CHC Bharno HMS</title>
      </Helmet>

      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800">Laboratory Information System (LIS)</h1>
            <p className="text-slate-500 text-xs mt-0.5">Community Health Centre Bharno Pathology Hub · Diagnostic Intake & Reporting</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-150">
              <FlaskConical size={12} className="animate-pulse" />
              LIS Analyzer Connected
            </span>
          </div>
        </div>

        {/* ── Banner Success Notification ── */}
        {bannerMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 animate-fade-in-up shadow-sm">
            <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0" size={18} />
            <span className="text-xs font-bold">{bannerMsg}</span>
          </div>
        )}

        {/* ── Summary Counters Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                Queue
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{pendingSamplesCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Pending Samples</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <TestTube size={20} />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                Collected
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{collectedTodayCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Samples Collected Today</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                Analyzers
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{testsInProgressCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Tests In Progress</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">
                Dispatched
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{completedTodayCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Reports Completed Today</p>
            </div>
          </div>
        </div>

        {/* ── Main Workspace Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left / Middle: Lab Worklist Table and Interactive Panels */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* LIS Worklist Table Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">LIS Laboratory Worklist</h2>
                  <p className="text-[11px] text-slate-450 mt-0.5">Filter by clinical workflow step and prioritize urgent diagnostics.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
                    <input
                      type="text"
                      placeholder="Search Sample / UHID / Name..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 w-44"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-slate-50/50 focus:outline-none font-semibold text-slate-600"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Sample Pending">Sample Pending</option>
                    <option value="Sample Collected">Sample Collected</option>
                    <option value="Testing">Testing</option>
                    <option value="Report Ready">Report Ready</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-2">Sample ID</th>
                      <th className="pb-2">Patient Details</th>
                      <th className="pb-2">Requested Test</th>
                      <th className="pb-2">Doctor</th>
                      <th className="pb-2">Time</th>
                      <th className="pb-2 text-center">Priority</th>
                      <th className="pb-2 text-center">Status</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No diagnostic orders found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(o => (
                        <tr 
                          key={o.sampleId} 
                          className={cn(
                            "hover:bg-slate-50/40 transition-colors group cursor-pointer",
                            selectedOrder?.sampleId === o.sampleId ? "bg-blue-50/30" : ""
                          )}
                          onClick={() => setSelectedOrder(o)}
                        >
                          <td className="py-3 font-bold text-slate-800">{o.sampleId}</td>
                          <td className="py-3">
                            <div className="font-bold text-slate-700">{o.name}</div>
                            <div className="text-[10px] text-slate-400">{o.uhid}</div>
                          </td>
                          <td className="py-3 font-semibold text-slate-600">{o.testName}</td>
                          <td className="py-3 text-slate-500">{o.doctor}</td>
                          <td className="py-3 text-slate-400">{o.collectionTime}</td>
                          <td className="py-3 text-center">
                            <span className={cn(
                              "inline-block px-1.5 py-0.5 rounded text-[8px] font-bold border tracking-wider uppercase",
                              o.priority === "Critical" ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse" :
                              o.priority === "Urgent" ? "bg-orange-50 text-orange-700 border-orange-100" :
                              "bg-slate-50 text-slate-550 border-slate-100"
                            )}>
                              {o.priority}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={cn(
                              "inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold border",
                              o.status === "Sample Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                              o.status === "Sample Collected" ? "bg-blue-50 text-blue-700 border-blue-100" :
                              o.status === "Testing" ? "bg-purple-50 text-purple-700 border-purple-100" :
                              "bg-emerald-50 text-emerald-700 border-emerald-100"
                            )}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrintBarcode(o.sampleId);
                                }}
                                className="p-1 rounded-md border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                                title="Print Tube Barcode"
                              >
                                <Printer size={12} />
                              </button>
                              <ChevronRight size={14} className="text-slate-350 mt-1" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Operations Console (Collection Panel or Report Entry) */}
            {selectedOrder ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
                
                {/* Header Information Panel */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <span className="text-[10px] text-blue-600 font-extrabold tracking-wider uppercase">Active LIS Workstation Chamber</span>
                    <h3 className="text-base font-black text-slate-800 mt-1">{selectedOrder.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{selectedOrder.uhid} · {selectedOrder.testName}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded border uppercase block tracking-wider text-center",
                      selectedOrder.priority === "Critical" ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse" :
                      selectedOrder.priority === "Urgent" ? "bg-orange-50 text-orange-700 border-orange-150" :
                      "bg-slate-50 text-slate-600 border-slate-200"
                    )}>
                      {selectedOrder.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Requested Sample: {selectedOrder.sampleType}</span>
                  </div>
                </div>

                {/* Flow A: Collect Sample Panel */}
                {selectedOrder.status === "Sample Pending" && (
                  <form onSubmit={handleConfirmCollection} className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <TestTube size={14} className="text-amber-500" />
                      1. Sample Collection Registration Panel
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Verified Sample ID</label>
                        <input
                          type="text"
                          disabled
                          value={`CHC-${selectedOrder.sampleId}`}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Sample Collection Fluid Type</label>
                        <select
                          value={collectSampleType}
                          onChange={e => setCollectSampleType(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          <option>Blood (EDTA/Serum)</option>
                          <option>Urine (Clean Catch)</option>
                          <option>Sputum Swab</option>
                          <option>Stool Sample</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Phlebotomist / Collector</label>
                        <input
                          type="text"
                          required
                          value={collectCollector}
                          onChange={e => setCollectCollector(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-2">
                      <input
                        type="checkbox"
                        id="verify-check"
                        required
                        className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                      />
                      <label htmlFor="verify-check" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer font-medium">
                        I verify the patient identity matches the barcode label and sample container details. Tube is correctly vacuum sealed.
                      </label>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="btn-outline px-4 py-2 rounded-xl text-xs font-bold border-slate-200 text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} />
                        Mark Sample Collected
                      </button>
                    </div>
                  </form>
                )}

                {/* Flow B: Report Entry Form */}
                {selectedOrder.status !== "Sample Pending" && (
                  <form onSubmit={handleDispatchReport} className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <FileText size={14} className="text-purple-500" />
                      2. Pathology Report Diagnostics Registry Form
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Test Name</label>
                        <input
                          type="text"
                          disabled
                          value={selectedOrder.testName}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Result Finding Value *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hb: 12.8 g/dL / Negative"
                          value={reportResult}
                          onChange={e => setReportResult(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-bold text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Normal Physiological Range</label>
                        <input
                          type="text"
                          placeholder="e.g. Hb: 12.0 - 16.0 g/dL"
                          value={reportNormalRange}
                          onChange={e => setReportNormalRange(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Technician / Medical Sign-off</label>
                        <input
                          type="text"
                          required
                          value={reportTechnician}
                          onChange={e => setReportTechnician(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Diagnostic Pathology Remarks</label>
                        <input
                          type="text"
                          placeholder="e.g. Findings suggest acute bacterial infection..."
                          value={reportRemarks}
                          onChange={e => setReportRemarks(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-2">
                      <input
                        type="checkbox"
                        id="verify-report"
                        checked={reportVerified}
                        onChange={e => setReportVerified(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-slate-350 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                      />
                      <label htmlFor="verify-report" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer font-bold">
                        I verify all findings have been verified on the clinical analyzer and authorize direct dispatch to Doctor EHR records.
                      </label>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="btn-outline px-4 py-2 rounded-xl text-xs font-bold border-slate-200 text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!reportVerified}
                        className="btn-teal px-5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 size={13} />
                        Approve & Mark Complete
                      </button>
                    </div>
                  </form>
                )}

              </div>
            ) : (
              <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-450 text-xs flex flex-col items-center justify-center gap-2">
                <FlaskConical size={24} className="text-slate-350" />
                <span>Select a sample order from the table to start verification or enter diagnostics report values.</span>
              </div>
            )}

          </div>

          {/* Right Column: Quick Operations, Critical Alerts, Analyzer timeline */}
          <div className="space-y-6">

            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5 text-slate-450 border-b border-slate-50 pb-1.5">
                Quick Actions Panel
              </h3>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Barcode Search ID..."
                    value={qaSearchInput}
                    onChange={e => setQaSearchInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                  />
                  <button
                    onClick={handleQuickActionSearch}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                  >
                    Search
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[10.5px]">
                  <button
                    onClick={() => {
                      const match = orders.find(o => o.status === "Sample Pending");
                      if (match) setSelectedOrder(match);
                    }}
                    className="p-2.5 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <TestTube className="text-blue-500" size={16} />
                    Collect Sample
                  </button>
                  <button
                    onClick={() => {
                      if (selectedOrder) handlePrintBarcode(selectedOrder.sampleId);
                      else alert("Please select an active sample order row first.");
                    }}
                    className="p-2.5 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <Printer className="text-teal-500" size={16} />
                    Print Barcode
                  </button>
                  <button
                    onClick={() => {
                      if (recentReports.length > 0) alert(`Printing report archive receipt for ${recentReports[0].patientName}`);
                      else alert("No recently completed report logged to reprint.");
                    }}
                    className="p-2.5 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <FileText className="text-purple-500" size={16} />
                    Print Report
                  </button>
                  <button
                    onClick={() => alert("External pathology document upload interface simulation.")}
                    className="p-2.5 border border-slate-100 hover:border-slate-350 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <FileSpreadsheet className="text-slate-500" size={16} />
                    Upload Report
                  </button>
                </div>
              </div>
            </div>

            {/* Critical Value Alerts Console (RedAlert) */}
            <div className="bg-red-50/10 border-2 border-red-100 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-center border-b border-red-50 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                  <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">Critical Value Alerts</h3>
                </div>
                <span className="text-[9px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                  {criticalAlerts.length} Alerts
                </span>
              </div>

              <div className="space-y-3">
                {criticalAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-white border border-red-100 rounded-xl shadow-xs space-y-1 animate-fade-in-up">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <span className="text-xs font-bold text-slate-800">{alert.patientName}</span>
                      <span className="text-[8px] font-extrabold text-red-650 tracking-wide uppercase px-1 border border-red-100 rounded bg-red-50">
                        {alert.urgency}
                      </span>
                    </div>
                    <p className="text-[10px] text-red-600 font-semibold">{alert.finding}</p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Time Logged: {alert.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Tests (Analyzers process status) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5 text-slate-450 border-b border-slate-50 pb-1.5">
                Active Chemical Analyzers
              </h3>
              
              <div className="space-y-3">
                {activeTests.map(test => (
                  <div key={test.id} className="p-3 border border-slate-100 bg-slate-50/40 rounded-xl space-y-2 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{test.patientName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{test.testName}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                        <span className="text-[9px] text-purple-750 font-bold uppercase">{test.status}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-450 bg-slate-50 px-2 py-0.5 rounded border">
                      {test.eta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Completed Reports archive */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5 text-slate-450 border-b border-slate-50 pb-1.5">
                Recent Dispatched Reports
              </h3>

              <div className="space-y-3">
                {recentReports.map(report => (
                  <div key={report.id} className="p-3 border border-slate-100 rounded-xl space-y-1.5 flex justify-between items-center gap-3 hover:bg-slate-50/20 transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{report.patientName}</h4>
                      <p className="text-[10px] text-slate-500">{report.testName} · <span className="font-semibold text-slate-700">{report.findings}</span></p>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Completed at {report.completedTime}</span>
                    </div>

                    <button
                      onClick={() => alert(`Downloading PDF clinical laboratory report for ${report.patientName}...`)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Download PDF Report"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default LaboratoryDashboard;
