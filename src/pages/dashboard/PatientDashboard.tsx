import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { 
  CheckCircle2,
  Calendar,
  FileText,
  ClipboardList,
  Plus,
  ShieldCheck,
  Phone,
  User,
  Receipt,
  Bell,
  Search,
  AlertCircle,
  HeartPulse,
  TrendingUp,
  Sliders,
  X
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { cn } from "../../lib/utils";
import { useHospital } from "../../context/useHospital";
import { createAuditLog } from "../../context/helpers";


// ─── Interfaces ───────────────────────────────────────────────────────────────
interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  doctor: string;
  department: string;
  diagnosis: string;
  summary: string;
  status: "Finalized" | "Awaiting Review";
}

interface ActiveDrug {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor: string;
  status: "Active" | "Completed" | "Suspended";
}

interface LabReport {
  id: string;
  testName: string;
  doctor: string;
  date: string;
  result: string;
  status: "Pending" | "Ready" | "Completed";
  urgency: "Normal" | "Abnormal" | "Critical";
  remarks: string;
}

interface Appointment {
  id: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  room: string;
  token: string;
  status: "Confirmed" | "Completed" | "Awaiting Check-in" | "Cancelled";
}

interface BillItem {
  invoiceNo: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid";
  paymentMethod: string;
}

interface Vaccination {
  name: string;
  date: string;
  status: "Completed" | "Due";
  dosage: string;
  administeredBy: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  subtitle: string;
  type: "consult" | "sample" | "report" | "prescription" | "dispensed";
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "appointment" | "lab" | "prescription" | "message" | "billing" | "alert";
}

// ─── Initial Dummy Data ───────────────────────────────────────────────────────
const initialMedicalRecords: MedicalRecord[] = [
  { id: "REC-101", date: "2026-07-10", type: "OPD Consultation", doctor: "Dr. Priya Sharma", department: "General Medicine", diagnosis: "Acute Bronchitis & Hypertension", summary: "Presented with dry cough and elevated BP (130/85). Chest clear. Advised hydration, amoxicillin/paracetamol, and restricted dietary sodium.", status: "Finalized" },
  { id: "REC-102", date: "2026-05-10", type: "Health Camp Checkup", doctor: "Dr. Ramesh Gupta", department: "General Medicine", diagnosis: "Mild Hypertension", summary: "Routine screening at Panigarha Village Health Camp. BP recorded 135/85. Advised reduced salt diet and lifestyle modifications.", status: "Finalized" },
  { id: "REC-098", date: "2026-04-12", type: "Specialty Visit", doctor: "Dr. Vijay Oraon", department: "Dental Department", diagnosis: "Gingivitis & Dental Calculus", summary: "Gingival swelling and mild calculus accumulation. Completed dental scaling and prophylaxis. Prescribed chlorhexidine mouthwash.", status: "Finalized" }
];

const initialDrugs: ActiveDrug[] = [
  { id: "RX-2101-A", name: "Paracetamol", strength: "500mg", dosage: "1 Tablet", frequency: "Twice Daily (BD)", duration: "5 Days (Completed)", doctor: "Dr. Priya Sharma", status: "Completed" },
  { id: "RX-2101-B", name: "Amoxicillin", strength: "500mg", dosage: "1 Capsule", frequency: "Thrice Daily (TDS)", duration: "5 Days (Active)", doctor: "Dr. Priya Sharma", status: "Active" },
  { id: "RX-2101-C", name: "Amlodipine", strength: "5mg", dosage: "1 Tablet", frequency: "Once Daily (OD) - Morning", duration: "30 Days (Active)", doctor: "Dr. Priya Sharma", status: "Active" },
  { id: "RX-2088-A", name: "Atorvastatin", strength: "10mg", dosage: "1 Tablet", frequency: "Once Daily (OD) - Bedtime", duration: "30 Days (Active)", doctor: "Dr. Priya Sharma", status: "Active" },
  { id: "RX-2088-B", name: "Vitamin D3", strength: "60K", dosage: "1 Chewable", frequency: "Once Weekly", duration: "4 Weeks (Active)", doctor: "Dr. Priya Sharma", status: "Active" }
];

const initialLabReports: LabReport[] = [
  { id: "LAB-392", testName: "Widal Test (Typhoid)", doctor: "Dr. Priya Sharma", date: "2026-07-10", result: "Salmonella Typhi Titer: 1:160 Positive", status: "Completed", urgency: "Abnormal", remarks: "Titer indicates active phase typhoid infection. Correlate clinically." },
  { id: "LAB-390", testName: "Random Blood Sugar (RBS)", doctor: "Dr. Ramesh Gupta", date: "2026-05-10", result: "Blood Glucose: 110 mg/dL", status: "Completed", urgency: "Normal", remarks: "RBS is within normal reference range." },
  { id: "LAB-405", testName: "Liver Function Test (LFT)", doctor: "Dr. Priya Sharma", date: "2026-07-13", result: "Awaiting Lab Analyzer Outputs", status: "Pending", urgency: "Normal", remarks: "Sample collected. Test scheduled for run tonight." },
  { id: "LAB-406", testName: "Kidney Function Test (KFT)", doctor: "Dr. Priya Sharma", date: "2026-07-13", result: "Serum Creatinine: 1.8 mg/dL (Elevated)", status: "Ready", urgency: "Critical", remarks: "Critical creatinine level. Pharmacist & Doctor notified." }
];

const initialAppointments: Appointment[] = [
  { id: "APT-801", department: "General Medicine", doctor: "Dr. Priya Sharma (CMO)", date: "2026-07-15", time: "10:30 AM", room: "Room #3 (OPD Wing A)", token: "T-22", status: "Confirmed" },
  { id: "APT-789", department: "Dental Department", doctor: "Dr. Vijay Oraon", date: "2026-07-22", time: "11:15 AM", room: "Room #8 (Dental block)", token: "T-11", status: "Confirmed" },
  { id: "APT-602", department: "General Medicine", doctor: "Dr. Priya Sharma (CMO)", date: "2026-07-10", time: "09:30 AM", room: "Room #3", token: "T-05", status: "Completed" }
];

const initialBills: BillItem[] = [
  { invoiceNo: "INV-2026-902", date: "2026-07-10", amount: 150, status: "Paid", paymentMethod: "UPI (Google Pay)" },
  { invoiceNo: "INV-2026-905", date: "2026-07-12", amount: 500, status: "Paid", paymentMethod: "PM-JAY Card Covered" },
  { invoiceNo: "INV-2026-908", date: "2026-07-13", amount: 650, status: "Unpaid", paymentMethod: "Pending Payment Checkout" }
];

const initialVaccinations: Vaccination[] = [
  { name: "BCG Vaccine (Tuberculosis)", date: "1983-09-20", status: "Completed", dosage: "0.05 mL", administeredBy: "CHC Bharno Pediatrics" },
  { name: "OPV Polio Dose 1-3", date: "1984-03-12", status: "Completed", dosage: "2 Drops Oral", administeredBy: "Government Immunization Drive" },
  { name: "COVID-19 Covishield Dose 1", date: "2021-09-15", status: "Completed", dosage: "0.5 mL IM", administeredBy: "CHC Bharno Vaccine Desk" },
  { name: "COVID-19 Covishield Dose 2", date: "2021-12-15", status: "Completed", dosage: "0.5 mL IM", administeredBy: "CHC Bharno Vaccine Desk" },
  { name: "COVID-19 Precautionary Booster", date: "2022-06-22", status: "Completed", dosage: "0.5 mL IM", administeredBy: "CHC Bharno Vaccine Desk" },
  { name: "Influenza Seasonal Vaccine", date: "2025-11-10", status: "Completed", dosage: "0.5 mL IM", administeredBy: "CHC Bharno Wellness Desk" },
  { name: "Hepatitis B Booster", date: "2026-08-15", status: "Due", dosage: "1.0 mL IM", administeredBy: "Awaiting Administration" }
];

const initialTimeline: TimelineEvent[] = [
  { date: "15 July 2026", title: "OPD Doctor Consultation", subtitle: "General Medicine consultation scheduled with Dr. Priya Sharma", type: "consult" },
  { date: "13 July 2026", title: "Lab Report Generated (KFT)", subtitle: "Serum Creatinine reported critical value (1.8 mg/dL)", type: "report" },
  { date: "13 July 2026", title: "Blood & Urine Samples Collected", subtitle: "Samples for LFT & KFT routed to Pathology Chemical Analyzers", type: "sample" },
  { date: "10 July 2026", title: "Doctor Consultation Completed", subtitle: "Prescription updated for Hypertension & Bronchitis by Dr. Priya Sharma", type: "consult" },
  { date: "10 July 2026", title: "Medicine Dispensed", subtitle: "Paracetamol, Amoxicillin, and Amlodipine collected at Pharmacy Counter #1", type: "dispensed" },
  { date: "09 July 2026", title: "Prescription Added / Renewed", subtitle: "Amlodipine 5mg dosage guide generated", type: "prescription" }
];

const initialNotifications: NotificationItem[] = [
  { id: "N-01", title: "Upcoming Appointment Reminder", message: "Your consultation with Dr. Priya Sharma is scheduled in 2 days (July 15, 10:30 AM, Room #3).", time: "1 hour ago", read: false, type: "appointment" },
  { id: "N-02", title: "Lab Report Ready", message: "Kidney Function Test (KFT) result has been uploaded. Status: Critical.", time: "4 hours ago", read: false, type: "lab" },
  { id: "N-03", title: "Prescription Updated", message: "Dr. Priya Sharma renewed Amlodipine 5mg for 30 days.", time: "3 days ago", read: true, type: "prescription" },
  { id: "N-04", title: "General Message", message: "Welcome to the new digital CHC Bharno Patient Portal! You can now access all medical files online.", time: "5 days ago", read: true, type: "message" },
  { id: "N-05", title: "Payment Due Notification", message: "Invoice INV-2026-908 for ₹650 is awaiting payment checkout.", time: "Just now", read: false, type: "billing" }
];

// Recharts Dummy Trends
const monthlyVisitsData = [
  { month: "Jan", visits: 1 },
  { month: "Feb", visits: 0 },
  { month: "Mar", visits: 2 },
  { month: "Apr", visits: 1 },
  { month: "May", visits: 1 },
  { month: "Jun", visits: 0 },
  { month: "Jul", visits: 3 }
];

const bpTrendData = [
  { date: "May 10", systolic: 135, diastolic: 85 },
  { date: "Jun 02", systolic: 132, diastolic: 83 },
  { date: "Jun 20", systolic: 128, diastolic: 82 },
  { date: "Jul 10", systolic: 130, diastolic: 85 }
];

const sugarTrendData = [
  { date: "May 10", fasting: 98, pp: 140 },
  { date: "Jun 02", fasting: 95, pp: 138 },
  { date: "Jun 20", fasting: 96, pp: 136 },
  { date: "Jul 10", fasting: 104, pp: 148 }
];

const weightTrendData = [
  { date: "May 10", weight: 69.5 },
  { date: "Jun 02", weight: 68.8 },
  { date: "Jun 20", weight: 68.2 },
  { date: "Jul 10", weight: 68.0 }
];

// Patient profile details
const initialPatientProfile = {
  name: "Suresh Oraon",
  uhid: "UHID-20260710",
  aadhaar: "4509-3211-7890",
  dob: "1983-08-15",
  gender: "Male",
  bloodGroup: "O+",
  address: "Village Panigarha, Bharno Block, Gumla District, Jharkhand - 835209",
  phone: "+91 94310-55212",
  email: "suresh.oraon@gmail.com",
  emergencyContact: "Anjali Devi (Spouse) - +91 94310-55213",
  primaryDoctor: "Dr. Priya Sharma",
  insuranceStatus: "Active (PM-JAY)"
};

// ─── Patient Dashboard Component ─────────────────────────────────────────────
const PatientDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const { state, dispatch } = useHospital();

  const contextAppointments: Appointment[] = state.appointments.map((apt) => ({
    id: apt.id,
    department: apt.department,
    doctor: apt.doctor,
    date: apt.date,
    time: apt.timeSlot,
    room: apt.room || "Room #3",
    token: apt.token || "T-12",
    status: (apt.status === "Scheduled" ? "Confirmed" : apt.status === "In-Consultation" ? "Awaiting Check-in" : apt.status) as any,
  }));
  const [localAppointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const appointments = contextAppointments.length > 0 ? contextAppointments : localAppointments;

  const [meds] = useState<ActiveDrug[]>(initialDrugs);
  const [labReports] = useState<LabReport[]>(initialLabReports);
  const [bills, setBills] = useState<BillItem[]>(initialBills);
  const [vaccinations] = useState<Vaccination[]>(initialVaccinations);
  const [timeline] = useState<TimelineEvent[]>(initialTimeline);
  const [notifications] = useState<NotificationItem[]>(initialNotifications);
  const [profile, setProfile] = useState(initialPatientProfile);
  const [medicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);

  // Form States for Booking Appointment
  const [selectedDept, setSelectedDept] = useState("General Medicine");
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Priya Sharma (CMO)");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00 AM");

  // Global Patient Search
  const [globalSearch, setGlobalSearch] = useState("");

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedPhone, setEditedPhone] = useState(profile.phone);
  const [editedEmail, setEditedEmail] = useState(profile.email);
  const [editedAddress, setEditedAddress] = useState(profile.address);
  const [editedEmergency, setEditedEmergency] = useState(profile.emergencyContact);

  // Success Notification toast
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Active Reschedule state
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [newAptDate, setNewAptDate] = useState("");
  const [newAptTime, setNewAptTime] = useState("10:30 AM");

  // Helper function to switch tabs
  const setTab = (tabName: string) => {
    setSearchParams({ tab: tabName });
    window.scrollTo(0, 0);
  };

  // Submit Booking Form
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const newAptId = `APT-${Math.floor(800 + Math.random() * 199)}`;
    const newApt: Appointment = {
      id: newAptId,
      department: selectedDept,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      room: selectedDept.includes("Dental") ? "Room #8" : "Room #3",
      token: `T-${Math.floor(10 + Math.random() * 89)}`,
      status: "Confirmed",
    };

    setAppointments(prev => [newApt, ...prev]);

    dispatch({
      type: "BOOK_APPOINTMENT",
      payload: {
        appointment: {
          id: newAptId,
          patientId: profile.uhid || "JHR-2026-LIVE",
          uhid: profile.uhid || "JHR-2026-LIVE",
          name: profile.name || "Asha Devi",
          phone: profile.phone || "9876543210",
          date: selectedDate,
          timeSlot: selectedTime,
          department: selectedDept,
          doctor: selectedDoctor,
          room: newApt.room,
          token: newApt.token,
          status: "Scheduled",
          createdAt: new Date().toISOString(),
        },
        audit: createAuditLog("patient", "Patient Portal", "APPOINTMENT_BOOKED", "Appointment", newAptId, `Patient booked appointment with ${selectedDoctor}`),
      },
    });

    setSuccessToast(`Consultation request confirmed with ${selectedDoctor} for ${selectedDate} at ${selectedTime}.`);
    setTab("appointments");

    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Reschedule Appointment
  const handleReschedule = (aptId: string) => {
    if (!newAptDate) return;
    setAppointments(prev => prev.map(apt => {
      if (apt.id === aptId) {
        return { ...apt, date: newAptDate, time: newAptTime };
      }
      return apt;
    }));
    setRescheduleAptId(null);
    setSuccessToast("Appointment successfully rescheduled.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Cancel Appointment
  const handleCancelAppointment = (aptId: string) => {
    if (!confirm("Are you sure you want to cancel this scheduled appointment?")) return;
    setAppointments(prev => prev.map(apt => {
      if (apt.id === aptId) {
        return { ...apt, status: "Cancelled" };
      }
      return apt;
    }));

    dispatch({
      type: "UPDATE_APPOINTMENT_STATUS",
      payload: {
        appointmentId: aptId,
        status: "Cancelled",
        audit: createAuditLog("patient", "Patient Portal", "APPOINTMENT_CANCELLED", "Appointment", aptId, `Patient cancelled appointment ${aptId}`),
      },
    });

    setSuccessToast("Appointment has been cancelled.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Pay Outstanding Invoice
  const handlePayBill = (invoiceNo: string) => {
    setBills(prev => prev.map(bill => {
      if (bill.invoiceNo === invoiceNo) {
        return { ...bill, status: "Paid", paymentMethod: "UPI Transaction Checkout" };
      }
      return bill;
    }));
    setSuccessToast(`Invoice ${invoiceNo} paid successfully via UPI.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Update profile handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      phone: editedPhone,
      email: editedEmail,
      address: editedAddress,
      emergencyContact: editedEmergency
    }));
    setIsEditingProfile(false);
    setSuccessToast("Patient contact information updated successfully.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Helper colors
  const getUrgencyCls = (urg: LabReport["urgency"]) => {
    switch (urg) {
      case "Critical": return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse font-extrabold";
      case "Abnormal": return "bg-amber-50 text-amber-700 border-amber-200 font-bold";
      default: return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
  };

  // Filter lists based on global search
  const matchesGlobalSearch = (val: string) => 
    val.toLowerCase().includes(globalSearch.toLowerCase());

  const filteredMeds = meds.filter(m => matchesGlobalSearch(m.name) || matchesGlobalSearch(m.doctor));
  const filteredReports = labReports.filter(r => matchesGlobalSearch(r.testName) || matchesGlobalSearch(r.doctor));
  const filteredRecords = medicalRecords.filter(rec => matchesGlobalSearch(rec.diagnosis) || matchesGlobalSearch(rec.doctor));

  return (
    <>
      <Helmet>
        <title>Patient Portal — CHC Bharno HMS</title>
      </Helmet>

      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800">Patient Portal</h1>
            <p className="text-slate-500 text-xs mt-0.5">Welcome back, Suresh. Manage your healthcare journey from one secure dashboard.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="font-bold text-slate-700">🟢 Account Verified</span>
          </div>
        </div>

        {/* Global Patient Search Desk */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <Search className="text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search reports, prescriptions, appointments, diagnoses..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            className="w-full text-xs bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-slate-400 text-slate-700"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch("")} 
              className="text-xs text-slate-400 hover:text-slate-700 font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Success Alert Toast Banner ── */}
        {successToast && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 animate-fade-in-up shadow-sm">
            <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0" size={18} />
            <span className="text-xs font-bold">{successToast}</span>
          </div>
        )}

        {/* ── Dashboard Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            onClick={() => setTab("appointments")}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar size={20} />
              </div>
              <span className="text-[10px] font-bold text-blue-650 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                OPD Sessions
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">
                {appointments.filter(a => a.status === "Confirmed").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Upcoming Appointments</p>
            </div>
          </div>

          <div 
            onClick={() => setTab("prescriptions")}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ClipboardList size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                Prescriptions
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">
                {meds.filter(m => m.status === "Active").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Active Prescriptions</p>
            </div>
          </div>

          <div 
            onClick={() => setTab("labs")}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-bold text-orange-655 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                Lab Results
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">
                {labReports.filter(r => r.status === "Pending" || r.status === "Ready").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Pending Lab Reports</p>
            </div>
          </div>

          <div 
            onClick={() => setTab("bills")}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-650">
                <Receipt size={20} />
              </div>
              <span className="text-[10px] font-bold text-rose-650 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-150">
                Bills
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-850">
                ₹{bills.filter(b => b.status === "Unpaid").reduce((sum, b) => sum + b.amount, 0)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Outstanding Bills</p>
            </div>
          </div>
        </div>

        {/* ── Tab Layout Panel Workspace ── */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (70%) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Welcome Card & ABHA Health Identity */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center gap-5 justify-between">
                <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 text-white font-bold font-display text-xl flex items-center justify-center shadow-md">
                    SO
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-850">{profile.name}</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">UHID: {profile.uhid} · {profile.gender} · {profile.dob}</p>
                    <p className="text-xs text-slate-500 mt-1">Primary Care Doctor: <strong className="text-slate-800">{profile.primaryDoctor}</strong></p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-4 text-white shadow-sm space-y-2 text-xs w-full sm:w-auto min-w-[240px]">
                  <div className="flex justify-between items-center text-[9px] font-bold tracking-wider uppercase opacity-85">
                    <span>Ayushman Health Account</span>
                    <span className="bg-white/20 px-1.5 py-0.2 rounded">ABHA Card</span>
                  </div>
                  <div className="py-1">
                    <p className="text-sm font-bold font-display tracking-widest">{profile.aadhaar}</p>
                    <p className="text-[9px] opacity-75 mt-0.5">Coverage Status: {profile.insuranceStatus}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointment Card */}
              {appointments.filter(a => a.status === "Confirmed").slice(0, 1).map(apt => (
                <div key={apt.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Next Scheduled OPD Consult</h3>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-full">
                      {apt.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Doctor:</span>
                      <strong className="text-slate-800 font-bold block">{apt.doctor}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Department:</span>
                      <span className="text-slate-850 font-bold block">{apt.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Date & Time Slot:</span>
                      <span className="text-slate-850 font-bold block">{apt.date} · {apt.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">OPD Room & Token:</span>
                      <span className="text-slate-800 font-bold block">{apt.room} · <strong className="text-blue-600 font-bold">{apt.token}</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-50 justify-end">
                    <button 
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 text-[10px] font-bold transition-all"
                    >
                      Cancel Appointment
                    </button>
                    <button 
                      onClick={() => {
                        setRescheduleAptId(apt.id);
                        setNewAptDate(apt.date);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold transition-all"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => alert(`Room Location details for: ${apt.room}\nPlease report to the outpatient desk 15 minutes before your slot.`)}
                      className="btn-primary px-4 py-1.5 rounded-xl text-[10px] font-bold shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {/* Inline Reschedule Dialog */}
              {rescheduleAptId && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fade-in-up">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-850">Reschedule Consultation</span>
                    <button onClick={() => setRescheduleAptId(null)} className="text-slate-400"><X size={14} className="hidden" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">New Date</label>
                      <input 
                        type="date" 
                        value={newAptDate} 
                        onChange={e => setNewAptDate(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">New Time Slot</label>
                      <select 
                        value={newAptTime} 
                        onChange={e => setNewAptTime(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white"
                      >
                        <option>09:00 AM</option>
                        <option>09:45 AM</option>
                        <option>10:30 AM</option>
                        <option>11:15 AM</option>
                        <option>12:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setRescheduleAptId(null)} className="px-3 py-1 border rounded-lg text-[10px] font-semibold bg-white text-slate-500">Discard</button>
                    <button onClick={() => handleReschedule(rescheduleAptId)} className="px-4 py-1 rounded-lg text-[10px] font-bold bg-blue-600 text-white">Save Changes</button>
                  </div>
                </div>
              )}

              {/* Health Trends Visualizers (BP, Sugar, Weight, Visits) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Chart 1: Blood Pressure Trend */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-blue-500" />
                    Blood Pressure Trend (mmHg)
                  </h3>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bpTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[60, 160]} tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} name="Systolic" />
                        <Line type="monotone" dataKey="diastolic" stroke="#0d9488" strokeWidth={2} name="Diastolic" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Fasting Blood Sugar Trend */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                    <HeartPulse size={14} className="text-rose-500" />
                    Blood Sugar Trend (mg/dL)
                  </h3>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sugarTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[70, 180]} tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="fasting" stroke="#f59e0b" strokeWidth={2} name="Fasting" />
                        <Line type="monotone" dataKey="pp" stroke="#a855f7" strokeWidth={2} name="Post Prandial" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Body Weight Trend */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-emerald-500" />
                    Body Weight Trend (kg)
                  </h3>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weightTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[60, 80]} tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} name="Weight" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 4: Monthly Health Visits */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                    <Calendar size={14} className="text-indigo-500" />
                    Monthly Health Visits
                  </h3>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyVisitsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} name="Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Medical Records Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5 mb-3">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Clinical Consult Records</h3>
                  <button onClick={() => setTab("records")} className="text-[10px] text-blue-600 hover:underline font-bold">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-2">Visit Date</th>
                        <th className="pb-2">Department</th>
                        <th className="pb-2">Doctor</th>
                        <th className="pb-2">Diagnosis</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {medicalRecords.slice(0, 2).map(rec => (
                        <tr key={rec.id} className="hover:bg-slate-50/20">
                          <td className="py-2.5 font-semibold text-slate-700">{rec.date}</td>
                          <td className="py-2.5 text-slate-500">{rec.department}</td>
                          <td className="py-2.5 text-slate-550">{rec.doctor}</td>
                          <td className="py-2.5 font-bold text-slate-800 truncate max-w-[140px]">{rec.diagnosis}</td>
                          <td className="py-2.5 text-right space-x-1.5">
                            <button onClick={() => alert(`Diagnosis details:\n${rec.summary}`)} className="text-blue-600 hover:underline font-bold text-[10px]">View</button>
                            <button onClick={() => alert(`Downloading record PDF CHC-${rec.id}...`)} className="text-slate-500 hover:underline text-[10px]">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Prescriptions Card View */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5 mb-3">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Active Medication List</h3>
                  <button onClick={() => setTab("prescriptions")} className="text-[10px] text-blue-600 hover:underline font-bold">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {meds.filter(m => m.status === "Active").slice(0, 2).map(drug => (
                    <div key={drug.id} className="p-3 border border-slate-100 rounded-xl relative hover:bg-slate-50/30 transition-all">
                      <div className="flex justify-between items-start">
                        <strong className="text-slate-800 font-bold text-xs">{drug.name} ({drug.strength})</strong>
                        <span className="text-[8px] font-extrabold text-emerald-650 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                          {drug.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Dosage: {drug.dosage} · {drug.frequency}</p>
                      <p className="text-[10px] text-slate-400">Duration: {drug.duration} (Prescribed by {drug.doctor})</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (30%) */}
            <div className="space-y-6">
              
              {/* Emergency Contact Desk */}
              <div className="bg-red-50/10 border-2 border-red-100 rounded-2xl p-5 space-y-3.5 shadow-xs">
                <div className="flex justify-between items-center border-b border-red-50 pb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="text-red-650" size={16} />
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">Emergency Vitals Desk</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Group:</span>
                    <strong className="text-slate-800 font-bold">{profile.bloodGroup}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Known Allergies:</span>
                    <strong className="text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded font-extrabold">Penicillin</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Medical Conditions:</span>
                    <strong className="text-slate-750 font-bold">Hypertension (Mild)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Organ Donor Status:</span>
                    <strong className="text-slate-800 font-bold">Yes (Registered)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emergency Contact:</span>
                    <strong className="text-slate-800 font-bold text-right">{profile.emergencyContact.split(" - ")[0]}</strong>
                  </div>
                  <div className="border-t border-red-50 pt-2.5 mt-1 flex flex-col gap-1 text-[10px]">
                    <div className="flex items-center gap-1.5 text-red-750 font-bold">
                      <Phone size={11} />
                      Emergency Hotline: 108 / 102
                    </div>
                    <div className="text-slate-500">
                      Nearest CHC Center: CHC Bharno Campus
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-3.5 border-b border-slate-50 pb-1.5">
                  Patient Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                  <button
                    onClick={() => setTab("book")}
                    className="p-3 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <Plus className="text-blue-500" size={15} />
                    Book OPD
                  </button>
                  <button
                    onClick={() => setTab("labs")}
                    className="p-3 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <FileText className="text-teal-500" size={15} />
                    Download Report
                  </button>
                  <button
                    onClick={() => setTab("prescriptions")}
                    className="p-3 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <ClipboardList className="text-purple-500" size={15} />
                    View Prescription
                  </button>
                  <button
                    onClick={() => alert("Initiating Emergency Ambulance Locator Desk...")}
                    className="p-3 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/20 rounded-xl font-bold text-slate-750 transition-all flex flex-col items-center gap-1.5"
                  >
                    <AlertCircle className="text-rose-500" size={15} />
                    Emergency Help
                  </button>
                  <button
                    onClick={() => setTab("bills")}
                    className="p-3 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <Receipt className="text-emerald-500" size={15} />
                    Pay Bill
                  </button>
                  <button
                    onClick={() => setTab("profile")}
                    className="p-3 border border-slate-100 hover:border-slate-350 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-1.5"
                  >
                    <User className="text-slate-500" size={15} />
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Health Timeline Summary */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2 mb-3">
                  <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Health Journey Timeline</h3>
                  <button onClick={() => setTab("timeline")} className="text-[10px] text-blue-600 hover:underline font-bold">View Full</button>
                </div>

                <div className="relative border-l border-slate-150 pl-4 ml-1.5 space-y-4 text-xs">
                  {timeline.slice(0, 4).map((evt, idx) => (
                    <div key={idx} className="relative">
                      <span className={cn(
                        "absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border-2 border-white ring-2",
                        evt.type === "report" ? "ring-rose-100 bg-rose-500" :
                        evt.type === "sample" ? "ring-amber-100 bg-amber-500" :
                        evt.type === "dispensed" ? "ring-emerald-100 bg-emerald-500" : "ring-blue-100 bg-blue-500"
                      )} />
                      <div className="flex justify-between items-start">
                        <strong className="font-bold text-slate-850 block">{evt.title}</strong>
                        <span className="text-[8px] text-slate-400 font-semibold">{evt.date.split(" ")[0]} {evt.date.split(" ")[1]}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{evt.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Health Tips Card */}
              <div className="bg-teal-50/10 border border-teal-100 rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-teal-900 border-b border-teal-50 pb-1.5">
                  <HeartPulse className="text-teal-600" size={16} />
                  <strong className="text-xs font-bold uppercase tracking-wider">Today's Health Advisory</strong>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  High sodium intake increases fluid retention and raises blood pressure. Try adding herbs or fresh lemon juice to foods instead of extra table salt to maintain healthy metrics!
                </p>
                <div className="text-[9px] text-slate-400 mt-1">Recommended by: Wellness & Preventive Medicine Cell</div>
              </div>

            </div>

          </div>
        )}

        {/* ── Tab 2: Book Appointment Form ── */}
        {activeTab === "book" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs max-w-2xl mx-auto">
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h2 className="text-base font-bold text-slate-800">Request Doctor Consultation Slot</h2>
              <p className="text-xs text-slate-450 mt-0.5">Choose department, practitioner chamber, and preferred OPD timing.</p>
            </div>
            
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department Specialty</label>
                  <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-bold"
                  >
                    <option>General Medicine</option>
                    <option>Maternal & Child Health (MCH)</option>
                    <option>Dental Department</option>
                    <option>Eye Care Department</option>
                    <option>Nutrition Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Doctor Chamber</label>
                  <select
                    value={selectedDoctor}
                    onChange={e => setSelectedDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-bold"
                  >
                    <option>Dr. Priya Sharma (CMO)</option>
                    <option>Dr. Ramesh Gupta (Physician)</option>
                    <option>Dr. Rakesh Kumar (Gynaecologist)</option>
                    <option>Dr. Vijay Oraon (Dentist)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Preferred Time Slot</label>
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-bold"
                  >
                    <option>09:00 AM</option>
                    <option>09:45 AM</option>
                    <option>10:30 AM</option>
                    <option>11:15 AM</option>
                    <option>12:00 PM</option>
                    <option>01:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTab("dashboard")}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2 rounded-xl font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  Book OPD Appointment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Tab 3: Appointments List ── */}
        {activeTab === "appointments" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Scheduled Appointments</h2>
            </div>
            <div className="space-y-3">
              {appointments.map(apt => (
                <div key={apt.id} className="p-4 border border-slate-150 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-850">{apt.doctor}</span>
                      <span className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100 font-bold px-2 py-0.2 rounded uppercase">
                        {apt.department}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Date: {apt.date} · Time: {apt.time} · Token: {apt.token}</p>
                    <p className="text-[10px] text-slate-400">Location Room: {apt.room}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {apt.status === "Confirmed" && (
                      <>
                        <button 
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="px-2.5 py-1 border border-rose-100 text-rose-600 rounded-lg hover:bg-rose-50 text-[10px] font-bold"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            setRescheduleAptId(apt.id);
                            setNewAptDate(apt.date);
                            setTab("dashboard");
                          }}
                          className="px-2.5 py-1 border border-slate-250 text-slate-650 rounded-lg hover:bg-slate-50 text-[10px] font-bold"
                        >
                          Reschedule
                        </button>
                      </>
                    )}
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[9px] font-bold border",
                      apt.status === "Completed" ? "bg-slate-50 text-slate-500" :
                      apt.status === "Cancelled" ? "bg-rose-50 text-rose-600 border-rose-100" :
                      "bg-emerald-50 text-emerald-700 border-emerald-150"
                    )}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 4: My Medical Records ── */}
        {activeTab === "records" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Digital Medical Records</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Visit Date</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2">Consulting Doctor</th>
                    <th className="pb-2">Primary Diagnosis</th>
                    <th className="pb-2">Clinical Note</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/20">
                      <td className="py-3 font-semibold text-slate-700">{rec.date}</td>
                      <td className="py-3 text-slate-500">{rec.department}</td>
                      <td className="py-3 text-slate-650 font-medium">{rec.doctor}</td>
                      <td className="py-3 font-bold text-slate-850">{rec.diagnosis}</td>
                      <td className="py-3 text-slate-450 truncate max-w-[200px]" title={rec.summary}>{rec.summary}</td>
                      <td className="py-3 text-right space-x-2">
                        <button 
                          onClick={() => alert(`Clinical summary:\n${rec.summary}`)}
                          className="text-blue-600 hover:underline font-bold text-[10px]"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => alert(`Downloading record PDF CHC-${rec.id}...`)}
                          className="text-slate-500 hover:underline text-[10px]"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 5: Prescriptions ── */}
        {activeTab === "prescriptions" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Medications & Prescriptions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeds.map(drug => (
                <div key={drug.id} className="p-4 border border-slate-150 rounded-xl space-y-3 bg-white hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-850 text-xs">{drug.name}</h4>
                      <p className="text-[10px] text-slate-550 mt-0.5">Strength: {drug.strength}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border",
                      drug.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      drug.status === "Completed" ? "bg-slate-50 text-slate-450 border-slate-100" : "bg-rose-50 text-rose-700"
                    )}>
                      {drug.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-50 pt-2.5">
                    <p><strong>Dosage Instruction:</strong> {drug.dosage}</p>
                    <p><strong>Frequency Scheme:</strong> {drug.frequency}</p>
                    <p><strong>Treatment Duration:</strong> {drug.duration}</p>
                    <p><strong>Doctor:</strong> {drug.doctor}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-50 text-[10px] font-bold">
                    <button 
                      onClick={() => alert(`Dosage guidelines for ${drug.name}:\nTake after meals with water. Do not skip doses.`)}
                      className="px-2.5 py-1 text-slate-600 hover:underline hover:bg-slate-50 rounded"
                    >
                      Medicine Details
                    </button>
                    <button 
                      onClick={() => alert(`Printing prescription ticket for ${drug.name}...`)}
                      className="px-2.5 py-1 text-slate-600 hover:underline hover:bg-slate-50 rounded"
                    >
                      Print
                    </button>
                    <button 
                      onClick={() => alert(`Downloading Prescription file for ${drug.id}...`)}
                      className="text-blue-600 hover:underline px-2.5 py-1 hover:bg-blue-50 rounded"
                    >
                      Download Prescription
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 6: Laboratory Reports ── */}
        {activeTab === "labs" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pathology Lab Reports</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Test Name</th>
                    <th className="pb-2">Doctor</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Remarks</th>
                    <th className="pb-2 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/20">
                      <td className="py-3 font-semibold text-slate-700">{rep.testName}</td>
                      <td className="py-3 text-slate-500">{rep.doctor}</td>
                      <td className="py-3 text-slate-400">{rep.date}</td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black border",
                          getUrgencyCls(rep.urgency)
                        )}>
                          {rep.urgency} · {rep.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-450 truncate max-w-[200px]" title={rep.remarks}>{rep.remarks}</td>
                      <td className="py-3 text-right space-x-2">
                        {rep.status !== "Pending" ? (
                          <>
                            <button 
                              onClick={() => alert(`Report outcome for ${rep.testName}:\nResult: ${rep.result}`)}
                              className="text-blue-600 hover:underline font-bold text-[10px]"
                            >
                              View Report
                            </button>
                            <button 
                              onClick={() => alert(`Downloading lab report PDF for: ${rep.id}`)}
                              className="text-slate-500 hover:underline text-[10px]"
                            >
                              Download PDF
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">Processing sample...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 7: Vaccination History ── */}
        {activeTab === "vaccinations" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Immunization & Vaccination Records</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Vaccine Name</th>
                    <th className="pb-2">Administration Date</th>
                    <th className="pb-2">Dosage</th>
                    <th className="pb-2">Administered By</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {vaccinations.map((vac, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/20">
                      <td className="py-3 font-semibold text-slate-700">{vac.name}</td>
                      <td className="py-3 text-slate-500">{vac.date}</td>
                      <td className="py-3 text-slate-450">{vac.dosage}</td>
                      <td className="py-3 text-slate-450">{vac.administeredBy}</td>
                      <td className="py-3 text-right">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider",
                          vac.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                        )}>
                          {vac.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 8: Health Timeline ── */}
        {activeTab === "timeline" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 max-w-2xl mx-auto">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Full Health Journey Timeline</h2>
            </div>
            
            <div className="relative border-l border-slate-150 pl-5 ml-2.5 space-y-6 text-xs">
              {timeline.map((evt, idx) => (
                <div key={idx} className="relative">
                  <span className={cn(
                    "absolute -left-[26px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ring-2",
                    evt.type === "report" ? "ring-rose-100 bg-rose-500" :
                    evt.type === "sample" ? "ring-amber-100 bg-amber-500" :
                    evt.type === "dispensed" ? "ring-emerald-100 bg-emerald-500" : "ring-blue-100 bg-blue-500"
                  )} />
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">{evt.date}</span>
                  <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-3.5 shadow-sm">
                    <strong className="font-bold text-slate-800 block text-xs">{evt.title}</strong>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{evt.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 9: Bills & Payments ── */}
        {activeTab === "bills" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Bills, Invoices & Receipt Desk</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Invoice Number</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Total Amount</th>
                    <th className="pb-2">Settlement Method</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bills.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/20">
                      <td className="py-3 font-semibold text-slate-800">{b.invoiceNo}</td>
                      <td className="py-3 text-slate-500">{b.date}</td>
                      <td className="py-3 font-bold text-slate-700">₹{b.amount}</td>
                      <td className="py-3 text-slate-450">{b.paymentMethod}</td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider",
                          b.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          "bg-rose-50 text-rose-700 border-rose-100"
                        )}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        {b.status === "Unpaid" ? (
                          <button 
                            onClick={() => handlePayBill(b.invoiceNo)}
                            className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded hover:bg-blue-700"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button 
                            onClick={() => alert(`Downloading payment receipt for: ${b.invoiceNo}`)}
                            className="text-slate-500 hover:underline text-[10px]"
                          >
                            Download Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5 text-xs">
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150">
                <span className="text-slate-400 block font-semibold">Total Outstanding Due:</span>
                <strong className="text-rose-600 text-base font-bold">₹{bills.filter(b => b.status === "Unpaid").reduce((s, b) => s + b.amount, 0)}</strong>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150">
                <span className="text-slate-400 block font-semibold">Ayushman Covered Co-pay:</span>
                <strong className="text-teal-600 text-base font-bold">₹500 (Covered)</strong>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150">
                <span className="text-slate-400 block font-semibold">Total Paid to Date:</span>
                <strong className="text-slate-800 text-base font-bold">₹650</strong>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 10: Insurance / PM-JAY ── */}
        {activeTab === "insurance" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 max-w-2xl mx-auto">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Government Health Schemes & PM-JAY</h2>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-5 text-white shadow-sm space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-90">
                  <span>Ayushman Bharat Scheme</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded">PM-JAY Active</span>
                </div>
                <div>
                  <p className="text-slate-200 text-[10px]">Beneficiary Name</p>
                  <p className="text-sm font-bold font-display">{profile.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20">
                  <div>
                    <span className="text-white/70 block text-[9px]">Aadhaar Reference</span>
                    <strong className="text-xs">{profile.aadhaar}</strong>
                  </div>
                  <div>
                    <span className="text-white/70 block text-[9px]">Pre-auth Status</span>
                    <strong className="text-xs">Auto-Approved (Instant)</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-slate-150 rounded-xl space-y-2.5">
                <h3 className="font-bold text-slate-800">Ayushman Card Benefits Detail</h3>
                <ul className="space-y-2 text-slate-500 leading-normal">
                  <li className="flex justify-between"><span>Central Scheme:</span> <strong className="text-slate-750 font-bold">PM-JAY (Pradhan Mantri Jan Arogya Yojana)</strong></li>
                  <li className="flex justify-between"><span>Annual Coverage Limit:</span> <strong className="text-slate-750 font-bold">₹5,00,000 per family</strong></li>
                  <li className="flex justify-between"><span>Applicable Hospital:</span> <strong className="text-slate-750 font-bold">CHC Bharno (Empanelled Government Facility)</strong></li>
                  <li className="flex justify-between"><span>Eligibility Verification:</span> <strong className="text-emerald-600 font-bold">Verified via SECC Database</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 11: Notifications Alert Panel ── */}
        {activeTab === "notifications" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Patient Notifications</h2>
            </div>
            
            <div className="space-y-3">
              {notifications.map(notif => (
                <div key={notif.id} className="p-3 border border-slate-100 rounded-xl flex gap-3 items-start hover:bg-slate-50/20 transition-all">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0",
                    notif.read ? "bg-slate-350" : "bg-blue-600 animate-ping"
                  )} />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between items-start">
                      <strong className="font-bold text-slate-850">{notif.title}</strong>
                      <span className="text-[10px] text-slate-400 font-semibold">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-550 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 12: Profile Dashboard ── */}
        {activeTab === "profile" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs max-w-2xl mx-auto space-y-5">
            <div className="border-b border-slate-50 pb-2.5 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Patient Profile Registry</h2>
              {!isEditingProfile && (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-blue-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={editedPhone} 
                      onChange={e => setEditedPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Email ID</label>
                    <input 
                      type="email" 
                      value={editedEmail} 
                      onChange={e => setEditedEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Permanent Address</label>
                  <textarea 
                    value={editedAddress} 
                    onChange={e => setEditedAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold h-20" 
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Emergency contact Details</label>
                  <input 
                    type="text" 
                    value={editedEmergency} 
                    onChange={e => setEditedEmergency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold" 
                  />
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border rounded-xl text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white font-bold px-5 py-2 rounded-xl"
                  >
                    Save Vitals Update
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left py-3 border-b border-slate-50">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xl">
                    SO
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800">{profile.name}</h3>
                    <p className="text-slate-450 font-semibold mt-0.5">National UHID Ref: {profile.uhid}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 leading-normal text-slate-500">
                  <p><strong>Aadhaar Verification:</strong> <span className="text-slate-750 font-medium">XXXX-XXXX-{profile.aadhaar.split("-")[2]}</span></p>
                  <p><strong>Date of Birth:</strong> <span className="text-slate-750 font-medium">{profile.dob}</span></p>
                  <p><strong>Gender / Blood Group:</strong> <span className="text-slate-750 font-medium">{profile.gender} · {profile.bloodGroup}</span></p>
                  <p><strong>Phone Number:</strong> <span className="text-slate-750 font-medium">{profile.phone}</span></p>
                  <p><strong>Email Address:</strong> <span className="text-slate-750 font-medium">{profile.email}</span></p>
                  <p><strong>Emergency Liaison:</strong> <span className="text-slate-750 font-medium">{profile.emergencyContact}</span></p>
                  <p className="sm:col-span-2"><strong>Registered Address:</strong> <span className="text-slate-750 font-medium">{profile.address}</span></p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2 justify-end">
                  <button onClick={() => alert("Initiating password reset verification link...")} className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-650">Change Password</button>
                  <button onClick={() => alert("Printing Patient Health Identity QR Code Card...")} className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-650">Print ID Card</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 13: Settings Panel ── */}
        {activeTab === "settings" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs max-w-2xl mx-auto space-y-5">
            <div className="border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Patient Portal Settings</h2>
            </div>
            
            <div className="space-y-4 text-xs text-slate-550">
              <div className="p-4 border border-slate-150 rounded-xl space-y-3.5 bg-white">
                <h3 className="font-bold text-slate-850 border-b border-slate-50 pb-1 flex items-center gap-1.5">
                  <Sliders size={14} className="text-blue-500" />
                  Preferences Desk
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1">Display Language</label>
                    <select className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-slate-750 font-bold bg-white focus:outline-none">
                      <option>English</option>
                      <option>Hindi (हिन्दी)</option>
                      <option>Nagpuri</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Visual Theme</label>
                    <select className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-slate-750 font-bold bg-white focus:outline-none">
                      <option>Premium Light (System Default)</option>
                      <option>Sleek Dark</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-slate-150 rounded-xl space-y-3.5 bg-white">
                <h3 className="font-bold text-slate-850 border-b border-slate-50 pb-1 flex items-center gap-1.5">
                  <Bell size={14} className="text-teal-500" />
                  Alert Notification Settings
                </h3>
                
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Enable real-time SMS Alerts for critical lab values & reports</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Receive Email summary for consultation prescriptions & bills</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Appointment reminder push notifications 24 hours prior</span>
                  </label>
                </div>
              </div>

              <div className="p-4 border border-slate-150 rounded-xl space-y-3.5 bg-white">
                <h3 className="font-bold text-slate-850 border-b border-slate-50 pb-1 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-purple-500" />
                  Privacy & Data Consent
                </h3>
                
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Share digital EHR medical profile with empanelled PM-JAY doctors</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Enable accessibility reading pane tools (voice screen announcements)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PatientDashboard;
