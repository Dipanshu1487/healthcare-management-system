import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  User,
  Phone,
  Stethoscope,
  Clock,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { cn } from "../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  department: string;
  doctor: string;
  date: string;
  timeSlot: string;
  visitType: string;
  message: string;
}

// ─── Dummy Options ────────────────────────────────────────────────────────────
const departments = [
  "General Medicine",
  "Maternal & Child Health",
  "Emergency & Trauma",
  "Dental Care",
  "Eye Care (Ophthalmology)",
  "Nutrition & Dietetics",
  "Laboratory Services",
  "Mental Health",
];

const doctorsByDept: Record<string, string[]> = {
  "General Medicine": ["Dr. Priya Sharma (CMO)", "Dr. Ramesh Gupta", "Dr. Suresh Mahto"],
  "Maternal & Child Health": ["Dr. Rakesh Kumar (Sr. Gynaecologist)", "Dr. Kavita Devi"],
  "Emergency & Trauma": ["Dr. Anita Singh", "Any Available Doctor"],
  "Dental Care": ["Dr. Vijay Oraon", "Dr. Nisha Toppo"],
  "Eye Care (Ophthalmology)": ["Dr. Meena Kumari"],
  "Nutrition & Dietetics": ["Dt. Preeti Singh"],
  "Laboratory Services": ["Dr. Arvind Munda"],
  "Mental Health": ["Dr. Sanjay Pandey"],
};

const timeSlots = [
  "8:00 AM – 8:30 AM",
  "8:30 AM – 9:00 AM",
  "9:00 AM – 9:30 AM",
  "9:30 AM – 10:00 AM",
  "10:00 AM – 10:30 AM",
  "10:30 AM – 11:00 AM",
  "11:00 AM – 11:30 AM",
  "11:30 AM – 12:00 PM",
  "12:00 PM – 12:30 PM",
  "12:30 PM – 1:00 PM",
];

// ─── Step Indicator ───────────────────────────────────────────────────────────
interface StepProps { step: number; current: number; label: string }
const Step: React.FC<StepProps> = ({ step, current, label }) => {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
        done ? "bg-green-500 text-white" :
          active ? "text-white shadow-lg" : "bg-slate-100 text-slate-400"
      )}
        style={active ? { background: "linear-gradient(135deg, #2563eb, #0d9488)" } : undefined}
      >
        {done ? <CheckCircle size={18} /> : step}
      </div>
      <span className={cn(
        "text-xs font-medium hidden sm:block",
        active ? "text-blue-600" : done ? "text-green-600" : "text-slate-400"
      )}>
        {label}
      </span>
    </div>
  );
};

// ─── Info Cards ───────────────────────────────────────────────────────────────
const infoItems = [
  {
    icon: <Clock size={20} className="text-blue-600" />,
    title: "OPD Hours",
    lines: ["Monday – Saturday", "8:00 AM to 2:00 PM", "Emergency: 24/7"],
    bg: "bg-blue-50 border-blue-100",
  },
  {
    icon: <Stethoscope size={20} className="text-teal-600" />,
    title: "Bring Documents",
    lines: ["Aadhaar Card / ID Proof", "Ayushman/Ration Card (if any)", "Previous Prescriptions"],
    bg: "bg-teal-50 border-teal-100",
  },
  {
    icon: <AlertCircle size={20} className="text-amber-600" />,
    title: "Important Note",
    lines: ["OPD is free for all patients", "PM-JAY: free hospitalization", "Arrive 15 mins before slot"],
    bg: "bg-amber-50 border-amber-100",
  },
];

// ─── Appointment Page ─────────────────────────────────────────────────────────
const AppointmentPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [tokenNumber] = useState(`OPD-${String(Math.floor(Math.random() * 900) + 100)}`);

  const [form, setForm] = useState<FormData>({
    name: "", phone: "", email: "", age: "", gender: "",
    department: "", doctor: "", date: "", timeSlot: "",
    visitType: "OPD Consultation", message: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const availableDoctors =
    form.department && doctorsByDept[form.department]
      ? doctorsByDept[form.department]
      : ["Please select a department first"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  // ── Success State ──
  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Appointment Confirmed — CHC Bharno</title>
        </Helmet>
        <PageHeader
          title="Appointment Confirmed!"
          subtitle="Your OPD appointment has been successfully booked."
          breadcrumbs={[{ label: "Book Appointment" }]}
          badge="✅ Booking Confirmed"
        />
        <section className="section-pad bg-slate-50">
          <div className="page-container">
            <div className="max-w-lg mx-auto text-center">
              <div className="card-premium p-10">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">
                  Booking Successful!
                </h2>
                <div className="inline-block bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 my-4">
                  <div className="text-xs text-blue-400 mb-1 tracking-wide uppercase font-medium">Your Token Number</div>
                  <div className="text-3xl font-black text-blue-600 font-display">{tokenNumber}</div>
                </div>
                <div className="text-left space-y-2 bg-slate-50 rounded-2xl p-5 mb-6 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Patient:</span><span className="font-semibold text-slate-800">{form.name || "Patient"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Department:</span><span className="font-semibold text-slate-800">{form.department || "General Medicine"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Doctor:</span><span className="font-semibold text-slate-800">{form.doctor || "Doctor on Duty"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Date:</span><span className="font-semibold text-slate-800">{form.date || "Next available"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Slot:</span><span className="font-semibold text-slate-800">{form.timeSlot || "8:00–8:30 AM"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Type:</span><span className="font-semibold text-slate-800">{form.visitType}</span></div>
                </div>
                <p className="text-slate-500 text-sm mb-6">
                  Please arrive 15 minutes before your scheduled slot. Bring your Aadhaar card and any previous prescriptions.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setSubmitted(false); setStep(1); setForm({ name: "", phone: "", email: "", age: "", gender: "", department: "", doctor: "", date: "", timeSlot: "", visitType: "OPD Consultation", message: "" }); }}
                    className="btn-primary w-full justify-center"
                  >
                    <CalendarCheck size={16} />
                    Book Another Appointment
                  </button>
                  <Link to="/" className="btn-outline w-full justify-center">← Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book OPD Appointment — CHC Bharno | Free Healthcare Jharkhand</title>
        <meta name="description" content="Book a free OPD appointment at CHC Bharno, Gumla, Jharkhand. Government healthcare with expert doctors. Ayushman Bharat and PM-JAY accepted." />
      </Helmet>

      <PageHeader
        title="Book an Appointment"
        subtitle="Schedule your OPD visit at CHC Bharno. All consultations are free for eligible patients under government health schemes."
        breadcrumbs={[{ label: "Book Appointment" }]}
        badge="Free OPD · No Registration Fee"
      />

      <section className="section-pad bg-slate-50">
        <div className="page-container">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* ── Form Column ── */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <div className="card-premium mb-6 p-5">
                <div className="flex items-center justify-between relative">
                  {/* Progress line */}
                  <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-100 mx-8 z-0" />
                  <div
                    className="absolute left-8 top-4 h-0.5 z-0 transition-all duration-500"
                    style={{
                      background: "linear-gradient(90deg, #2563eb, #0d9488)",
                      width: `${((step - 1) / 2) * (100 - 0)}%`,
                      maxWidth: "calc(100% - 4rem)",
                    }}
                  />
                  {[
                    { s: 1, label: "Patient Info" },
                    { s: 2, label: "Appointment" },
                    { s: 3, label: "Confirm" },
                  ].map(({ s, label }) => (
                    <div key={s} className="relative z-10">
                      <Step step={s} current={step} label={label} />
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* ── Step 1: Patient Info ── */}
                {step === 1 && (
                  <div className="card-premium space-y-5 animate-fade-in-up">
                    <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                      <User size={20} className="text-blue-600" />
                      Patient Information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Full Name *</label>
                        <input required className={inputCls} placeholder="Enter full name"
                          value={form.name} onChange={e => update("name", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Mobile Number *</label>
                        <input required type="tel" className={inputCls} placeholder="+91 XXXXX XXXXX"
                          value={form.phone} onChange={e => update("phone", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Email (Optional)</label>
                        <input type="email" className={inputCls} placeholder="email@example.com"
                          value={form.email} onChange={e => update("email", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Age *</label>
                        <input required type="number" className={inputCls} placeholder="Age in years" min="0" max="120"
                          value={form.age} onChange={e => update("age", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Gender *</label>
                        <select required className={inputCls} value={form.gender} onChange={e => update("gender", e.target.value)}>
                          <option value="">Select gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Visit Type *</label>
                        <select required className={inputCls} value={form.visitType} onChange={e => update("visitType", e.target.value)}>
                          <option>OPD Consultation</option>
                          <option>Follow-up</option>
                          <option>Emergency</option>
                          <option>Vaccination</option>
                          <option>Lab Tests</option>
                          <option>Antenatal Checkup</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Reason / Symptoms (Optional)</label>
                      <textarea className={inputCls} rows={3} placeholder="Briefly describe your symptoms or reason for visit..."
                        value={form.message} onChange={e => update("message", e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" className="btn-primary"
                        onClick={() => { if (form.name && form.phone && form.age && form.gender) setStep(2); }}>
                        Next: Choose Appointment <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Appointment Details ── */}
                {step === 2 && (
                  <div className="card-premium space-y-5 animate-fade-in-up">
                    <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                      <CalendarCheck size={20} className="text-blue-600" />
                      Choose Appointment Slot
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Department *</label>
                        <select required className={inputCls} value={form.department}
                          onChange={e => { update("department", e.target.value); update("doctor", ""); }}>
                          <option value="">Select Department</option>
                          {departments.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Preferred Doctor *</label>
                        <select required className={inputCls} value={form.doctor} onChange={e => update("doctor", e.target.value)}>
                          <option value="">Select Doctor</option>
                          {availableDoctors.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Preferred Date *</label>
                        <input required type="date" className={inputCls}
                          min={new Date().toISOString().split("T")[0]}
                          value={form.date} onChange={e => update("date", e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Time Slot *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {timeSlots.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => update("timeSlot", slot)}
                              className={cn(
                                "py-2.5 px-2 rounded-xl text-xs font-medium border transition-all duration-200",
                                form.timeSlot === slot
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                              )}
                            >
                              {slot.replace(" – ", "\n")}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button type="button" className="btn-outline" onClick={() => setStep(1)}>
                        ← Back
                      </button>
                      <button type="button" className="btn-primary"
                        onClick={() => { if (form.department && form.doctor && form.date && form.timeSlot) setStep(3); }}>
                        Review & Confirm <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Confirm ── */}
                {step === 3 && (
                  <div className="card-premium space-y-5 animate-fade-in-up">
                    <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                      <FileText size={20} className="text-blue-600" />
                      Review & Confirm
                    </h2>

                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 p-6 space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">Appointment Summary</h3>
                      {[
                        ["Patient Name", form.name],
                        ["Mobile", form.phone],
                        ["Age / Gender", `${form.age} yrs / ${form.gender}`],
                        ["Visit Type", form.visitType],
                        ["Department", form.department],
                        ["Doctor", form.doctor],
                        ["Date", new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
                        ["Time Slot", form.timeSlot],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-start justify-between gap-4 text-sm border-b border-blue-100 pb-2 last:border-0 last:pb-0">
                          <span className="text-slate-500 flex-shrink-0">{k}</span>
                          <span className="font-semibold text-slate-800 text-right">{v}</span>
                        </div>
                      ))}
                      {form.message && (
                        <div className="pt-2 text-sm">
                          <span className="text-slate-500 block mb-1">Symptoms / Notes</span>
                          <span className="text-slate-700 italic">"{form.message}"</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl text-sm text-green-700">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      OPD consultation is completely <strong className="mx-1">free</strong> at CHC Bharno. Eligible patients get medicines free under government schemes.
                    </div>

                    <div className="flex justify-between">
                      <button type="button" className="btn-outline" onClick={() => setStep(2)}>← Back</button>
                      <button type="submit" className="btn-teal">
                        <CheckCircle size={16} />
                        Confirm Appointment
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* ── Info Sidebar ── */}
            <div className="space-y-4">
              {infoItems.map((item, i) => (
                <div key={i} className={`card-premium border ${item.bg} p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">{item.title}</h3>
                  </div>
                  <ul className="space-y-1">
                    {item.lines.map((l, j) => (
                      <li key={j} className="text-sm text-slate-600 flex items-center gap-2">
                        <ChevronRight size={12} className="text-teal-400 flex-shrink-0" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Emergency box */}
              <div className="rounded-2xl p-5 text-white"
                style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
                <div className="text-lg font-bold font-display mb-1">Emergency?</div>
                <div className="text-red-100 text-sm mb-3">Do not wait — call immediately</div>
                <a href="tel:108" className="flex items-center gap-2 text-2xl font-black">
                  <Phone size={20} />
                  108
                </a>
                <div className="text-xs text-red-200 mt-1">Ambulance · 24/7 Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppointmentPage;
