import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Printer, 
  Plus, 
  ShieldAlert, 
  Truck, 
  DollarSign, 
  Calendar,
  X,
  TrendingUp,
  Package
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { cn } from "../../lib/utils";
import { useHospital } from "../../context/useHospital";
import { createAuditLog } from "../../context/helpers";


// ─── Interfaces ───────────────────────────────────────────────────────────────
interface PrescribedDrug {
  drugName: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  qtyNeeded: number;
}

interface PrescriptionOrder {
  id: string;
  uhid: string;
  name: string;
  age: number;
  gender: string;
  doctor: string;
  department: string;
  drugs: PrescribedDrug[];
  date: string;
  priority: "Routine" | "Urgent" | "Emergency";
  status: "Pending" | "Verified" | "Ready" | "Dispensed";
  diagnosis: string;
  allergies: string;
  weight: string;
  bloodGroup: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  mrp: string;
  purchasePrice: string;
  manufacturer: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface TransactionRecord {
  time: string;
  type: "Medicine Dispensed" | "New Stock Received" | "Expired Medicines Removed" | "Audit Adjustment";
  refId: string;
  details: string;
}

interface SupplierItem {
  name: string;
  pendingOrders: string;
  deliveryDate: string;
  status: "On Route" | "Pending" | "Delayed";
}

interface NotificationItem {
  id: string;
  type: "expiry" | "low_stock" | "out_of_stock" | "verification" | "delivery";
  message: string;
  time: string;
}

// ─── Initial Dummy Data ───────────────────────────────────────────────────────
const initialPrescriptions: PrescriptionOrder[] = [
  {
    id: "RX-2101",
    uhid: "UHID-20260710",
    name: "Suresh Oraon",
    age: 42,
    gender: "Male",
    doctor: "Dr. Priya Sharma",
    department: "General Medicine",
    date: "2026-07-10",
    priority: "Routine",
    status: "Pending",
    diagnosis: "Acute Bronchitis & Hypertension",
    allergies: "Sulfonamides",
    weight: "68 kg",
    bloodGroup: "O+",
    drugs: [
      { drugName: "Paracetamol", strength: "500mg", dosage: "1 Tablet", frequency: "Twice Daily", duration: "5 Days", qtyNeeded: 10 },
      { drugName: "Amoxicillin", strength: "500mg", dosage: "1 Capsule", frequency: "Thrice Daily", duration: "5 Days", qtyNeeded: 15 },
      { drugName: "Amlodipine", strength: "5mg", dosage: "1 Tablet", frequency: "Once Daily", duration: "10 Days", qtyNeeded: 10 }
    ]
  },
  {
    id: "RX-2102",
    uhid: "UHID-20260712",
    name: "Anjali Devi",
    age: 28,
    gender: "Female",
    doctor: "Dr. Kavita Devi",
    department: "Obstetrics & Gynaecology",
    date: "2026-07-10",
    priority: "Urgent",
    status: "Verified",
    diagnosis: "Gestational Anemia",
    allergies: "Penicillin",
    weight: "59 kg",
    bloodGroup: "B+",
    drugs: [
      { drugName: "Iron & Folic Acid Tablet", strength: "100mg", dosage: "1 Tablet", frequency: "Once Daily", duration: "30 Days", qtyNeeded: 30 },
      { drugName: "Calcium Carbonate", strength: "500mg", dosage: "1 Tablet", frequency: "Once Daily", duration: "30 Days", qtyNeeded: 30 }
    ]
  },
  {
    id: "RX-2103",
    uhid: "UHID-20260715",
    name: "Bipin Kujur",
    age: 50,
    gender: "Male",
    doctor: "Dr. Meena Kumari",
    department: "Ophthalmology",
    date: "2026-07-10",
    priority: "Routine",
    status: "Ready",
    diagnosis: "Senile Cataract Pre-op Preparation",
    allergies: "None",
    weight: "74 kg",
    bloodGroup: "A+",
    drugs: [
      { drugName: "Ciprofloxacin Drops", strength: "0.3%", dosage: "2 Drops", frequency: "4 Times Daily", duration: "7 Days", qtyNeeded: 1 },
      { drugName: "Flurbiprofen Drops", strength: "0.03%", dosage: "1 Drop", frequency: "Thrice Daily", duration: "7 Days", qtyNeeded: 1 }
    ]
  },
  {
    id: "RX-2104",
    uhid: "UHID-20260718",
    name: "Lalmohan Singh",
    age: 60,
    gender: "Male",
    doctor: "Dr. Anita Singh",
    department: "Emergency Medicine",
    date: "2026-07-10",
    priority: "Emergency",
    status: "Pending",
    diagnosis: "Severe Dehydration & Hypokalemia",
    allergies: "NSAIDs",
    weight: "62 kg",
    bloodGroup: "AB+",
    drugs: [
      { drugName: "Oral Rehydration Salts (ORS)", strength: "21.8g", dosage: "1 Packet", frequency: "As Needed (SOS)", duration: "2 Days", qtyNeeded: 5 },
      { drugName: "Potassium Chloride Syrup", strength: "10%", dosage: "10ml", frequency: "Twice Daily", duration: "3 Days", qtyNeeded: 1 }
    ]
  }
];

const initialInventory: InventoryItem[] = [
  { id: "INV-001", name: "Paracetamol", category: "Analgesics", batchNo: "PCM-26A", expiryDate: "Aug 2028", quantity: 2450, unit: "Tablets", mrp: "₹15.00", purchasePrice: "₹4.50", manufacturer: "Cipla Ltd.", status: "In Stock" },
  { id: "INV-002", name: "Amoxicillin", strength: "500mg", category: "Antibiotics", batchNo: "AMX-25F", expiryDate: "Nov 2027", quantity: 420, unit: "Capsules", mrp: "₹85.00", purchasePrice: "₹24.00", manufacturer: "Sun Pharma", status: "In Stock" } as any,
  { id: "INV-003", name: "Amlodipine", category: "Antihypertensives", batchNo: "AML-25M", expiryDate: "Oct 2027", quantity: 22, unit: "Tablets", mrp: "₹22.00", purchasePrice: "₹6.00", manufacturer: "Lupin Ltd.", status: "Low Stock" },
  { id: "INV-004", name: "Insulin Glargine", category: "Antidiabetic", batchNo: "INS-452", expiryDate: "Jul 2026", quantity: 0, unit: "Vials", mrp: "₹420.00", purchasePrice: "₹180.00", manufacturer: "Biocon", status: "Out of Stock" },
  { id: "INV-005", name: "Iron & Folic Acid Tablet", category: "Nutritional supplements", batchNo: "IFA-26B", expiryDate: "Jun 2028", quantity: 4500, unit: "Tablets", mrp: "₹0.00", purchasePrice: "₹0.00", manufacturer: "Govt Supply", status: "In Stock" },
  { id: "INV-006", name: "Calcium Carbonate", category: "Supplements", batchNo: "CAL-25D", expiryDate: "Feb 2028", quantity: 1800, unit: "Tablets", mrp: "₹45.00", purchasePrice: "₹12.00", manufacturer: "Abbott India", status: "In Stock" },
  { id: "INV-007", name: "Ciprofloxacin Drops", category: "Ophthalmics", batchNo: "CIP-25H", expiryDate: "Dec 2027", quantity: 120, unit: "Bottles", mrp: "₹30.00", purchasePrice: "₹8.00", manufacturer: "Alcon", status: "In Stock" },
  { id: "INV-008", name: "ORS Packets", category: "Electrolytes", batchNo: "ORS-26K", expiryDate: "Jan 2029", quantity: 500, unit: "Packets", mrp: "₹0.00", purchasePrice: "₹0.00", manufacturer: "Govt Supply", status: "In Stock" }
];

const initialTransactions: TransactionRecord[] = [
  { time: "09:12 AM", type: "Medicine Dispensed", refId: "RX-2101", details: "Dispensed Paracetamol, Amoxicillin to Suresh Oraon" },
  { time: "09:30 AM", type: "New Stock Received", refId: "PO-4091", details: "Amoxicillin 500mg - 500 Boxes added to formulary" },
  { time: "10:05 AM", type: "Expired Medicines Removed", refId: "WST-081", details: "Removed 15 vials of expired insulin vials from inventory" }
];

const initialSuppliers: SupplierItem[] = [
  { name: "Sun Pharma Distributors", pendingOrders: "Order #234", deliveryDate: "Tomorrow", status: "On Route" },
  { name: "Cipla Medical Agency", pendingOrders: "Order #241", deliveryDate: "July 15, 2026", status: "Pending" },
  { name: "Lupin State Logistics", pendingOrders: "Order #210", deliveryDate: "Delayed", status: "Delayed" }
];

const initialNotifications: NotificationItem[] = [
  { id: "NT-01", type: "expiry", message: "Batch INS-452 (Insulin) nearing expiry (expires in 15 days).", time: "10 mins ago" },
  { id: "NT-02", type: "low_stock", message: "Amlodipine 5mg has dropped to low stock (22 tablets remaining).", time: "30 mins ago" },
  { id: "NT-03", type: "out_of_stock", message: "Insulin Glargine Vials are currently OUT of stock.", time: "1 hour ago" },
  { id: "NT-04", type: "verification", message: "Prescription RX-2104 (Emergency) is awaiting pharmacist verification.", time: "Just now" }
];

// Analytics Mock Data
const dispensedData = [
  { day: "Mon", count: 85 },
  { day: "Tue", count: 98 },
  { day: "Wed", count: 120 },
  { day: "Thu", count: 110 },
  { day: "Fri", count: 126 },
  { day: "Sat", count: 95 },
  { day: "Sun", count: 40 }
];

const topMedicines = [
  { name: "Paracetamol", value: 35 },
  { name: "Amoxicillin", value: 25 },
  { name: "Iron & FA", value: 20 },
  { name: "Calcium Carb", value: 12 },
  { name: "Others", value: 8 }
];

const COLORS = ["#0ea5e9", "#14b8a6", "#a855f7", "#eab308", "#64748b"];

// ─── Pharmacy Dashboard Component ────────────────────────────────────────────
const PharmacyDashboard: React.FC = () => {
  const { state, dispatch } = useHospital();

  const contextPrescriptions: PrescriptionOrder[] = state.prescriptions.map((p) => ({
    id: p.id,
    uhid: p.uhid || "JHR-2026-LIVE",
    name: p.name,
    age: Number(p.age) || 35,
    gender: p.gender || "Male",
    doctor: p.doctor,
    department: p.department,
    drugs: p.drugs.map((d) => ({
      drugName: d.drugName,
      strength: d.strength || "Standard",
      dosage: d.dosage,
      frequency: d.frequency,
      duration: d.duration,
      qtyNeeded: d.qtyNeeded || 10,
    })),
    date: p.date,
    priority: (p.priority === "Normal" ? "Routine" : p.priority) as any,
    status: (p.status as any),
    diagnosis: p.diagnosis || "General Consult",
    allergies: p.allergies || "None",
    weight: p.weight || "65 kg",
    bloodGroup: p.bloodGroup || "O+",
  }));
  const prescriptions = contextPrescriptions.length > 0 ? contextPrescriptions : initialPrescriptions;

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [suppliers] = useState<SupplierItem[]>(initialSuppliers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [selectedRx, setSelectedRx] = useState<PrescriptionOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Medicine Search Query
  const [medSearchQuery, setMedSearchQuery] = useState("");

  // Verification toast banner
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelectRx = (rx: PrescriptionOrder) => {
    setSelectedRx(rx);
    setSuccessToast(null);
  };

  // Dispatch Action
  const handleConfirmDispense = () => {
    if (!selectedRx) return;

    // Deduct stock
    setInventory(prev => prev.map(item => {
      const prescribed = selectedRx.drugs.find(d => d.drugName === item.name);
      if (prescribed) {
        const remaining = Math.max(0, item.quantity - prescribed.qtyNeeded);
        let newStatus: InventoryItem["status"] = "In Stock";
        if (remaining === 0) newStatus = "Out of Stock";
        else if (remaining < 100) newStatus = "Low Stock";

        return {
          ...item,
          quantity: remaining,
          status: newStatus
        };
      }
      return item;
    }));

    // Add transaction log
    const drugsSummary = selectedRx.drugs.map(d => `${d.drugName} x${d.qtyNeeded}`).join(", ");
    const newTx: TransactionRecord = {
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      type: "Medicine Dispensed",
      refId: selectedRx.id,
      details: `Dispensed ${drugsSummary} to ${selectedRx.name}`
    };
    setTransactions(prev => [newTx, ...prev]);

    dispatch({
      type: "DISPENSE_PRESCRIPTION",
      payload: {
        prescriptionId: selectedRx.id,
        transaction: {
          id: `TX-${Math.random().toString(36).slice(2, 8)}`,
          time: newTx.time,
          type: "Dispense",
          refId: selectedRx.id,
          details: newTx.details,
        },
        audit: createAuditLog("pharmacy", "Pharmacy Desk", "MEDICINE_DISPENSED", "Prescription", selectedRx.id, `Dispensed medicines to ${selectedRx.name}`),
      },
    });

    setSuccessToast(`Medicines successfully dispensed for ${selectedRx.name} (Prescription: ${selectedRx.id}). Inventory adjusted.`);
    setSelectedRx(null);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Restock Action
  const handleRestockMedicine = (medName: string) => {
    setInventory(prev => prev.map(item => {
      if (item.name === medName) {
        return {
          ...item,
          quantity: item.quantity + 500,
          status: "In Stock"
        };
      }
      return item;
    }));
    triggerSimulatedNotification(`Stock replenishment: 500 units of ${medName} received.`);
  };

  const triggerSimulatedNotification = (message: string) => {
    const newNotif: NotificationItem = {
      id: `NT-0${notifications.length + 1}`,
      type: "delivery",
      message: message,
      time: "Just now"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Status colors mapping
  const getPriorityCls = (priority: string) => {
    switch (priority) {
      case "Emergency": return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse font-bold";
      case "Urgent": return "bg-orange-50 text-orange-700 border-orange-200 font-bold";
      default: return "bg-blue-50 text-blue-700 border-blue-150";
    }
  };

  const getStatusCls = (status: string) => {
    switch (status) {
      case "Dispensed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Ready": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Verified": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default: return "bg-amber-50 text-amber-700 border-amber-250";
    }
  };

  // Filter queue
  const filteredQueue = prescriptions.filter(rx => {
    const matchesSearch = 
      rx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === "All" || rx.department === deptFilter;
    const matchesStatus = statusFilter === "All" || rx.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Filter medicine search results
  const filteredMeds = inventory.filter(item => 
    item.name.toLowerCase().includes(medSearchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(medSearchQuery.toLowerCase()) ||
    item.batchNo.toLowerCase().includes(medSearchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Pharmacy Management Console — CHC Bharno HMS</title>
      </Helmet>

      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800">Pharmacy Management System</h1>
            <p className="text-slate-500 text-xs mt-0.5">Manage prescriptions, medicine dispensing, inventory, stock monitoring and pharmacy operations.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-slate-700">🟢 Pharmacy Counter Open</span>
          </div>
        </div>

        {/* ── Success Toast Notification Banner ── */}
        {successToast && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 animate-fade-in-up shadow-sm">
            <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0" size={18} />
            <span className="text-xs font-bold">{successToast}</span>
          </div>
        )}

        {/* ── Dashboard Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ClipboardList size={20} />
              </div>
              <span className="text-[10px] font-bold text-blue-650 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                Rx Pending
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">
                {prescriptions.filter(p => p.status !== "Dispensed").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Pending Prescriptions</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-150">
                Dispensed
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">126</h3>
              <p className="text-xs text-slate-500 mt-1">Medicines Dispensed Today</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <AlertTriangle size={20} />
              </div>
              <span className="text-[10px] font-bold text-orange-655 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                Low Stock
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">
                {inventory.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Low Stock Alerts</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-650">
                <Calendar size={20} />
              </div>
              <span className="text-[10px] font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded-lg border border-red-150">
                Expiring
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">9</h3>
              <p className="text-xs text-slate-500 mt-1">Expire within 30 Days</p>
            </div>
          </div>
        </div>

        {/* ── Main Layout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (70%) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Prescription Queue Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-850">Doctor Prescription Queue</h2>
                  <p className="text-[11px] text-slate-450 mt-0.5">Click any prescription row to load details into the Dispensing Desk workspace.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
                    <input
                      type="text"
                      placeholder="Search Rx ID / Patient / UHID..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 w-44"
                    />
                  </div>
                  <select
                    value={deptFilter}
                    onChange={e => setDeptFilter(e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-slate-50/50 focus:outline-none font-semibold text-slate-650"
                  >
                    <option value="All">All Departments</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Obstetrics & Gynaecology">O.B.G.Y.N.</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Emergency Medicine">Emergency</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-slate-50/50 focus:outline-none font-semibold text-slate-650"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Ready">Ready</option>
                    <option value="Dispensed">Dispensed</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-2">Prescription ID</th>
                      <th className="pb-2">Patient Details</th>
                      <th className="pb-2">Prescribing Doctor</th>
                      <th className="pb-2">Medicines Requested</th>
                      <th className="pb-2 text-center">Priority</th>
                      <th className="pb-2 text-center">Status</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredQueue.map(rx => (
                      <tr 
                        key={rx.id} 
                        onClick={() => handleSelectRx(rx)}
                        className={cn(
                          "hover:bg-slate-50/40 cursor-pointer transition-colors group",
                          selectedRx?.id === rx.id ? "bg-blue-50/30" : ""
                        )}
                      >
                        <td className="py-3 font-bold text-slate-800">{rx.id}</td>
                        <td className="py-3">
                          <div className="font-bold text-slate-700">{rx.name}</div>
                          <div className="text-[10px] text-slate-400">{rx.uhid}</div>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">
                          <div>{rx.doctor}</div>
                          <div className="text-[9px] text-slate-400">{rx.department}</div>
                        </td>
                        <td className="py-3 text-slate-550 max-w-[150px] truncate" title={rx.drugs.map(d => d.drugName).join(", ")}>
                          {rx.drugs.map(d => d.drugName).join(", ")}
                        </td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            "inline-block px-1.5 py-0.5 rounded text-[8px] font-bold border tracking-wider uppercase",
                            getPriorityCls(rx.priority)
                          )}>
                            {rx.priority}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            "inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border",
                            getStatusCls(rx.status)
                          )}>
                            {rx.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[10px] font-extrabold text-blue-650 transition-colors shadow-xs"
                          >
                            Dispense
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dispensing Workspace Panel */}
            {selectedRx ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 animate-fade-in-up">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] text-blue-600 font-extrabold tracking-wider uppercase">Active Dispensing Station Chamber</span>
                    <h3 className="text-base font-black text-slate-800 mt-0.5">Dispensing Desk: {selectedRx.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedRx(null)}
                    className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Patient medical summary metrics cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 border border-slate-150 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Allergies:</span>
                    <strong className={cn(
                      "font-bold",
                      selectedRx.allergies !== "None" ? "text-rose-600 font-extrabold" : "text-slate-700"
                    )}>{selectedRx.allergies}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Clinical Diagnosis:</span>
                    <strong className="text-slate-700 truncate block" title={selectedRx.diagnosis}>{selectedRx.diagnosis}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Weight & Blood Group:</span>
                    <strong className="text-slate-750 font-bold">{selectedRx.weight} · {selectedRx.bloodGroup}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Prescribing Clinical Office:</span>
                    <strong className="text-slate-700">{selectedRx.doctor} ({selectedRx.department})</strong>
                  </div>
                </div>

                {/* Prescription Drugs checklist */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-450 uppercase tracking-widest">Intake Prescription Formulation Checklist</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                          <th className="pb-2">Medicine Formula</th>
                          <th className="pb-2">Strength</th>
                          <th className="pb-2">Dosage Instructions</th>
                          <th className="pb-2">Duration</th>
                          <th className="pb-2 text-right">Qty Needed</th>
                          <th className="pb-2 text-right">Available Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {selectedRx.drugs.map((d, i) => {
                          const stockItem = inventory.find(inv => inv.name === d.drugName);
                          const currentStock = stockItem ? stockItem.quantity : 0;
                          return (
                            <tr key={i} className="hover:bg-slate-50/20">
                              <td className="py-2.5 font-bold text-slate-750">{d.drugName}</td>
                              <td className="py-2.5 text-slate-500 font-medium">{d.strength}</td>
                              <td className="py-2.5 text-slate-500">
                                <div>{d.dosage}</div>
                                <div className="text-[9px] text-slate-400">{d.frequency}</div>
                              </td>
                              <td className="py-2.5 text-slate-400">{d.duration}</td>
                              <td className="py-2.5 text-right font-bold text-slate-800">{d.qtyNeeded}</td>
                              <td className="py-2.5 text-right">
                                <span className={cn(
                                  "inline-block px-1.5 py-0.2 rounded border text-[9px] font-extrabold",
                                  currentStock === 0 ? "bg-red-50 text-red-700 border-red-100" :
                                  currentStock < 100 ? "bg-amber-50 text-amber-700 border-amber-100" :
                                  "bg-emerald-50 text-emerald-700 border-emerald-100"
                                )}>
                                  {currentStock === 0 ? "Out of Stock" : `${currentStock} units`}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Panel action buttons */}
                <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Reprinting Prescription Ticket: ${selectedRx.id}`)}
                      className="px-3.5 py-2 rounded-xl text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all flex items-center gap-1.5"
                    >
                      <Printer size={13} />
                      Print Bill Slip
                    </button>
                    <button
                      onClick={() => alert(`Invoice simulated: ${selectedRx.id}\nPatient Cost: ₹0.00 (Ayushman covered)`)}
                      className="px-3.5 py-2 rounded-xl text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all flex items-center gap-1.5"
                    >
                      <DollarSign size={13} />
                      Generate Invoice
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRx(null)}
                      className="px-4 py-2 rounded-xl text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDispense}
                      className="btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} />
                      Dispense Medicines
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-450 text-xs flex flex-col items-center justify-center gap-2">
                <ClipboardList size={24} className="text-slate-350" />
                <span>Select a prescription order from the queue table above to begin verification and dispensing checkouts.</span>
              </div>
            )}

            {/* Daily Pharmacy Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Chart 1: Medicines Dispensed Per Day */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-blue-500" />
                  Medicines Dispensed Per Day
                </h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dispensedData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip cursor={{ fill: "#f8fafc" }} />
                      <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Top Dispensed Medication Formulas */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                  <Package size={14} className="text-teal-500" />
                  Top Dispensed Formulas
                </h3>
                <div className="h-56 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="75%">
                    <PieChart>
                      <Pie
                        data={topMedicines}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {topMedicines.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2.5 justify-center mt-3 text-[10px] font-bold text-slate-600">
                    {topMedicines.map((item, index) => (
                      <span key={item.name} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {item.name} ({item.value}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Recent Transactions & Logs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5 text-slate-450 border-b border-slate-50 pb-1.5">
                Recent Dispensary Logs & Actions
              </h3>
              
              <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                {transactions.map((tx, idx) => (
                  <div key={idx} className="flex gap-3 text-xs items-start">
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 mt-0.5 flex-shrink-0">
                      {tx.time}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-bold text-slate-800">{tx.type}</strong>
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50/50 px-1.5 py-0.2 rounded">
                          {tx.refId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{tx.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (30%): Alerts, Suppliers, Search, Actions */}
          <div className="space-y-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-3.5 border-b border-slate-50 pb-1.5">
                Pharmacy Quick Actions
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-center text-[10.5px]">
                <button
                  onClick={() => alert("Formulary modal: add new chemical entry.")}
                  className="p-3 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                >
                  <Plus className="text-blue-500" size={16} />
                  Add Medicine
                </button>
                <button
                  onClick={() => {
                    const match = prescriptions.find(p => p.status !== "Dispensed");
                    if (match) setSelectedRx(match);
                  }}
                  className="p-3 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                >
                  <ClipboardList className="text-teal-500" size={16} />
                  Dispense Medicine
                </button>
                <button
                  onClick={() => handleRestockMedicine("Amlodipine")}
                  className="p-3 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                >
                  <Truck className="text-purple-500" size={16} />
                  Receive Stock
                </button>
                <button
                  onClick={() => alert("Print queue barcode label slip.")}
                  className="p-3 border border-slate-100 hover:border-slate-350 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                >
                  <Printer className="text-slate-500" size={16} />
                  Print Barcode
                </button>
              </div>
            </div>

            {/* Medicine Search Directory */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-3.5 border-b border-slate-50 pb-1.5">
                Medication Formulary Search
              </h3>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
                  <input
                    type="text"
                    placeholder="Search medicine, batch number..."
                    value={medSearchQuery}
                    onChange={e => setMedSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {filteredMeds.map(item => (
                    <div key={item.id} className="p-2.5 border border-slate-100 rounded-xl text-[11px] space-y-1 relative hover:bg-slate-50/20 transition-all">
                      <div className="flex justify-between items-start gap-1">
                        <strong className="text-slate-800 font-bold">{item.name}</strong>
                        <span className={cn(
                          "text-[8px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider",
                          item.status === "In Stock" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          item.status === "Low Stock" ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                          "bg-rose-50 text-rose-700 border-rose-100 font-bold"
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Mfr: {item.manufacturer} · Exp: {item.expiryDate}</p>
                      <div className="flex justify-between items-center text-[10px] pt-1 font-medium text-slate-600">
                        <span>Stock: <strong className="text-slate-800">{item.quantity} units</strong></span>
                        <span>MRP: <strong className="text-slate-800">{item.mrp}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Alerts (Low stock, Expiring) */}
            <div className="bg-red-50/10 border-2 border-red-100 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b border-red-50 pb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="text-red-650" size={15} />
                  <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">Inventory Alerts</h3>
                </div>
                <span className="text-[9px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  Warnings
                </span>
              </div>

              <div className="space-y-2.5">
                {inventory.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").map(item => (
                  <div key={item.id} className="p-3 bg-white border border-red-100 rounded-xl shadow-xs space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-xs font-bold text-slate-800">{item.name}</span>
                      <span className="text-[8px] font-extrabold text-red-650 bg-red-50 border border-red-100 rounded px-1.5 uppercase">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-red-600 font-semibold">
                      {item.status === "Out of Stock" ? "Unavailable - Dispensary operations halted" : `Remaining stock: only ${item.quantity} units.`}
                    </p>
                    {item.status === "Low Stock" && (
                      <button
                        onClick={() => handleRestockMedicine(item.name)}
                        className="text-[9px] text-blue-600 font-bold hover:underline block pt-1 text-left"
                      >
                        Quick Restock +500
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Panel Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-3 border-b border-slate-50 pb-1.5">
                Formulary Supplier Orders
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-1.5">Supplier</th>
                      <th className="pb-1.5">Pending PO</th>
                      <th className="pb-1.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {suppliers.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/20">
                        <td className="py-2 font-bold text-slate-700">{s.name.split(" ")[0]}</td>
                        <td className="py-2 text-slate-500 font-medium">{s.pendingOrders}</td>
                        <td className="py-2 text-center">
                          <span className={cn(
                            "inline-block px-1.5 py-0.2 rounded border text-[8px] font-black uppercase tracking-wider",
                            s.status === "On Route" ? "bg-blue-50 text-blue-700 border-blue-100" :
                            s.status === "Delayed" ? "bg-rose-50 text-rose-700 border-rose-100" :
                            "bg-slate-50 text-slate-500 border-slate-200"
                          )}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notifications Alert Desk */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5 text-slate-450 border-b border-slate-50 pb-1.5">
                Notification Logs Console
              </h3>

              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className="flex gap-2.5 text-[11px] items-start hover:bg-slate-50/20 p-1.5 rounded-lg transition-all">
                    <span className={cn(
                      "w-2 h-2 rounded-full block mt-1.5 flex-shrink-0",
                      notif.type === "out_of_stock" || notif.type === "expiry" ? "bg-rose-500" :
                      notif.type === "low_stock" ? "bg-amber-500" : "bg-blue-500"
                    )} />
                    <div className="flex-1">
                      <p className="text-slate-650 font-medium leading-relaxed">{notif.message}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{notif.time}</span>
                    </div>
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

export default PharmacyDashboard;
