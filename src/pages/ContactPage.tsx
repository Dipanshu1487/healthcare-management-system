import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Navigation,
  Share2,
  MessageCircle,
  Video,
  Camera,
  Building2,
  CalendarDays,
  Truck,
  Info,
  User,
  MessageSquare,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { cn } from "../lib/utils";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  department: string;
  message: string;
}

interface OpdScheduleRow {
  department: string;
  days: string;
  timing: string;
  doctor: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SocialLink {
  platform: string;
  handle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const opdSchedule: OpdScheduleRow[] = [
  { department: "General Medicine / OPD", days: "Mon – Sat", timing: "8:00 AM – 2:00 PM", doctor: "Dr. R.K. Sharma" },
  { department: "Maternity & Gynaecology", days: "Mon – Sat", timing: "8:00 AM – 2:00 PM", doctor: "Dr. Sunita Kumari" },
  { department: "Paediatrics (Child Health)", days: "Mon, Wed, Fri", timing: "9:00 AM – 12:00 PM", doctor: "Dr. Anil Oraon" },
  { department: "Dental & Oral Health", days: "Tue, Thu, Sat", timing: "9:00 AM – 1:00 PM", doctor: "Dr. Priya Singh" },
  { department: "Eye (Ophthalmology)", days: "Mon, Wed", timing: "9:00 AM – 12:00 PM", doctor: "Visiting Specialist" },
  { department: "Orthopaedics", days: "Tue, Thu", timing: "10:00 AM – 1:00 PM", doctor: "Visiting Specialist" },
  { department: "Laboratory Services", days: "Mon – Sat", timing: "7:00 AM – 2:00 PM", doctor: "Lab Technicians" },
  { department: "Pharmacy (Free Medicines)", days: "Mon – Sat", timing: "8:00 AM – 4:00 PM", doctor: "Pharmacist on duty" },
  { department: "Emergency / Casualty", days: "All Days", timing: "24 Hours / 7 Days", doctor: "Duty Doctor + Nursing Staff" },
];

const faqs: FaqItem[] = [
  {
    question: "What are the OPD timings at CHC Bharno?",
    answer:
      "The OPD at CHC Bharno operates Monday to Saturday from 8:00 AM to 2:00 PM. Emergency services are available 24 hours a day, 7 days a week including Sundays and public holidays.",
  },
  {
    question: "Am I eligible for free treatment under PM-JAY / Ayushman Bharat?",
    answer:
      "All patients holding a valid Ayushman Bharat (PM-JAY) card or a Jharkhand Mukhyamantri Swasthya Bima Yojana (JMMSBY) card are eligible for free treatment. BPL cardholders and families listed under SECC-2011 data are automatically eligible. Please bring your Aadhaar card and relevant documents to the OPD counter.",
  },
  {
    question: "What should I do in a medical emergency?",
    answer:
      "In case of a medical emergency, call 108 immediately for a free ambulance service. The CHC Bharno emergency/casualty ward is open 24/7. Do not wait — arrive directly at the Emergency entrance. Duty doctors and nursing staff are always present.",
  },
  {
    question: "How can I book an OPD appointment at CHC Bharno?",
    answer:
      "You can book an OPD appointment by visiting the registration counter at CHC Bharno between 7:30 AM – 2:00 PM on working days, or by calling our helpline at 104 (NHM toll-free). Online appointment booking is also available through this website's 'Book Appointment' page. Walk-in patients are also accepted.",
  },
  {
    question: "Does CHC Bharno provide free medicines?",
    answer:
      "Yes. CHC Bharno provides free essential medicines under the Jan Aushadhi Yojana and NHM free drug distribution program. Prescribed medicines from the OPD are dispensed free of cost from our pharmacy counter. The pharmacy operates Monday to Saturday from 8:00 AM to 4:00 PM.",
  },
];

const socialLinks: SocialLink[] = [
  {
    platform: "Share",
    handle: "Share CHC Bharno",
    icon: <Share2 size={20} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    platform: "WhatsApp",
    handle: "+91 94310-XXXXX",
    icon: <MessageCircle size={20} />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    platform: "Video Updates",
    handle: "@chcbharno",
    icon: <Video size={20} />,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    platform: "Photo Updates",
    handle: "@chc_bharno",
    icon: <Camera size={20} />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const DEPARTMENTS = [
  "Select Department",
  "General Medicine / OPD",
  "Maternity & Gynaecology",
  "Paediatrics (Child Health)",
  "Dental & Oral Health",
  "Eye (Ophthalmology)",
  "Orthopaedics",
  "Laboratory Services",
  "Pharmacy",
  "Emergency",
  "Health Camps",
  "Other / General Enquiry",
];

// ─── useIntersection ──────────────────────────────────────────────────────────
function useIntersection(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Emergency Banner ─────────────────────────────────────────────────────────
const EmergencyBanner: React.FC = () => (
  <section className="py-5 bg-red-600">
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 flex-wrap text-center sm:text-left">
        <div className="flex items-center gap-2 text-white">
          <Truck size={18} className="flex-shrink-0" />
          <span className="font-semibold text-sm">Emergency Ambulance:</span>
          <a href="tel:108" className="text-white font-bold text-lg tracking-wider hover:underline">108</a>
          <span className="text-red-200 text-xs">(Free • 24/7)</span>
        </div>
        <div className="w-px h-5 bg-red-400 hidden sm:block" />
        <div className="flex items-center gap-2 text-white">
          <Phone size={16} className="flex-shrink-0" />
          <span className="font-semibold text-sm">OPD Helpline:</span>
          <a href="tel:+919431000000" className="text-white font-bold hover:underline">+91 94310-XXXXX</a>
        </div>
        <div className="w-px h-5 bg-red-400 hidden sm:block" />
        <div className="flex items-center gap-2 text-white">
          <Info size={16} className="flex-shrink-0" />
          <span className="font-semibold text-sm">NHM Helpline:</span>
          <a href="tel:104" className="text-white font-bold text-lg tracking-wider hover:underline">104</a>
          <span className="text-red-200 text-xs">(Toll-free)</span>
        </div>
      </div>
    </div>
  </section>
);

// ─── Contact Form ─────────────────────────────────────────────────────────────
const ContactForm: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    department: "Select Department",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validate = () => {
    const newErrors: Partial<ContactFormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s\-+]/g, "")))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (form.department === "Select Department")
      newErrors.department = "Please select a department";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold font-display text-slate-900">Message Sent!</h3>
        <p className="text-slate-500 max-w-xs text-sm">
          Thank you for contacting CHC Bharno. Our team will get back to you within 1–2 working days.
        </p>
        <button
          className="btn-outline mt-2"
          onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", department: "Select Department", message: "" }); }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const inputClass = (field: keyof ContactFormData) => cn(
    "w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 bg-white outline-none",
    errors[field]
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Ramesh Kumar"
            className={cn(inputClass("name"), "pl-9")}
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Phone + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={cn(inputClass("phone"), "pl-9")}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={cn(inputClass("email"), "pl-9")}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Department / Enquiry Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className={cn(inputClass("department"), "pl-9 appearance-none cursor-pointer")}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} disabled={d === "Select Department"}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your enquiry, concern, or feedback..."
            className={cn(inputClass("message"), "pl-9 resize-none")}
          />
        </div>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Send size={15} />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Your information is kept confidential and is used only to respond to your enquiry.
      </p>
    </form>
  );
};

// ─── Contact Info Card ────────────────────────────────────────────────────────
const ContactInfoCards: React.FC = () => {
  const cards = [
    {
      icon: <MapPin size={18} className="text-blue-600" />,
      bg: "bg-blue-50",
      label: "Address",
      content: (
        <p className="text-sm text-slate-600 leading-relaxed">
          CHC Bharno, Near Bharno Bus Stand,<br />
          NH-75, Bharno Block,<br />
          Gumla District, Jharkhand – 835209
        </p>
      ),
    },
    {
      icon: <Phone size={18} className="text-teal-600" />,
      bg: "bg-teal-50",
      label: "Phone Numbers",
      content: (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-20">OPD:</span>
            <a href="tel:+919431000000" className="text-sm font-semibold text-slate-800 hover:text-blue-600">+91 94310-XXXXX</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-20">Emergency:</span>
            <a href="tel:108" className="text-sm font-bold text-red-600 hover:text-red-700">108</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-20">Helpline:</span>
            <a href="tel:104" className="text-sm font-semibold text-slate-800 hover:text-blue-600">104 (NHM)</a>
          </div>
        </div>
      ),
    },
    {
      icon: <Mail size={18} className="text-purple-600" />,
      bg: "bg-purple-50",
      label: "Email",
      content: (
        <a
          href="mailto:chcbharno@jharkhand.gov.in"
          className="text-sm text-blue-600 hover:underline break-all"
        >
          chcbharno@jharkhand.gov.in
        </a>
      ),
    },
    {
      icon: <Clock size={18} className="text-amber-600" />,
      bg: "bg-amber-50",
      label: "Working Hours",
      content: (
        <div className="space-y-1.5">
          <div>
            <span className="text-xs font-semibold text-slate-700">OPD:</span>
            <span className="text-xs text-slate-500 ml-1">Mon–Sat, 8:00 AM – 2:00 PM</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-700">Emergency:</span>
            <span className="text-xs text-slate-500 ml-1">24 Hours, 7 Days</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-700">Pharmacy:</span>
            <span className="text-xs text-slate-500 ml-1">Mon–Sat, 8:00 AM – 4:00 PM</span>
          </div>
        </div>
      ),
    },
    {
      icon: <Navigation size={18} className="text-green-600" />,
      bg: "bg-green-50",
      label: "Directions",
      content: (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Located on NH-75, near Bharno Bus Stand. Approx 45 km from Gumla town.</p>
          <a
            href="https://www.google.com/maps/search/Bharno+Gumla+Jharkhand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            Open in Google Maps
            <ExternalLink size={11} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {cards.map((card, i) => (
        <div key={i} className="card-premium flex gap-4 items-start p-5">
          <div className={cn("flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center", card.bg)}>
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold font-display text-slate-900 mb-1.5">{card.label}</h4>
            {card.content}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── OPD Schedule Table ───────────────────────────────────────────────────────
const OpdScheduleTable: React.FC = () => {
  const { ref, visible } = useIntersection();

  return (
    <section className="section-pad bg-white">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="section-label mb-4">
            <CalendarDays size={14} />
            Department Schedule
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mt-4">
            OPD <span className="gradient-text">Timetable</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Department-wise schedule for outpatient services. Please arrive 15 minutes before your appointment.
          </p>
        </div>

        <div
          ref={ref}
          className={cn(
            "overflow-x-auto rounded-2xl border border-slate-200 shadow-sm transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <table className="w-full min-w-[640px]">
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #1e3a8a, #0f766e)" }}>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/90">Department</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/90">Days</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/90">Timing</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/90">Doctor / Staff</th>
              </tr>
            </thead>
            <tbody>
              {opdSchedule.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-slate-100 hover:bg-blue-50/50 transition-colors",
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  )}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-800">{row.department}</span>
                    {row.department === "Emergency / Casualty" && (
                      <span className="ml-2 badge-red">24/7</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.days}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{row.timing}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{row.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
          <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <span>
            Timings may vary during public holidays or due to outreach duties. For confirmation, call{" "}
            <a href="tel:104" className="text-blue-600 font-medium hover:underline">104</a> before visiting.
          </span>
        </div>
      </div>
    </section>
  );
};

// ─── Map Placeholder ──────────────────────────────────────────────────────────
const MapPlaceholder: React.FC = () => {
  const { ref, visible } = useIntersection();

  return (
    <section className="section-pad bg-slate-50">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="section-label mb-4">
            <MapPin size={14} />
            Find Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mt-4">
            Our <span className="gradient-text">Location</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-3xl shadow-xl border border-slate-200 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ height: 380 }}
        >
          {/* Map-like gradient background */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, #e2e8f0 0%, #cbd5e1 40%, #d1e8d4 70%, #b7d4bb 100%)" }}
          />
          {/* Road lines */}
          <div className="absolute top-1/2 left-0 right-0 h-6 bg-slate-300/60 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-slate-300/60 -translate-x-1/2" />
          {/* Grid lines */}
          {[...Array(6)].map((_, i) => (
            <div key={i}
              className="absolute top-0 bottom-0 border-l border-slate-200/40"
              style={{ left: `${(i + 1) * 16.66}%` }}
            />
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={i}
              className="absolute left-0 right-0 border-t border-slate-200/40"
              style={{ top: `${(i + 1) * 25}%` }}
            />
          ))}

          {/* Center pin */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full border-4 border-white shadow-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2563eb, #0d9488)" }}
              >
                <MapPin size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white shadow-md" />
            </div>

            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 max-w-xs text-center">
              <h3 className="font-bold font-display text-slate-900 text-sm">CHC Bharno</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Near Bharno Bus Stand, NH-75<br />
                Bharno Block, Gumla, Jharkhand – 835209
              </p>
              <a
                href="https://www.google.com/maps/search/Bharno+Gumla+Jharkhand"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-3 text-xs py-2 px-4"
              >
                <ExternalLink size={13} />
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Overlay label */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 rounded-xl shadow text-xs font-medium text-slate-500 backdrop-blur-sm">
            📍 Bharno, Gumla District, Jharkhand
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Social Media ─────────────────────────────────────────────────────────────
const SocialMediaLinks: React.FC = () => {
  const { ref, visible } = useIntersection();

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="page-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Connect with <span className="gradient-text">CHC Bharno</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2">Stay updated on health news, camp schedules, and announcements.</p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {socialLinks.map((s, i) => (
            <button
              key={i}
              className={cn(
                "flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-100 transition-all duration-700 hover:-translate-y-1 hover:shadow-md cursor-pointer",
                s.bgColor,
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={cn("w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center", s.color)}>
                {s.icon}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-800">{s.platform}</div>
                <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[100px]">{s.handle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FAQ Section ──────────────────────────────────────────────────────────────
const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, visible } = useIntersection(0.05);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="section-pad bg-slate-50">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="section-label mb-4">
            <MessageCircle size={14} />
            Common Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mt-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Quick answers to the most common questions from our patients and visitors.
          </p>
        </div>

        <div ref={ref} className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border transition-all duration-700",
                openIndex === i
                  ? "border-blue-200 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                className="w-full flex items-start gap-4 p-5 text-left"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 transition-colors",
                    openIndex === i ? "text-white" : "bg-slate-100 text-slate-500"
                  )}
                  style={openIndex === i ? { background: "linear-gradient(135deg, #2563eb, #0d9488)" } : {}}
                >
                  {i + 1}
                </div>
                <span className={cn(
                  "flex-1 text-sm font-semibold leading-snug transition-colors",
                  openIndex === i ? "text-blue-700" : "text-slate-800"
                )}>
                  {faq.question}
                </span>
                <div className="flex-shrink-0 text-slate-400 mt-0.5">
                  {openIndex === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {openIndex === i && (
                <div className="px-5 pb-5 pl-16">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-slate-500 text-sm mb-3">Still have questions? We're here to help.</p>
          <a href="tel:104" className="btn-teal">
            <Phone size={15} />
            Call 104 — NHM Helpline
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Main Contact Page ────────────────────────────────────────────────────────
const ContactPage: React.FC = () => {
  const { ref: formRef, visible: formVisible } = useIntersection(0.1);

  return (
    <>
      <Helmet>
        <title>Contact CHC Bharno — Phone, Address & OPD Schedule | Gumla, Jharkhand</title>
        <meta
          name="description"
          content="Contact CHC Bharno for OPD appointments, emergency services, and health enquiries. Call 108 for ambulance, 104 NHM helpline. Located at NH-75, Bharno, Gumla, Jharkhand."
        />
        <meta
          name="keywords"
          content="CHC Bharno Contact, Bharno Hospital Phone Number, OPD Timings CHC Bharno, Gumla Hospital Address, 108 Ambulance Jharkhand"
        />
      </Helmet>

      <main>
        <PageHeader
          title="Contact Us"
          subtitle="We're always here to help. Reach out for appointments, enquiries, or emergency assistance."
          badge="Always Here to Help"
          breadcrumbs={[{ label: "Contact" }]}
        />

        {/* Emergency Numbers Banner */}
        <EmergencyBanner />

        {/* Contact Form + Info Two-Column */}
        <section className="section-pad bg-white">
          <div className="page-container">
            <div
              ref={formRef}
              className={cn(
                "grid lg:grid-cols-2 gap-12 items-start transition-all duration-700",
                formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {/* LEFT: Form */}
              <div>
                <div className="mb-8">
                  <span className="section-label mb-4 inline-flex">
                    <Send size={14} />
                    Send a Message
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-4">
                    Get in <span className="gradient-text">Touch</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Fill in the form below and our team will respond within 1–2 working days.
                  </p>
                </div>
                <div className="card-premium">
                  <ContactForm />
                </div>
              </div>

              {/* RIGHT: Info Cards */}
              <div>
                <div className="mb-8">
                  <span className="section-label mb-4 inline-flex">
                    <MapPin size={14} />
                    Contact Information
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-4">
                    Find <span className="gradient-text">Us Here</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Visit us at CHC Bharno or reach out through any of the channels below.
                  </p>
                </div>
                <ContactInfoCards />
              </div>
            </div>
          </div>
        </section>

        {/* OPD Schedule Table */}
        <OpdScheduleTable />

        {/* Google Maps Placeholder */}
        <MapPlaceholder />

        {/* Social Media */}
        <SocialMediaLinks />

        {/* FAQ */}
        <FaqSection />
      </main>
    </>
  );
};

export { ContactPage };
export default ContactPage;
