import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Star,
  Clock,
  CheckCircle,
  CalendarCheck,
  Languages,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Users,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { cn } from "../lib/utils";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface Doctor {
  id: number;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  rating: number;
  reviews: number;
  availableToday: boolean;
  availabilityLabel: string;
  nextSlot: string;
  languages: string[];
  initials: string;
  avatarColor: AvatarColor;
}

type AvatarColor =
  | "blue"
  | "teal"
  | "red"
  | "purple"
  | "indigo"
  | "green"
  | "pink"
  | "amber"
  | "slate";

// ─── Doctors Data ─────────────────────────────────────────────────────────────
const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    designation: "Chief Medical Officer",
    department: "General Medicine",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: 18,
    rating: 4.9,
    reviews: 312,
    availableToday: true,
    availabilityLabel: "Available Today",
    nextSlot: "Today, 10:00 AM",
    languages: ["Hindi", "English", "Sadri"],
    initials: "PS",
    avatarColor: "blue",
  },
  {
    id: 2,
    name: "Dr. Rakesh Kumar",
    designation: "Senior Gynaecologist",
    department: "Maternal & Child Health",
    qualification: "MBBS, MS (Obstetrics & Gynaecology)",
    experience: 14,
    rating: 4.8,
    reviews: 276,
    availableToday: true,
    availabilityLabel: "Available Today",
    nextSlot: "Today, 11:30 AM",
    languages: ["Hindi", "English"],
    initials: "RK",
    avatarColor: "teal",
  },
  {
    id: 3,
    name: "Dr. Anita Singh",
    designation: "Emergency Specialist",
    department: "Emergency & Trauma",
    qualification: "MBBS, DNB (Emergency Medicine)",
    experience: 10,
    rating: 4.7,
    reviews: 198,
    availableToday: true,
    availabilityLabel: "Available Now",
    nextSlot: "Now",
    languages: ["Hindi", "English"],
    initials: "AS",
    avatarColor: "red",
  },
  {
    id: 4,
    name: "Dr. Vijay Oraon",
    designation: "Dental Surgeon",
    department: "Dental Care",
    qualification: "BDS, MDS (Oral Surgery)",
    experience: 9,
    rating: 4.8,
    reviews: 154,
    availableToday: false,
    availabilityLabel: "Mon / Wed / Fri",
    nextSlot: "Monday, 9:00 AM",
    languages: ["Hindi", "English", "Mundari"],
    initials: "VO",
    avatarColor: "purple",
  },
  {
    id: 5,
    name: "Dr. Meena Kumari",
    designation: "Ophthalmologist",
    department: "Eye Care",
    qualification: "MBBS, MS (Ophthalmology)",
    experience: 7,
    rating: 4.6,
    reviews: 121,
    availableToday: false,
    availabilityLabel: "Tue / Thu",
    nextSlot: "Tuesday, 10:00 AM",
    languages: ["Hindi", "English", "Nagpuri"],
    initials: "MK",
    avatarColor: "indigo",
  },
  {
    id: 6,
    name: "Dr. Ramesh Gupta",
    designation: "Physician",
    department: "General Medicine",
    qualification: "MBBS, MD (General Medicine)",
    experience: 12,
    rating: 4.7,
    reviews: 209,
    availableToday: true,
    availabilityLabel: "Available Today",
    nextSlot: "Today, 2:00 PM",
    languages: ["Hindi", "English", "Bhojpuri"],
    initials: "RG",
    avatarColor: "blue",
  },
  {
    id: 7,
    name: "Dt. Preeti Singh",
    designation: "Senior Dietician",
    department: "Nutrition & Dietetics",
    qualification: "BSc, MSc (Dietetics)",
    experience: 6,
    rating: 4.8,
    reviews: 88,
    availableToday: true,
    availabilityLabel: "Mon – Fri",
    nextSlot: "Today, 11:00 AM",
    languages: ["Hindi", "English"],
    initials: "PS",
    avatarColor: "green",
  },
  {
    id: 8,
    name: "Dr. Suresh Mahto",
    designation: "Medical Officer",
    department: "General Medicine",
    qualification: "MBBS",
    experience: 5,
    rating: 4.5,
    reviews: 76,
    availableToday: true,
    availabilityLabel: "Available Today",
    nextSlot: "Today, 9:30 AM",
    languages: ["Hindi", "Sadri", "Nagpuri"],
    initials: "SM",
    avatarColor: "teal",
  },
  {
    id: 9,
    name: "Dr. Kavita Devi",
    designation: "Lady Medical Officer",
    department: "Maternal & Child Health",
    qualification: "MBBS, DGO",
    experience: 8,
    rating: 4.7,
    reviews: 143,
    availableToday: true,
    availabilityLabel: "Available Today",
    nextSlot: "Today, 10:30 AM",
    languages: ["Hindi", "English", "Sadri"],
    initials: "KD",
    avatarColor: "pink",
  },
  {
    id: 10,
    name: "Dr. Arvind Munda",
    designation: "Lab Officer",
    department: "Laboratory Services",
    qualification: "MBBS",
    experience: 6,
    rating: 4.6,
    reviews: 67,
    availableToday: true,
    availabilityLabel: "Mon – Sat",
    nextSlot: "Today, 8:00 AM",
    languages: ["Hindi", "English", "Mundari"],
    initials: "AM",
    avatarColor: "amber",
  },
  {
    id: 11,
    name: "Dr. Sanjay Pandey",
    designation: "Counselor & Psychiatrist",
    department: "Mental Health",
    qualification: "MBBS, MD (Psychiatry)",
    experience: 10,
    rating: 4.8,
    reviews: 95,
    availableToday: false,
    availabilityLabel: "Wednesday Only",
    nextSlot: "Wednesday, 10:00 AM",
    languages: ["Hindi", "English"],
    initials: "SP",
    avatarColor: "slate",
  },
  {
    id: 12,
    name: "Dr. Nisha Toppo",
    designation: "Dental Assistant",
    department: "Dental Care",
    qualification: "BDS",
    experience: 3,
    rating: 4.5,
    reviews: 54,
    availableToday: false,
    availabilityLabel: "Mon / Wed / Fri",
    nextSlot: "Monday, 9:30 AM",
    languages: ["Hindi", "English", "Mundari"],
    initials: "NT",
    avatarColor: "purple",
  },
];

// ─── Departments list ─────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "All",
  "General Medicine",
  "Maternal & Child Health",
  "Emergency & Trauma",
  "Dental Care",
  "Eye Care",
  "Nutrition & Dietetics",
  "Laboratory Services",
  "Mental Health",
];

// ─── Avatar Color Map ─────────────────────────────────────────────────────────
const avatarColorMap: Record<AvatarColor, { bg: string; text: string; ring: string }> = {
  blue:   { bg: "bg-blue-600",   text: "text-white", ring: "ring-blue-200" },
  teal:   { bg: "bg-teal-600",   text: "text-white", ring: "ring-teal-200" },
  red:    { bg: "bg-red-500",    text: "text-white", ring: "ring-red-200" },
  purple: { bg: "bg-purple-600", text: "text-white", ring: "ring-purple-200" },
  indigo: { bg: "bg-indigo-600", text: "text-white", ring: "ring-indigo-200" },
  green:  { bg: "bg-emerald-600",text: "text-white", ring: "ring-emerald-200" },
  pink:   { bg: "bg-pink-500",   text: "text-white", ring: "ring-pink-200" },
  amber:  { bg: "bg-amber-500",  text: "text-white", ring: "ring-amber-200" },
  slate:  { bg: "bg-slate-600",  text: "text-white", ring: "ring-slate-300" },
};

// ─── Department Badge Color Map ───────────────────────────────────────────────
const deptBadgeMap: Record<string, string> = {
  "General Medicine":       "badge-blue",
  "Maternal & Child Health":"badge-teal",
  "Emergency & Trauma":     "badge-red",
  "Dental Care":            "bg-purple-50 text-purple-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  "Eye Care":               "bg-indigo-50 text-indigo-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  "Nutrition & Dietetics":  "badge-green",
  "Laboratory Services":    "bg-purple-50 text-purple-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  "Mental Health":          "badge-amber",
};

// ─── Star Rating Component ────────────────────────────────────────────────────
const StarRating: React.FC<{ rating: number; reviews: number }> = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={cn(
              star <= fullStars
                ? "fill-amber-400 text-amber-400"
                : star === fullStars + 1 && hasHalf
                ? "fill-amber-200 text-amber-400"
                : "fill-slate-100 text-slate-300"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-slate-400">({reviews} reviews)</span>
    </div>
  );
};

// ─── Doctor Card Component ────────────────────────────────────────────────────
const DoctorCard: React.FC<{ doctor: Doctor; index: number }> = ({ doctor, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("animate-fade-in-up");
            el.classList.remove("opacity-initial");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const colors = avatarColorMap[doctor.avatarColor];
  const deptClass = deptBadgeMap[doctor.department] ?? "badge-blue";

  return (
    <div
      ref={cardRef}
      className="opacity-initial card-premium flex flex-col gap-0 overflow-hidden group"
      style={{ animationDelay: `${(index % 6) * 80}ms` }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full rounded-t-2xl"
        style={{ background: "linear-gradient(90deg, #2563eb 0%, #0d9488 100%)" }}
      />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold font-display text-lg ring-4",
              colors.bg,
              colors.text,
              colors.ring
            )}
          >
            {doctor.initials}
          </div>

          {/* Name & designation */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-800 leading-tight truncate font-display">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{doctor.designation}</p>
            {/* Department badge */}
            <span className={cn("mt-2 inline-block", deptClass)}>
              {doctor.department}
            </span>
          </div>
        </div>

        {/* Info rows */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <GraduationCap size={13} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{doctor.qualification}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Briefcase size={13} className="text-teal-500 flex-shrink-0" />
            <span>{doctor.experience} years experience</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Languages size={13} className="text-indigo-400 flex-shrink-0" />
            <span className="truncate">{doctor.languages.join(", ")}</span>
          </div>
        </div>

        {/* Star Rating */}
        <StarRating rating={doctor.rating} reviews={doctor.reviews} />

        {/* Availability */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium",
            doctor.availableToday
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-50 text-slate-500"
          )}
        >
          {doctor.availableToday ? (
            <>
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {doctor.availabilityLabel}
            </>
          ) : (
            <>
              <Clock size={12} className="flex-shrink-0" />
              <span>Next: {doctor.nextSlot}</span>
            </>
          )}
        </div>

        {/* Next slot */}
        {doctor.availableToday && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarCheck size={12} className="text-blue-400 flex-shrink-0" />
            <span>Next slot: {doctor.nextSlot}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button className="btn-primary flex-1 py-2.5 text-xs">
            <CalendarCheck size={14} />
            Book Appointment
          </button>
          <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            View Profile
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ query: string }> = ({ query }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
      <Search size={28} className="text-slate-300" />
    </div>
    <div className="text-center">
      <p className="text-slate-700 font-semibold">No doctors found</p>
      <p className="text-sm text-slate-400 mt-1">
        No results for "{query}". Try a different name or department.
      </p>
    </div>
  </div>
);

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SummaryStrip: React.FC = () => (
  <div className="bg-white border-b border-slate-100 py-8">
    <div className="page-container">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
        {[
          { icon: <Users size={20} className="text-blue-600" />, value: "28+", label: "Specialist Doctors" },
          { icon: <CheckCircle size={20} className="text-teal-600" />, value: "8", label: "Departments" },
          { icon: <Star size={20} className="text-amber-500" />, value: "4.8★", label: "Avg. Rating" },
          { icon: <CalendarCheck size={20} className="text-emerald-600" />, value: "24/7", label: "Emergency Available" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-lg font-bold font-display text-slate-800">{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Doctors Page ─────────────────────────────────────────────────────────────
const DoctorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDept, setActiveDept] = useState("All");

  const filtered = doctorsData.filter((doc) => {
    const matchDept = activeDept === "All" || doc.department === activeDept;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      q === "" ||
      doc.name.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q) ||
      doc.designation.toLowerCase().includes(q) ||
      doc.qualification.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>Our Doctors — CHC Bharno | 28+ Specialists</title>
        <meta
          name="description"
          content="Meet the expert team of 28+ specialist doctors at CHC Bharno, Gumla, Jharkhand. Book appointments with General Medicine, Gynaecology, Emergency, Dental, Eye Care, and more."
        />
        <meta
          name="keywords"
          content="CHC Bharno doctors, Bharno specialist, Gumla doctor, book appointment Jharkhand, free OPD Bharno"
        />
      </Helmet>

      <main>
        {/* Page Header */}
        <PageHeader
          title="Meet Our Doctors"
          subtitle="Dedicated specialists committed to providing compassionate, quality healthcare to every patient across Bharno and surrounding villages."
          badge="28+ Specialists · 8 Departments"
          breadcrumbs={[{ label: "Doctors" }]}
        />

        {/* Summary Strip */}
        <SummaryStrip />

        {/* Search + Filter */}
        <section className="bg-slate-50 py-8 border-b border-slate-100 sticky top-[64px] z-30 backdrop-blur-md">
          <div className="page-container space-y-5">
            {/* Search bar */}
            <div className="relative max-w-xl">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, specialty, or department…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department pills */}
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                    activeDept === dept
                      ? "text-white border-transparent shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  )}
                  style={
                    activeDept === dept
                      ? { background: "linear-gradient(135deg, #2563eb 0%, #0d9488 100%)" }
                      : {}
                  }
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">{filtered.length}</span>{" "}
              doctor{filtered.length !== 1 ? "s" : ""}
              {activeDept !== "All" ? ` in ${activeDept}` : ""}
              {searchQuery ? ` matching "${searchQuery}"` : ""}
            </p>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="section-pad bg-slate-50">
          <div className="page-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map((doc, i) => (
                  <DoctorCard key={doc.id} doctor={doc} index={i} />
                ))
              ) : (
                <EmptyState query={searchQuery || activeDept} />
              )}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16">
          <div className="page-container">
            <div
              className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0f766e 100%)",
              }}
            >
              {/* Orbs */}
              <div
                className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
              />
              <div
                className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, #0d9488, transparent)" }}
              />
              <div className="relative z-10">
                <span className="section-label mb-4 inline-flex" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#5eead4" }}>
                  Book Your Visit
                </span>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-4 mb-3">
                  Need to See a Doctor?
                </h2>
                <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto mb-8">
                  Walk in anytime for OPD or book your appointment slot online. All government scheme cards accepted — PM-JAY, MSBY, and more.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="btn-primary px-8 py-3.5">
                    <CalendarCheck size={16} />
                    Book OPD Appointment
                  </button>
                  <button className="btn-outline-white px-8 py-3.5">
                    Emergency: 108
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DoctorsPage;
