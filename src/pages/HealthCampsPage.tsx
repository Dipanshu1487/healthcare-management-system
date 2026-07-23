import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Tent,
  MapPin,
  Clock,
  Users,
  CalendarDays,
  ChevronRight,
  Eye,
  Heart,
  Activity,
  Phone,
  CheckCircle2,
  ArrowRight,
  Building2,
  Star,
  BookOpen,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { cn } from "../lib/utils";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface UpcomingCamp {
  id: number;
  title: string;
  day: string;
  month: string;
  year: string;
  fullDate: string;
  location: string;
  time: string;
  organizer: string;
  services: string[];
  capacity: number;
  registered: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface PreviousCamp {
  id: number;
  title: string;
  date: string;
  location: string;
  beneficiaries: number;
  beneficiaryLabel: string;
  services: string[];
  initials: string;
  gradientFrom: string;
  gradientTo: string;
}

interface GalleryPlaceholder {
  id: number;
  label: string;
  gradientFrom: string;
  gradientTo: string;
  initials: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const upcomingCamps: UpcomingCamp[] = [
  {
    id: 1,
    title: "Free Eye Check-up Camp",
    day: "15",
    month: "JUL",
    year: "2026",
    fullDate: "July 15, 2026",
    location: "Panigarha Village, Bharno Block",
    time: "9:00 AM – 2:00 PM",
    organizer: "CHC Bharno & District Eye Unit",
    services: ["Eye Testing", "Free Spectacles", "Cataract Screening"],
    capacity: 200,
    registered: 134,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-100",
    icon: <Eye size={20} className="text-blue-600" />,
  },
  {
    id: 2,
    title: "Maternal Health & Nutrition Camp",
    day: "20",
    month: "JUL",
    year: "2026",
    fullDate: "July 20, 2026",
    location: "Sisai Block, Gumla",
    time: "10:00 AM – 3:00 PM",
    organizer: "NHM Jharkhand & CHC Bharno",
    services: ["ANC Checkup", "Iron-Folic Acid", "Counseling"],
    capacity: 150,
    registered: 89,
    color: "text-rose-600",
    bgColor: "bg-rose-50 border-rose-100",
    icon: <Heart size={20} className="text-rose-600" />,
  },
  {
    id: 3,
    title: "Diabetes & BP Screening Camp",
    day: "05",
    month: "AUG",
    year: "2026",
    fullDate: "August 5, 2026",
    location: "CHC Bharno Campus",
    time: "8:00 AM – 12:00 PM",
    organizer: "CHC Bharno Medical Team",
    services: ["Blood Sugar Test", "BP Check", "Lifestyle Counseling"],
    capacity: 300,
    registered: 62,
    color: "text-teal-600",
    bgColor: "bg-teal-50 border-teal-100",
    icon: <Activity size={20} className="text-teal-600" />,
  },
];

const previousCamps: PreviousCamp[] = [
  {
    id: 1,
    title: "Diabetes Screening",
    date: "June 20, 2026",
    location: "CHC Bharno",
    beneficiaries: 287,
    beneficiaryLabel: "beneficiaries",
    services: ["Blood Sugar Test", "HbA1c", "Diet Counseling"],
    initials: "DS",
    gradientFrom: "#2563eb",
    gradientTo: "#0d9488",
  },
  {
    id: 2,
    title: "School Health Drive",
    date: "June 10, 2026",
    location: "Govt Schools, Bharno",
    beneficiaries: 462,
    beneficiaryLabel: "children",
    services: ["General Checkup", "Vision Test", "De-worming"],
    initials: "SH",
    gradientFrom: "#7c3aed",
    gradientTo: "#2563eb",
  },
  {
    id: 3,
    title: "TB Awareness Camp",
    date: "May 28, 2026",
    location: "Sisai Block",
    beneficiaries: 178,
    beneficiaryLabel: "beneficiaries",
    services: ["TB Screening", "Nikshay Enrollment", "Awareness Talk"],
    initials: "TB",
    gradientFrom: "#ea580c",
    gradientTo: "#d97706",
  },
  {
    id: 4,
    title: "Dental Camp",
    date: "May 15, 2026",
    location: "Panigarha Village",
    beneficiaries: 95,
    beneficiaryLabel: "patients",
    services: ["Dental Checkup", "Scaling", "Extraction"],
    initials: "DC",
    gradientFrom: "#0d9488",
    gradientTo: "#059669",
  },
  {
    id: 5,
    title: "Anemia Screening",
    date: "April 22, 2026",
    location: "Bharno Town",
    beneficiaries: 320,
    beneficiaryLabel: "women",
    services: ["Hb Test", "Iron Supplementation", "Nutrition Counseling"],
    initials: "AS",
    gradientFrom: "#db2777",
    gradientTo: "#9333ea",
  },
  {
    id: 6,
    title: "Vision Screening",
    date: "March 30, 2026",
    location: "Gumla Block",
    beneficiaries: 210,
    beneficiaryLabel: "children",
    services: ["Vision Test", "Glasses Distribution", "Referral"],
    initials: "VS",
    gradientFrom: "#0284c7",
    gradientTo: "#0d9488",
  },
];

const galleryPlaceholders: GalleryPlaceholder[] = [
  { id: 1, label: "Eye Camp — Panigarha", initials: "EC", gradientFrom: "#2563eb", gradientTo: "#60a5fa" },
  { id: 2, label: "School Health Drive", initials: "SH", gradientFrom: "#7c3aed", gradientTo: "#a78bfa" },
  { id: 3, label: "TB Awareness Session", initials: "TB", gradientFrom: "#ea580c", gradientTo: "#fbbf24" },
  { id: 4, label: "Dental Camp — Village", initials: "DC", gradientFrom: "#0d9488", gradientTo: "#34d399" },
  { id: 5, label: "Anemia Screening", initials: "AS", gradientFrom: "#db2777", gradientTo: "#f472b6" },
  { id: 6, label: "Maternal Health Camp", initials: "MH", gradientFrom: "#0284c7", gradientTo: "#38bdf8" },
];

// ─── useIntersection Hook ─────────────────────────────────────────────────────
function useIntersection(threshold = 0.15) {
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

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar: React.FC = () => {
  const { ref, visible } = useIntersection();
  const stats = [
    { value: "120+", label: "Camps Conducted", icon: <Tent size={22} className="text-blue-600" /> },
    { value: "35,000+", label: "Beneficiaries Served", icon: <Users size={22} className="text-teal-600" /> },
    { value: "28", label: "Villages Covered", icon: <MapPin size={22} className="text-purple-600" /> },
  ];

  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="page-container">
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold font-display gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Upcoming Camps ───────────────────────────────────────────────────────────
const UpcomingCamps: React.FC = () => {
  const { ref, visible } = useIntersection();

  return (
    <section className="section-pad bg-slate-50">
      <div className="page-container">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="section-label mb-4">
            <CalendarDays size={14} />
            Upcoming Events
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mt-4">
            Register for a <span className="gradient-text">Free Health Camp</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Our upcoming camps are free and open to all. Register early to secure your spot.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {upcomingCamps.map((camp, i) => {
            const pct = Math.round((camp.registered / camp.capacity) * 100);
            return (
              <div
                key={camp.id}
                className={cn(
                  "card-premium flex flex-col transition-all duration-700",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Top row: Date badge + Upcoming pill */}
                <div className="flex items-start justify-between mb-5">
                  {/* Date box */}
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${i === 0 ? "#2563eb, #1d4ed8" : i === 1 ? "#e11d48, #be123c" : "#0d9488, #0f766e"})` }}
                  >
                    <span className="text-2xl font-bold font-display leading-none">{camp.day}</span>
                    <span className="text-[10px] font-semibold tracking-widest uppercase opacity-90 mt-0.5">{camp.month}</span>
                  </div>
                  <span className="badge-green flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Upcoming
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold font-display text-slate-900 mb-3 leading-snug">
                  {camp.title}
                </h3>

                {/* Meta */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{camp.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{camp.organizer}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {camp.services.map((s, si) => (
                    <span
                      key={si}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span><span className="font-semibold text-slate-700">{camp.registered}</span> registered</span>
                    <span>Capacity: {camp.capacity}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pct > 80 ? "linear-gradient(90deg,#ef4444,#f97316)" : "linear-gradient(90deg,#2563eb,#0d9488)",
                      }}
                    />
                  </div>
                  <div className="text-right text-xs text-slate-400 mt-1">{pct}% filled</div>
                </div>

                {/* CTA */}
                <button className="btn-primary w-full">
                  <CalendarDays size={15} />
                  Register Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Previous Camps Timeline ──────────────────────────────────────────────────
const CampTimeline: React.FC = () => {
  const { ref, visible } = useIntersection(0.05);

  return (
    <section className="section-pad bg-white">
      <div className="page-container">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="section-label mb-4">
            <BookOpen size={14} />
            Track Record
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mt-4">
            Previous <span className="gradient-text">Camp Timeline</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            A look back at our successful health camps and the communities we've served.
          </p>
        </div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          {/* Center line — desktop only */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-teal-200 to-slate-100 -translate-x-px" />

          <div className="space-y-10 lg:space-y-0">
            {previousCamps.map((camp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={camp.id}
                  className={cn(
                    "lg:flex lg:items-center lg:gap-8 transition-all duration-700",
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Card */}
                  <div className="lg:w-[calc(50%-2.5rem)] mb-6 lg:mb-12">
                    <div className="card-premium flex gap-4">
                      {/* Initials avatar */}
                      <div
                        className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold font-display shadow-md"
                        style={{ background: `linear-gradient(135deg, ${camp.gradientFrom}, ${camp.gradientTo})` }}
                      >
                        {camp.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h3 className="font-bold font-display text-slate-900">{camp.title}</h3>
                          <span className="badge-blue text-nowrap">{camp.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                          <MapPin size={12} />
                          {camp.location}
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-teal-500" />
                            <span className="text-sm font-semibold text-slate-800">{camp.beneficiaries.toLocaleString()}</span>
                            <span className="text-xs text-slate-400">{camp.beneficiaryLabel}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {camp.services.map((s, si) => (
                            <span key={si} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center dot — desktop */}
                  <div className="hidden lg:flex flex-shrink-0 w-5 h-5 rounded-full border-4 border-white shadow-md z-10"
                    style={{ background: `linear-gradient(135deg, ${camp.gradientFrom}, ${camp.gradientTo})` }}
                  />

                  {/* Spacer for the other side */}
                  <div className="hidden lg:block lg:w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Gallery Strip ────────────────────────────────────────────────────────────
const GalleryStrip: React.FC = () => {
  const { ref, visible } = useIntersection();

  return (
    <section className="section-pad bg-slate-50">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="section-label mb-4">
            <Star size={14} />
            Camp Moments
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mt-4">
            Recent <span className="gradient-text">Camp Gallery</span>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryPlaceholders.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all duration-700",
                visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl font-bold text-white/80 font-display">{item.initials}</span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium leading-snug">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/gallery" className="btn-outline inline-flex items-center gap-2">
            View Full Gallery
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Registration CTA ─────────────────────────────────────────────────────────
const RegistrationCTA: React.FC = () => {
  const { ref, visible } = useIntersection();

  return (
    <section className="py-20">
      <div className="page-container">
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-3xl p-10 md:p-14 text-center transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #0f766e 100%)" }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #0d9488, transparent)" }} />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Tent size={28} className="text-teal-300" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              How to Register for a Camp?
            </h2>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              To register for any upcoming health camp, visit the CHC Bharno OPD Registration Counter
              or call our helpline. Registration is completely <strong className="text-white">free of charge</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:104"
                className="btn-teal"
              >
                <Phone size={16} />
                Call 104 (NHM Helpline)
              </a>
              <a href="/contact" className="btn-outline-white">
                Visit CHC Bharno OPD
                <ChevronRight size={15} />
              </a>
            </div>

            <p className="text-blue-200 text-sm mt-6">
              📍 CHC Bharno, Near Bharno Bus Stand, NH-75, Bharno Block, Gumla District, Jharkhand – 835209
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const HealthCampsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Health Camps — CHC Bharno | Free Medical Camps in Gumla, Jharkhand</title>
        <meta
          name="description"
          content="CHC Bharno conducts free health camps across 28 villages in Gumla District. Register for upcoming Eye, Maternal Health, and Diabetes Screening camps."
        />
        <meta
          name="keywords"
          content="Health Camps Bharno, Free Eye Camp Jharkhand, Maternal Health Camp, Diabetes Screening Gumla, CHC Bharno Camps"
        />
      </Helmet>

      <main>
        <PageHeader
          title="Health Camps"
          subtitle="Bringing free, quality healthcare directly to the doorstep of every village in Gumla District."
          badge="120+ Camps Conducted"
          breadcrumbs={[{ label: "Health Camps" }]}
        />
        <StatsBar />
        <UpcomingCamps />
        <CampTimeline />
        <GalleryStrip />
        <RegistrationCTA />
      </main>
    </>
  );
};

export { HealthCampsPage };
export default HealthCampsPage;
