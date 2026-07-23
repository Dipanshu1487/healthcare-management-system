import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Users, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  Stethoscope,
  FileText,
  ClipboardList,
  FlaskConical,
  Plus,
  Trash2,
  FolderOpen,
  ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useHospital } from "../../context/useHospital";
import { HospitalCalendar } from "../../components/dashboard/HospitalCalendar";
import type { CalendarEvent } from "../../components/dashboard/HospitalCalendar";
import { createAuditLog, generateId, getCurrentTimeFormatted } from "../../context/helpers";
import type { PrescriptionOrder, LabOrder, MedicalRecordItem } from "../../context/types";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface Patient {
  token: string;
  name: string;
  age: number;
  gender: string;
  visitType: string;
  symptoms: string;
  history: string;
  allergies: string;
  insurance: string; // e.g. PM-JAY Ayushman
}

interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface ConsultResult {
  token: string;
  name: string;
  diagnosis: string;
  time: string;
}

// ─── Initial Dummy Data ───────────────────────────────────────────────────────
const initialQueue: Patient[] = [
  { token: "OPD-210", name: "Suresh Oraon", age: 42, gender: "Male", visitType: "OPD Consultation", symptoms: "High fever for 3 days, chills, body ache, joint pain.", history: "Known hypertensive since 3 years, on regular meds.", allergies: "Sulfa Drugs", insurance: "PM-JAY (Ayushman Bharat)" },
  { token: "OPD-211", name: "Anjali Devi", age: 28, gender: "Female", visitType: "Antenatal Care (ANC)", symptoms: "Routine 2nd-trimester checkup, mild nausea, fatigue.", history: "First pregnancy, gestational week 24. No prior medical complications.", allergies: "None", insurance: "PM-JAY (Ayushman Bharat)" },
  { token: "OPD-212", name: "Bipin Kujur", age: 50, gender: "Male", visitType: "OPD Consultation", symptoms: "Blurry vision in right eye, headache, dizziness.", history: "Type 2 Diabetes diagnosed in 2021. Poor glycemic control.", allergies: "Penicillin", insurance: "Ration Card MSBY" },
  { token: "OPD-214", name: "Ramesh Mahto", age: 35, gender: "Male", visitType: "OPD Consultation", symptoms: "Persistent dry cough, mild shortness of breath, low-grade fever.", history: "Smoker (10 years). Dust allergy.", allergies: "None", insurance: "General / Cash" },
];

const completedConsultsList: ConsultResult[] = [
  { token: "OPD-201", name: "Munni Kumari", diagnosis: "Acute Bronchitis", time: "08:45 AM" },
  { token: "OPD-203", name: "Kundan Gope", diagnosis: "Amoebiasis / Gastroenteritis", time: "09:15 AM" },
  { token: "OPD-205", name: "Sunita Ekka", diagnosis: "Gestational Anemia", time: "09:40 AM" },
];

const availableDrugs = [
  "Paracetamol 650mg",
  "Amoxicillin 500mg",
  "Metformin 500mg",
  "Pantoprazole 40mg",
  "Cetirizine 10mg",
  "Azithromycin 500mg",
  "Iron & Folic Acid Tablet",
  "Amlodipine 5mg",
  "Oral Rehydration Salts (ORS)",
];

const laboratoryTests = [
  "Complete Blood Count (CBC)",
  "Widal Test (Typhoid)",
  "Malaria Antigen (RDT)",
  "Random Blood Sugar (RBS)",
  "Urine Routine & Microscopy",
  "Chest X-Ray (Radiology)",
  "Sputum for AFB (TB Test)",
];

// ─── Doctor Dashboard Component ──────────────────────────────────────────────
const DoctorDashboard: React.FC = () => {
  const { state, dispatch } = useHospital();
  const [activeTab, setActiveTab] = useState<"workspace" | "schedule" | "completed">("workspace");

  const calendarEvents: CalendarEvent[] = (state.appointments || []).map((a: any) => {
    try {
      const dateStr = a.date || new Date().toISOString().slice(0, 10);
      const timeStr = a.timeSlot || "09:00 AM";
      const [year, month, day] = dateStr.split("-").map(Number);
      const [timeVal, modifier] = timeStr.split(" ");
      let [hours, minutes] = timeVal.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 15 * 60 * 1000);
      
      return {
        id: a.id || String(Math.random()),
        title: `${a.token || "OPD"} - ${a.name}`,
        subtitle: a.symptoms || "Consultation",
        start,
        end,
        type: "appointment" as const,
        status: a.status === "Waiting" ? "Checked In" : a.status
      };
    } catch (e) {
      return {
        id: a.id || String(Math.random()),
        title: a.name || "Appointment",
        start: new Date(),
        end: new Date(Date.now() + 15 * 60 * 1000),
        type: "appointment" as const
      };
    }
  });

  const contextWaitingQueue: Patient[] = state.appointments
    .filter((a) => a.status === "Waiting")
    .map((a) => ({
      token: a.token || "T-NEW",
      name: a.name,
      age: Number(a.age) || 35,
      gender: a.gender || "Not specified",
      visitType: a.department || "General OPD",
      symptoms: a.symptoms || "General OPD Checkup",
      history: "See patient medical record for previous history.",
      allergies: "None recorded",
      insurance: "PM-JAY (Ayushman Bharat)",
    }));
  const queue = contextWaitingQueue.length > 0 ? contextWaitingQueue : initialQueue;
  const completedConsults = [
    ...state.completedConsults.map((c) => ({
      token: c.token,
      name: c.name,
      diagnosis: c.diagnosis,
      time: c.time,
    })),
    ...completedConsultsList,
  ];

  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  // Consultation Form States
  const [symptomsInput, setSymptomsInput] = useState("");
  const [findingsInput, setFindingsInput] = useState("");
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [followUpDays, setFollowUpDays] = useState("7 Days");
  
  // Prescription Desk States
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [selectedDrug, setSelectedDrug] = useState("");
  const [dosageText, setDosageText] = useState("1 tab");
  const [frequencySelect, setFrequencySelect] = useState("Once Daily (OD)");
  const [durationText, setDurationText] = useState("5 Days");

  // Lab Orders State
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);

  // Feedback Notification
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Stats
  const consultedCount = completedConsults.length;
  const queueCount = queue.length;

  // Actions
  const handleSelectPatient = (patient: Patient) => {
    setActivePatient(patient);
    setSymptomsInput(patient.symptoms);
    setFindingsInput("");
    setDiagnosisInput("");
    setPrescriptions([]);
    setSelectedLabs([]);
    setSuccessToast(null);
  };

  const handleAddMedicine = () => {
    if (!selectedDrug) return;

    const newItem: PrescriptionItem = {
      id: Math.random().toString(),
      drugName: selectedDrug,
      dosage: dosageText,
      frequency: frequencySelect,
      duration: durationText,
    };

    setPrescriptions(prev => [...prev, newItem]);
    setSelectedDrug("");
  };

  const handleRemoveMedicine = (id: string) => {
    setPrescriptions(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleLab = (labName: string) => {
    setSelectedLabs(prev => 
      prev.includes(labName) ? prev.filter(l => l !== labName) : [...prev, labName]
    );
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !diagnosisInput.trim()) return;

    const newPrescription: PrescriptionOrder | undefined =
      prescriptions.length > 0
        ? {
            id: generateId("RX"),
            patientId: "PAT-LIVE",
            uhid: "JHR-2026-LIVE",
            name: activePatient.name,
            age: activePatient.age,
            gender: activePatient.gender,
            doctor: "Dr. Priya Sharma",
            department: "General Medicine",
            date: getCurrentTimeFormatted(),
            priority: "Normal",
            status: "Pending",
            diagnosis: diagnosisInput,
            allergies: activePatient.allergies,
            weight: "65 kg",
            bloodGroup: "O+",
            drugs: prescriptions.map((p) => ({
              drugName: p.drugName,
              dosage: p.dosage,
              frequency: p.frequency,
              duration: p.duration,
              qtyNeeded: 10,
            })),
          }
        : undefined;

    const newLabOrder: LabOrder | undefined =
      selectedLabs.length > 0
        ? {
            id: generateId("LAB"),
            sampleId: generateId("SMP"),
            patientId: "PAT-LIVE",
            uhid: "JHR-2026-LIVE",
            name: activePatient.name,
            testName: selectedLabs.join(", "),
            doctor: "Dr. Priya Sharma",
            collectionTime: getCurrentTimeFormatted(),
            priority: "Normal",
            status: "Pending Collection",
            sampleType: "Blood / Serum",
          }
        : undefined;

    const medicalRecord: MedicalRecordItem = {
      id: generateId("REC"),
      patientId: "PAT-001",
      date: new Date().toISOString().split("T")[0],
      type: "OPD Consultation",
      doctor: "Dr. Priya Sharma",
      department: "General Medicine",
      diagnosis: diagnosisInput,
      summary: `${activePatient.symptoms}. Findings: ${findingsInput || "Normal physical exam"}. Prescribed ${prescriptions.length} meds.`,
      status: "Active",
    };

    dispatch({
      type: "COMPLETE_CONSULTATION",
      payload: {
        consult: {
          id: generateId("CNS"),
          token: activePatient.token,
          name: activePatient.name,
          uhid: "JHR-2026-LIVE",
          diagnosis: diagnosisInput,
          time: getCurrentTimeFormatted(),
          doctor: "Dr. Priya Sharma",
          department: "General Medicine",
        },
        prescription: newPrescription,
        labOrder: newLabOrder,
        medicalRecord,
        audit: createAuditLog(
          "doctor",
          "Dr. Priya Sharma",
          "CONSULTATION_COMPLETED",
          "Prescription",
          activePatient.token,
          `Completed consultation for ${activePatient.name}: ${diagnosisInput}`
        ),
      },
    });

    setSuccessToast(`Consultation completed for ${activePatient.name} (${activePatient.token}). Prescriptions dispatched to Pharmacy.`);
    setActivePatient(null);

    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <>
      <Helmet>
        <title>Doctor Portal — CHC Bharno HMS</title>
      </Helmet>

      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800">EHR Consultation Workstation</h1>
            <p className="text-slate-500 text-xs mt-0.5">Diagnose patients, write e-prescriptions, and order pathology tests.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm">
            <Stethoscope size={14} className="text-teal-600" />
            <span>On Duty: General Medicine OPD</span>
          </div>
        </div>

        {/* ── Stats Summary Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display text-slate-800">{consultedCount}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Patients Consulted Today</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display text-slate-800">{queueCount}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Awaiting Consultation</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <FlaskConical size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display text-slate-800">12</h3>
              <p className="text-xs text-slate-500 mt-0.5">Lab Tests Dispatched Today</p>
            </div>
          </div>
        </div>

        {/* Success Alert Toast Banner */}
        {successToast && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 animate-fade-in-up">
            <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-xs">
              <p className="font-bold text-sm">Consultation Dispatched Successfully</p>
              <p className="mt-1">{successToast}</p>
            </div>
          </div>
        )}

        {/* ── Main Workspace Tabs ── */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("workspace")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === "workspace" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Clinical Workspace
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === "completed" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Recent Cases ({completedConsults.length})
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === "schedule" ? "bg-slate-100 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Duty Roster & Timing
          </button>
        </div>

        {/* ── TAB: CLINICAL WORKSPACE ── */}
        {activeTab === "workspace" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Queue Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-400">My Queue today</h2>
              <div className="space-y-2">
                {queue.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <CheckCircle2 className="mx-auto mb-2 text-emerald-500 opacity-60" size={24} />
                    <span>Lobby queue cleared! No pending patients.</span>
                  </div>
                ) : (
                  queue.map(p => (
                    <button
                      key={p.token}
                      onClick={() => handleSelectPatient(p)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 relative overflow-hidden group",
                        activePatient?.token === p.token 
                          ? "border-blue-500 bg-blue-50/40 shadow-sm" 
                          : "border-slate-100 hover:border-blue-300 hover:bg-slate-50/50"
                      )}
                    >
                      {activePatient?.token === p.token && (
                        <span className="absolute top-0 bottom-0 left-0 w-1 bg-blue-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{p.name}</span>
                          <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 font-bold px-1.5 py-0.2 rounded-md uppercase">
                            {p.token}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{p.age} yrs · {p.gender} · {p.visitType}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[180px] mt-1.5 italic">"{p.symptoms}"</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors mt-0.5" />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Clinical Form Station */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2 min-h-[500px]">
              {!activePatient ? (
                <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                    <FolderOpen size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 text-sm">No Active Patient Session</h3>
                    <p className="text-slate-400 mt-0.5">Please select a patient card from the queue panel to begin diagnosis.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitConsultation} className="space-y-6 animate-fade-in-up">
                  
                  {/* Patient Profile Header Strip */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 uppercase font-bold">Active Patient File</span>
                        <span className="text-xs text-blue-700 font-bold bg-blue-100/50 px-2 py-0.2 rounded">{activePatient.token}</span>
                      </div>
                      <h2 className="text-lg font-bold font-display text-slate-800 mt-1">{activePatient.name}</h2>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {activePatient.age} yrs · {activePatient.gender} · {activePatient.visitType}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Coverage: {activePatient.insurance}
                      </span>
                      <div className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-1.5 flex items-center gap-1 font-semibold">
                        <AlertCircle size={10} />
                        Allergies: {activePatient.allergies}
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis & Findings notes */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                      <FileText size={14} className="text-slate-400" />
                      Clinical Assessment
                    </h3>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Symptoms / Chief Complaints (Auto-imported)</label>
                      <textarea
                        rows={2}
                        value={symptomsInput}
                        onChange={e => setSymptomsInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Clinical Findings / Observations</label>
                        <textarea
                          placeholder="e.g. BP 120/80, Pulse 72, Chest clear..."
                          rows={2}
                          value={findingsInput}
                          onChange={e => setFindingsInput(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Primary Diagnosis *</label>
                        <textarea
                          required
                          placeholder="e.g. Suspected Viral Fever / Gastroenteritis"
                          rows={2}
                          value={diagnosisInput}
                          onChange={e => setDiagnosisInput(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* E-Prescription module */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                      <ClipboardList size={14} className="text-slate-400" />
                      E-Prescription Desk
                    </h3>

                    {/* Prescribe inputs */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Select Medicine</label>
                        <select
                          value={selectedDrug}
                          onChange={e => setSelectedDrug(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                          <option value="">Choose drug...</option>
                          {availableDrugs.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Dosage</label>
                        <input
                          type="text"
                          value={dosageText}
                          onChange={e => setDosageText(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Frequency</label>
                        <select
                          value={frequencySelect}
                          onChange={e => setFrequencySelect(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                          <option>Once Daily (OD)</option>
                          <option>Twice Daily (BD)</option>
                          <option>Thrice Daily (TD)</option>
                          <option>Four Times (QD)</option>
                          <option>As Needed (SOS)</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Duration</label>
                          <input
                            type="text"
                            value={durationText}
                            onChange={e => setDurationText(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddMedicine}
                          disabled={!selectedDrug}
                          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Prescribed List Table */}
                    {prescriptions.length > 0 && (
                      <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm bg-white">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 border-b border-slate-150">
                              <th className="p-3 font-semibold">Medicine</th>
                              <th className="p-3 font-semibold">Dosage</th>
                              <th className="p-3 font-semibold">Frequency</th>
                              <th className="p-3 font-semibold">Duration</th>
                              <th className="p-3 font-semibold text-right">Remove</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {prescriptions.map(item => (
                              <tr key={item.id} className="hover:bg-slate-50/20">
                                <td className="p-3 font-bold text-slate-700">{item.drugName}</td>
                                <td className="p-3 text-slate-600">{item.dosage}</td>
                                <td className="p-3 text-slate-600">{item.frequency}</td>
                                <td className="p-3 text-slate-600">{item.duration}</td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMedicine(item.id)}
                                    className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Laboratory Requests */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                      <FlaskConical size={14} className="text-slate-400" />
                      Laboratory Diagnostics & Radiology
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {laboratoryTests.map(test => {
                        const isSelected = selectedLabs.includes(test);
                        return (
                          <button
                            key={test}
                            type="button"
                            onClick={() => handleToggleLab(test)}
                            className={cn(
                              "px-3.5 py-2.5 rounded-xl text-left border text-xs font-semibold transition-all duration-200",
                              isSelected 
                                ? "bg-purple-50 border-purple-400 text-purple-700 shadow-sm" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50/30"
                            )}
                          >
                            {test}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Follow Up & Submit */}
                  <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-500">Recommended Follow-up:</label>
                      <select
                        value={followUpDays}
                        onChange={e => setFollowUpDays(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-700"
                      >
                        <option>No follow-up needed</option>
                        <option>3 Days</option>
                        <option>5 Days</option>
                        <option>7 Days</option>
                        <option>10 Days</option>
                        <option>2 Weeks</option>
                        <option>1 Month</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActivePatient(null)}
                        className="btn-outline px-5 py-2 rounded-xl text-xs font-bold text-slate-600 border-slate-200"
                      >
                        Suspend File
                      </button>
                      <button
                        type="submit"
                        className="btn-teal px-6 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={14} />
                        Discharge & Dispatch Consult
                      </button>
                    </div>
                  </div>

                </form>
              )}
            </div>

          </div>
        )}

        {/* ── TAB: RECENT CASES LIST ── */}
        {activeTab === "completed" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-fade-in-up">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Completed Consultations (Today's Shift)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400">
                    <th className="pb-3 font-semibold">Patient Token</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Clinical Diagnosis</th>
                    <th className="pb-3 font-semibold">Time Logged</th>
                    <th className="pb-3 font-semibold text-right">EHR Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedConsults.map((consult, i) => (
                    <tr key={i} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800">{consult.token}</td>
                      <td className="py-3.5 text-slate-700 font-bold">{consult.name}</td>
                      <td className="py-3.5 font-semibold text-slate-600">{consult.diagnosis}</td>
                      <td className="py-3.5 text-slate-400">{consult.time}</td>
                      <td className="py-3.5 text-right">
                        <button className="text-blue-600 hover:underline font-bold flex items-center gap-0.5 ml-auto">
                          View details <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: DOCTOR ROSTER Timings ── */}
        {activeTab === "schedule" && (
          <div className="space-y-6 animate-fade-in-up">
            <HospitalCalendar events={calendarEvents} role="doctor" />
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 mb-4">Weekly Roster & OPD Timing slots</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock size={14} className="text-teal-600" />
                  Morning Session
                </h3>
                <ul className="text-xs text-slate-500 mt-3 space-y-1.5 leading-relaxed">
                  <li>Monday to Saturday: <strong className="text-slate-700">08:00 AM – 11:30 AM</strong></li>
                  <li>Average patients/session: <strong className="text-slate-700">18–22 seen</strong></li>
                  <li>OPD Duty Chamber: <strong className="text-slate-700">Room #3</strong></li>
                </ul>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-600" />
                  Afternoon Rounds
                </h3>
                <ul className="text-xs text-slate-500 mt-3 space-y-1.5 leading-relaxed">
                  <li>Monday, Wednesday, Friday: <strong className="text-slate-700">12:00 PM – 02:00 PM</strong></li>
                  <li>IPD In-ward checkup: <strong className="text-slate-700">Male & Female Ward</strong></li>
                  <li>Average ward capacity: <strong className="text-slate-700">14 active beds</strong></li>
                </ul>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-rose-600" />
                  Emergency Calls
                </h3>
                <ul className="text-xs text-slate-500 mt-3 space-y-1.5 leading-relaxed">
                  <li>Weekly Rotation: <strong className="text-slate-700">Every Thursday Night (24hrs)</strong></li>
                  <li>Triage casualty lead: <strong className="text-slate-700">On Call Duty</strong></li>
                  <li>Helpline access: <strong className="text-slate-700">Desk ext. 104</strong></li>
                </ul>
              </div>

            </div>
          </div>
          </div>
        )}

      </div>
    </>
  );
};

export default DoctorDashboard;
