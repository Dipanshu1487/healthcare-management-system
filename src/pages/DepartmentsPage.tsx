import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Stethoscope,
  Baby,
  Ambulance,
  Smile,
  Eye,
  Apple,
  FlaskConical,
  Brain,
  Clock,
  Users,
  CheckCircle,
  Calendar,
  Phone,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HeartPulse,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import PageHeader from "../components/shared/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Doctor {
  name: string;
  qualification: string;
}

interface Department {
  id: number;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  description: string;
  services: string[];
  doctors: Doctor[];
  opdTimings: string;
  opdDays: string;
  contactStatus: "available" | "limited" | "visiting" | "24/7";
  color: string;
}

interface OPDScheduleRow {
  department: string;
  shortName: string;
  days: string;
  time: string;
  doctors: string;
  status: "available" | "limited" | "visiting" | "24/7";
  color: string;
}

// ─── Color Configs ────────────────────────────────────────────────────────────
const colorConfig: Record<
  string,
  {
    icon: string;
    badge: string;
    border: string;
    headerBg: string;
    dot: string;
    serviceDot: string;
  }
> = {
  blue: {
    icon: "bg-blue-50 text-blue-600 border-blue-100",
    badge: "badge-blue",
    border: "border-blue-100",
    headerBg: "from-blue-50 to-blue-50/20",
    dot: "bg-blue-500",
    serviceDot: "text-blue-500",
  },
  pink: {
    icon: "bg-pink-50 text-pink-600 border-pink-100",
    badge: "bg-pink-50 text-pink-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
    border: "border-pink-100",
    headerBg: "from-pink-50 to-pink-50/20",
    dot: "bg-pink-500",
    serviceDot: "text-pink-500",
  },
  red: {
    icon: "bg-red-50 text-red-600 border-red-100",
    badge: "badge-red",
    border: "border-red-100",
    headerBg: "from-red-50 to-red-50/20",
    dot: "bg-red-500",
    serviceDot: "text-red-500",
  },
  teal: {
    icon: "bg-teal-50 text-teal-600 border-teal-100",
    badge: "badge-teal",
    border: "border-teal-100",
    headerBg: "from-teal-50 to-teal-50/20",
    dot: "bg-teal-500",
    serviceDot: "text-teal-500",
  },
  indigo: {
    icon: "bg-indigo-50 text-indigo-600 border-indigo-100",
    badge: "bg-indigo-50 text-indigo-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
    border: "border-indigo-100",
    headerBg: "from-indigo-50 to-indigo-50/20",
    dot: "bg-indigo-500",
    serviceDot: "text-indigo-500",
  },
  green: {
    icon: "bg-green-50 text-green-600 border-green-100",
    badge: "badge-green",
    border: "border-green-100",
    headerBg: "from-green-50 to-green-50/20",
    dot: "bg-green-500",
    serviceDot: "text-green-500",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600 border-purple-100",
    badge: "bg-purple-50 text-purple-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
    border: "border-purple-100",
    headerBg: "from-purple-50 to-purple-50/20",
    dot: "bg-purple-500",
    serviceDot: "text-purple-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 border-amber-100",
    badge: "badge-amber",
    border: "border-amber-100",
    headerBg: "from-amber-50 to-amber-50/20",
    dot: "bg-amber-500",
    serviceDot: "text-amber-500",
  },
};

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  available: {
    label: "Available Today",
    badgeClass: "badge-green",
    dotClass: "bg-green-400",
  },
  limited: {
    label: "Limited Slots",
    badgeClass: "badge-amber",
    dotClass: "bg-amber-400",
  },
  visiting: {
    label: "Visiting Doctor",
    badgeClass: "badge-blue",
    dotClass: "bg-blue-400",
  },
  "24/7": {
    label: "24/7 Available",
    badgeClass: "badge-red",
    dotClass: "bg-red-400",
  },
};

// ─── Departments Data ─────────────────────────────────────────────────────────
const departmentsData: Department[] = [
  {
    id: 1,
    name: "General Medicine",
    shortName: "Gen. Med",
    icon: <Stethoscope size={26} strokeWidth={1.7} />,
    description:
      "Comprehensive primary care and general health consultations for all age groups. Covers diagnosis and management of common illnesses, chronic diseases, and preventive care.",
    services: [
      "OPD consultation & follow-up",
      "NCD screening (Diabetes, Hypertension, Thyroid)",
      "Blood pressure & diabetes management",
      "Health certificates & medical fitness",
      "Referral services to higher facilities",
      "DOTS center for TB patients",
    ],
    doctors: [
      { name: "Dr. Priya Sharma", qualification: "MBBS, MD (Internal Medicine)" },
      { name: "Dr. Ramesh Gupta", qualification: "MBBS, MD (General Medicine)" },
    ],
    opdTimings: "8:00 AM – 2:00 PM",
    opdDays: "Monday – Saturday",
    contactStatus: "available",
    color: "blue",
  },
  {
    id: 2,
    name: "Maternal & Child Health",
    shortName: "MCH",
    icon: <Baby size={26} strokeWidth={1.7} />,
    description:
      "Antenatal care, safe institutional delivery, postnatal services, and comprehensive child health programs including immunization under Mission Indradhanush.",
    services: [
      "ANC (Antenatal Care) checkup",
      "Safe & institutional delivery",
      "Newborn care & SNCU services",
      "Immunization under Mission Indradhanush",
      "Family planning counseling",
      "Postnatal follow-up & nutrition advice",
    ],
    doctors: [
      { name: "Dr. Rakesh Kumar", qualification: "MBBS, MS (Obstetrics & Gynaecology)" },
      { name: "Dr. Sunita Devi", qualification: "MBBS, DGO (Gynaecology)" },
    ],
    opdTimings: "9:00 AM – 1:00 PM",
    opdDays: "Monday – Saturday",
    contactStatus: "available",
    color: "pink",
  },
  {
    id: 3,
    name: "Emergency & Trauma",
    shortName: "Emergency",
    icon: <Ambulance size={26} strokeWidth={1.7} />,
    description:
      "24/7 emergency and trauma care services with a dedicated casualty ward, critical patient management, ambulance coordination, and stabilization before referral.",
    services: [
      "Trauma care & wound management",
      "24/7 casualty & critical care",
      "108 EMRI ambulance coordination",
      "First aid & resuscitation",
      "Poisoning & snake bite management",
      "Emergency referral to district hospital",
    ],
    doctors: [
      { name: "Dr. Anita Singh", qualification: "MBBS, DNB (Emergency Medicine)" },
      { name: "Dr. Sanjay Mahto", qualification: "MBBS, MS (General Surgery)" },
    ],
    opdTimings: "24 Hours",
    opdDays: "All Days",
    contactStatus: "24/7",
    color: "red",
  },
  {
    id: 4,
    name: "Dental Care",
    shortName: "Dental",
    icon: <Smile size={26} strokeWidth={1.7} />,
    description:
      "Complete oral health services including routine examinations, tooth extractions, scaling, fluoride treatments, and public dental health awareness programs.",
    services: [
      "Tooth extraction & oral surgery",
      "Scaling & cleaning",
      "Fluoride treatment & prevention",
      "Oral cavity examination",
      "Dentures & prosthetics guidance",
      "School dental health programs",
    ],
    doctors: [
      { name: "Dr. Vijay Oraon", qualification: "BDS, MDS (Oral Surgery)" },
    ],
    opdTimings: "9:00 AM – 1:00 PM",
    opdDays: "Monday, Wednesday, Friday",
    contactStatus: "limited",
    color: "teal",
  },
  {
    id: 5,
    name: "Eye Care (Ophthalmology)",
    shortName: "Eye Care",
    icon: <Eye size={26} strokeWidth={1.7} />,
    description:
      "Vision testing, free spectacle distribution, cataract screening, and referral for advanced eye care under the National Programme for Control of Blindness.",
    services: [
      "Comprehensive vision testing",
      "Free spectacle prescription & distribution",
      "Cataract screening & referral",
      "Eye drops & minor treatments",
      "Referral for IOL surgery",
      "Eye camp coordination",
    ],
    doctors: [
      { name: "Dr. Meena Kumari", qualification: "MBBS, MS (Ophthalmology)" },
    ],
    opdTimings: "9:00 AM – 12:00 PM",
    opdDays: "Tuesday & Thursday",
    contactStatus: "limited",
    color: "indigo",
  },
  {
    id: 6,
    name: "Nutrition & Dietetics",
    shortName: "Nutrition",
    icon: <Apple size={26} strokeWidth={1.7} />,
    description:
      "Personalized dietary counseling, management of Severe Acute Malnutrition (SAM), Moderate Acute Malnutrition (MAM), and growth monitoring for children under 5.",
    services: [
      "Diet counseling & personalized meal planning",
      "SAM/MAM management & NRC referral",
      "Growth monitoring & MUAC assessment",
      "Iron & folic acid supplementation",
      "Nutrition education for mothers",
      "Anemia management programs",
    ],
    doctors: [
      { name: "Dt. Preeti Singh", qualification: "MSc (Food & Nutrition)" },
    ],
    opdTimings: "10:00 AM – 12:00 PM",
    opdDays: "Monday – Friday",
    contactStatus: "available",
    color: "green",
  },
  {
    id: 7,
    name: "Laboratory Services",
    shortName: "Laboratory",
    icon: <FlaskConical size={26} strokeWidth={1.7} />,
    description:
      "In-house diagnostic laboratory offering a wide panel of blood tests, urine analysis, malaria diagnostics, and digital X-ray services with same-day results.",
    services: [
      "Complete Blood Count (CBC)",
      "Blood glucose (fasting & PP)",
      "Urine routine & microscopy",
      "Digital X-ray (chest, limbs)",
      "Malaria rapid test & slide exam",
      "Pregnancy test (urine βhCG)",
    ],
    doctors: [
      { name: "Mr. Dinesh Kumar", qualification: "B.Sc (MLT), DMLT" },
      { name: "Ms. Anjali Ekka", qualification: "B.Sc (MLT)" },
    ],
    opdTimings: "7:00 AM – 1:00 PM",
    opdDays: "Monday – Saturday",
    contactStatus: "available",
    color: "purple",
  },
  {
    id: 8,
    name: "Mental Health",
    shortName: "Mental Health",
    icon: <Brain size={26} strokeWidth={1.7} />,
    description:
      "Community mental health services under NMHP including counseling, depression & anxiety screening, and referral under the National Mental Health Programme.",
    services: [
      "Individual & group counseling",
      "Depression & anxiety screening",
      "NMHP psycho-social support",
      "Substance abuse counseling",
      "Referral to DMHP/psychiatrist",
      "Community mental health awareness",
    ],
    doctors: [
      { name: "Dr. Kavita Singh", qualification: "MBBS, Diploma in Psychiatry (visiting)" },
    ],
    opdTimings: "10:00 AM – 12:00 PM",
    opdDays: "Wednesday only",
    contactStatus: "visiting",
    color: "amber",
  },
];

// ─── OPD Schedule Data ────────────────────────────────────────────────────────
const opdSchedule: OPDScheduleRow[] = [
  {
    department: "General Medicine",
    shortName: "Gen. Med",
    days: "Mon – Sat",
    time: "8:00 AM – 2:00 PM",
    doctors: "Dr. Priya Sharma, Dr. Ramesh Gupta",
    status: "available",
    color: "blue",
  },
  {
    department: "Maternal & Child Health",
    shortName: "MCH",
    days: "Mon – Sat",
    time: "9:00 AM – 1:00 PM",
    doctors: "Dr. Rakesh Kumar, Dr. Sunita Devi",
    status: "available",
    color: "pink",
  },
  {
    department: "Emergency & Trauma",
    shortName: "Emergency",
    days: "All Days",
    time: "24/7",
    doctors: "Dr. Anita Singh, Dr. Sanjay Mahto",
    status: "24/7",
    color: "red",
  },
  {
    department: "Dental Care",
    shortName: "Dental",
    days: "Mon, Wed, Fri",
    time: "9:00 AM – 1:00 PM",
    doctors: "Dr. Vijay Oraon",
    status: "limited",
    color: "teal",
  },
  {
    department: "Eye Care",
    shortName: "Eye",
    days: "Tue & Thu",
    time: "9:00 AM – 12:00 PM",
    doctors: "Dr. Meena Kumari",
    status: "limited",
    color: "indigo",
  },
  {
    department: "Nutrition & Dietetics",
    shortName: "Nutrition",
    days: "Mon – Fri",
    time: "10:00 AM – 12:00 PM",
    doctors: "Dt. Preeti Singh",
    status: "available",
    color: "green",
  },
  {
    department: "Laboratory Services",
    shortName: "Lab",
    days: "Mon – Sat",
    time: "7:00 AM – 1:00 PM",
    doctors: "Mr. Dinesh Kumar, Ms. Anjali Ekka",
    status: "available",
    color: "purple",
  },
  {
    department: "Mental Health",
    shortName: "Mental Health",
    days: "Wednesday",
    time: "10:00 AM – 12:00 PM",
    doctors: "Dr. Kavita Singh (Visiting)",
    status: "visiting",
    color: "amber",
  },
];

// ─── Department Card ──────────────────────────────────────────────────────────
interface DepartmentCardProps {
  department: Department;
  index: number;
  visible: boolean;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, index, visible }) => {
  const [expanded, setExpanded] = useState(false);
  const delay = `delay-${Math.min(index * 100, 500)}`;
  const colors = colorConfig[department.color] || colorConfig.blue;
  const status = statusConfig[department.contactStatus];

  return (
    <div className={cn("opacity-initial", visible ? `animate-fade-in-up ${delay}` : "")}>
      <div className={cn(
        "bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
        colors.border
      )}
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}>
        {/* Header */}
        <div className={cn(
          "bg-gradient-to-br p-6 border-b",
          colors.headerBg,
          colors.border
        )}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0",
                colors.icon
              )}>
                {department.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg font-display leading-tight">
                  {department.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={cn(status.badgeClass, "flex items-center gap-1")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", status.dotClass)} />
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                expanded
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* OPD timings (always visible) */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Calendar size={13} className="text-slate-400" />
              <span className="font-medium">{department.opdDays}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock size={13} className="text-slate-400" />
              <span className="font-medium">{department.opdTimings}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Users size={13} className="text-slate-400" />
              <span className="font-medium">{department.doctors.length} Doctor{department.doctors.length > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-sm text-slate-600 leading-relaxed">{department.description}</p>
        </div>

        {/* Expandable Content */}
        <div className={cn(
          "overflow-hidden transition-all duration-500",
          expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-6 pb-6 pt-2 space-y-5">
            {/* Services */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle size={12} className="text-teal-500" />
                Services Offered
              </div>
              <ul className="space-y-2">
                {department.services.map((service, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", colors.dot)} />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Doctors */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Users size={12} className="text-blue-500" />
                Assigned Doctors
              </div>
              <div className="space-y-2.5">
                {department.doctors.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                      department.color === "red"
                        ? "bg-red-500"
                        : department.color === "pink"
                        ? "bg-pink-500"
                        : department.color === "teal"
                        ? "bg-teal-500"
                        : department.color === "indigo"
                        ? "bg-indigo-500"
                        : department.color === "green"
                        ? "bg-green-600"
                        : department.color === "purple"
                        ? "bg-purple-600"
                        : department.color === "amber"
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    )}>
                      {doc.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{doc.name}</div>
                      <div className="text-xs text-slate-400">{doc.qualification}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Book appointment */}
            <Link
              to="/appointment"
              className="btn-primary text-xs px-4 py-2.5 w-full justify-center"
            >
              <Calendar size={13} />
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Expand hint when collapsed */}
        {!expanded && (
          <div className="px-6 pb-5">
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <ChevronDown size={13} />
              Show services & doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── OPD Schedule Table ───────────────────────────────────────────────────────
const OPDScheduleSection: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <div className={cn("opacity-initial", visible ? "animate-fade-in-up delay-300" : "")}>
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)" }}>
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold font-display text-slate-900 text-lg">OPD Schedule</h3>
            <p className="text-sm text-slate-500 mt-0.5">Complete outpatient timing for all departments</p>
          </div>
          <div className="flex items-center gap-1.5 badge-teal">
            <Clock size={11} />
            2026–27 Schedule
          </div>
        </div>

        {/* Responsive table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timing</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Doctors</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {opdSchedule.map((row, i) => {
                const colors = colorConfig[row.color] || colorConfig.blue;
                const status = statusConfig[row.status];
                return (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", colors.dot)} />
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{row.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">{row.days}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <Clock size={13} className="text-slate-400 flex-shrink-0" />
                        {row.time}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="text-xs text-slate-500 max-w-[200px]">{row.doctors}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(status.badgeClass, "flex items-center gap-1 whitespace-nowrap")}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dotClass)} />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            * OPD timings may vary on public holidays. For walk-in or same-day appointments, registration opens 30 minutes before OPD start time.
            Emergency services are available 24/7.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── CTA Section ──────────────────────────────────────────────────────────────
const DeptCTASection: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-pad relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #1e3a8a 0%, #0f172a 60%, #0f766e 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }} />
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #2dd4bf, transparent)" }} />
      </div>

      <div className="page-container relative z-10 text-center">
        <div className={cn("max-w-3xl mx-auto space-y-6 opacity-initial", visible ? "animate-fade-in-up" : "")}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border"
            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "#5eead4" }}>
            <HeartPulse size={12} />
            Book Your Appointment
          </div>

          <h2 className="text-3xl md:text-4xl font-bold font-display text-white text-balance">
            Ready to Visit{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #34d399)" }}>
              CHC Bharno?
            </span>
          </h2>

          <p className="text-blue-200 text-base leading-relaxed max-w-xl mx-auto">
            Book your OPD appointment online, or walk in during department timings. Our staff is ready to assist you — in Hindi, English, Sadri, or Mundari.
          </p>

          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 opacity-initial",
            visible ? "animate-fade-in-up delay-200" : ""
          )}>
            <Link to="/appointment" className="btn-teal text-sm px-8 py-3.5">
              <Calendar size={16} />
              Book OPD Appointment
              <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="btn-outline-white text-sm px-8 py-3.5">
              <Phone size={16} />
              Call & Enquire
            </Link>
          </div>

          <div className={cn(
            "flex flex-wrap items-center justify-center gap-6 pt-4 opacity-initial",
            visible ? "animate-fade-in-up delay-300" : ""
          )}>
            {[
              { icon: <Clock size={14} />, text: "Emergency: Always Open" },
              { icon: <MapPin size={14} />, text: "Bharno, Gumla, Jharkhand" },
              { icon: <Phone size={14} />, text: "108 (Free Ambulance)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-blue-300 text-sm">
                <span className="text-blue-400">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Departments Page ─────────────────────────────────────────────────────────
const DepartmentsPage: React.FC = () => {
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Departments — CHC Bharno | 8 Specialties, 28+ Doctors</title>
        <meta
          name="description"
          content="Explore all 8 departments at CHC Bharno — General Medicine, MCH, Emergency, Dental, Eye Care, Nutrition, Laboratory, and Mental Health. View OPD timings, doctors, and services."
        />
        <meta
          name="keywords"
          content="CHC Bharno Departments, OPD Timing, Gumla Hospital Departments, General Medicine, MCH, Dental CHC, Eye Care Jharkhand"
        />
      </Helmet>

      <main>
        {/* ── Page Header ── */}
        <PageHeader
          title="Our Departments"
          badge="8 Specialties · 28+ Doctors"
          subtitle="Comprehensive healthcare services across 8 departments, staffed by experienced doctors and paramedical professionals dedicated to serving Gumla District."
          breadcrumbs={[{ label: "Departments" }]}
        />

        {/* ── Quick Stats ── */}
        <section className="py-10 bg-white border-b border-slate-100">
          <div className="page-container">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "8", label: "Departments", icon: <Stethoscope size={18} className="text-blue-500" /> },
                { value: "28+", label: "Specialist Doctors", icon: <Users size={18} className="text-teal-500" /> },
                { value: "24/7", label: "Emergency Care", icon: <Ambulance size={18} className="text-red-500" /> },
                { value: "150+", label: "OPD Patients / Day", icon: <HeartPulse size={18} className="text-purple-500" /> },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center mb-2">{item.icon}</div>
                  <div className="text-2xl md:text-3xl font-black font-display gradient-text">{item.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Department Cards ── */}
        <section ref={sectionRef} className="section-pad bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20">
          <div className="page-container">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
              <div className={cn("opacity-initial", sectionVisible ? "animate-fade-in-up" : "")}>
                <span className="section-label">
                  <Stethoscope size={12} />
                  All Departments
                </span>
              </div>
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold font-display text-slate-900 opacity-initial",
                sectionVisible ? "animate-fade-in-up delay-100" : ""
              )}>
                Specialized Care{" "}
                <span className="gradient-text">For Every Need</span>
              </h2>
              <p className={cn(
                "text-slate-500 leading-relaxed opacity-initial",
                sectionVisible ? "animate-fade-in-up delay-200" : ""
              )}>
                Click on any department card to view detailed services, assigned doctors, and appointment information.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {departmentsData.map((dept, i) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  index={i}
                  visible={sectionVisible}
                />
              ))}
            </div>

            {/* OPD Schedule Table */}
            <div className="mt-16">
              <div className={cn(
                "text-center max-w-2xl mx-auto mb-10 space-y-3 opacity-initial",
                sectionVisible ? "animate-fade-in-up delay-200" : ""
              )}>
                <span className="section-label">
                  <Calendar size={12} />
                  OPD Schedule
                </span>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900">
                  Department Timings &{" "}
                  <span className="gradient-text">Schedule</span>
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  All OPD services are free. Arrive 15 minutes early to complete registration at the front desk.
                </p>
              </div>
              <OPDScheduleSection visible={sectionVisible} />
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <DeptCTASection />
      </main>
    </>
  );
};

export default DepartmentsPage;
