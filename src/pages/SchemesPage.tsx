import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  Shield,
  ShieldCheck,
  Baby,
  Heart,
  Syringe,
  FlaskConical,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  MapPin,
  AlertCircle,
  ChevronRight,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { cn } from "../lib/utils";

// ─── Interfaces ───────────────────────────────────────────────────────────────
type SchemeType = "Central" | "State";
type FilterTab = "All" | "Central" | "State";

interface Scheme {
  id: number;
  name: string;
  shortName: string;
  type: SchemeType;
  icon: React.ReactNode;
  coverage: string;
  beneficiaryCount?: string;
  eligibility: string[];
  benefits: string[];
  accentColor: string;
  bgColor: string;
  iconBg: string;
  featured?: boolean;
}

// ─── Schemes Data ─────────────────────────────────────────────────────────────
const schemesData: Scheme[] = [
  {
    id: 1,
    name: "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana",
    shortName: "PM-JAY",
    type: "Central",
    icon: <ShieldCheck size={22} />,
    coverage: "₹5 Lakh / family / year",
    beneficiaryCount: "50 Crore+ Beneficiaries",
    eligibility: [
      "BPL (Below Poverty Line) families",
      "SECC 2011 database listed households",
      "No restriction on family size or age",
    ],
    benefits: [
      "Cashless hospitalization at empanelled hospitals",
      "Pre & post-hospitalization expenses covered",
      "ICU, surgery, daycare procedures included",
      "Free medicines, diagnostics & follow-up",
    ],
    accentColor: "#2563eb",
    bgColor: "#eff6ff",
    iconBg: "bg-blue-600",
    featured: true,
  },
  {
    id: 2,
    name: "Mukhyamantri Swasthya Bima Yojana",
    shortName: "MSBY Jharkhand",
    type: "State",
    icon: <Shield size={22} />,
    coverage: "₹5 Lakh / family / year",
    beneficiaryCount: "60 Lakh+ Families in Jharkhand",
    eligibility: [
      "Jharkhand domicile BPL card holders",
      "Ration card registered families",
      "Excluded from PM-JAY or supplementary coverage",
    ],
    benefits: [
      "Secondary & tertiary care hospitalization",
      "Cashless treatment at government & listed hospitals",
      "Transport allowance for referral cases",
      "Covers pre-existing conditions",
    ],
    accentColor: "#0d9488",
    bgColor: "#f0fdfa",
    iconBg: "bg-teal-600",
  },
  {
    id: 3,
    name: "Janani Suraksha Yojana",
    shortName: "JSY",
    type: "Central",
    icon: <Baby size={22} />,
    coverage: "Cash ₹1,400 – ₹1,800 per delivery",
    beneficiaryCount: "1 Crore+ Mothers/year",
    eligibility: [
      "All pregnant women in BPL households",
      "SC/ST women regardless of income",
      "Women aged 19 years and above",
    ],
    benefits: [
      "Cash incentive for institutional delivery",
      "₹1,400 for rural areas, ₹1,000 for urban",
      "Additional ASHA worker incentive of ₹600",
      "Linked with free delivery under JSSK",
    ],
    accentColor: "#db2777",
    bgColor: "#fdf2f8",
    iconBg: "bg-pink-500",
  },
  {
    id: 4,
    name: "Janani Shishu Suraksha Karyakram",
    shortName: "JSSK",
    type: "Central",
    icon: <Heart size={22} />,
    coverage: "Fully Free — No Out-of-Pocket Cost",
    beneficiaryCount: "All Pregnant Women in India",
    eligibility: [
      "All pregnant women delivering at government facilities",
      "Sick newborns up to 30 days after delivery",
      "No income or BPL criteria required",
    ],
    benefits: [
      "Free normal delivery and C-section",
      "Free medicines, consumables & diet during stay",
      "Free diagnostic investigations",
      "Free transport from home to facility & back",
    ],
    accentColor: "#dc2626",
    bgColor: "#fff1f2",
    iconBg: "bg-red-500",
  },
  {
    id: 5,
    name: "Mission Indradhanush",
    shortName: "Mission Indradhanush",
    type: "Central",
    icon: <Syringe size={22} />,
    coverage: "Free Immunization — All Vaccines",
    beneficiaryCount: "Children 0–2 yrs + Pregnant Women",
    eligibility: [
      "Children from 0 to 2 years of age",
      "Pregnant women for tetanus & other vaccines",
      "Left-out or drop-out children prioritized",
    ],
    benefits: [
      "12 vaccine-preventable diseases covered",
      "BCG, OPV, DPT, Hepatitis B, Measles, etc.",
      "Free vaccines at CHC & outreach camps",
      "Immunization card issued to every child",
    ],
    accentColor: "#16a34a",
    bgColor: "#f0fdf4",
    iconBg: "bg-emerald-600",
  },
  {
    id: 6,
    name: "Pradhan Mantri Surakshit Matritva Abhiyan",
    shortName: "PMSMA",
    type: "Central",
    icon: <Star size={22} />,
    coverage: "Free Antenatal Checkup — Monthly",
    beneficiaryCount: "Every Pregnant Woman in India",
    eligibility: [
      "All pregnant women from 4th month onward",
      "No income or BPL criteria needed",
      "Services available on 9th of every month",
    ],
    benefits: [
      "Quality ANC by specialist / MO on 9th",
      "Full physical examination & vitals check",
      "Free blood tests: Hb, Blood Sugar, Urine",
      "High-risk pregnancy identification & referral",
    ],
    accentColor: "#d97706",
    bgColor: "#fffbeb",
    iconBg: "bg-amber-500",
  },
  {
    id: 7,
    name: "NIKSHAY Poshan Yojana (National TB Programme)",
    shortName: "NIKSHAY Poshan",
    type: "Central",
    icon: <FlaskConical size={22} />,
    coverage: "₹500 / month during treatment",
    beneficiaryCount: "All TB Patients in India",
    eligibility: [
      "All notified TB patients registered on NIKSHAY",
      "Drug-sensitive and drug-resistant TB",
      "Treatment duration: 6 months – 2 years",
    ],
    benefits: [
      "₹500/month DBT directly to patient's account",
      "Free first-line anti-TB drugs (DOTS)",
      "Free diagnostic tests: sputum, X-ray, CBNAAT",
      "Nutritional support for treatment adherence",
    ],
    accentColor: "#7c3aed",
    bgColor: "#f5f3ff",
    iconBg: "bg-violet-600",
  },
  {
    id: 8,
    name: "Rashtriya Bal Swasthya Karyakram",
    shortName: "RBSK",
    type: "Central",
    icon: <Users size={22} />,
    coverage: "Free Screening & Treatment (0–18 yrs)",
    beneficiaryCount: "27 Crore+ Children Nationwide",
    eligibility: [
      "All children from 0 to 18 years",
      "Newborns screened at delivery facilities",
      "School-going children via DEIC teams",
    ],
    benefits: [
      "Screening for 4D: Defects, Deficiencies, Diseases, Developmental Delays",
      "30 health conditions covered including congenital defects",
      "Free corrective surgery, hearing aids, spectacles",
      "DEIC (District Early Intervention Centres) referral support",
    ],
    accentColor: "#0369a1",
    bgColor: "#f0f9ff",
    iconBg: "bg-sky-600",
  },
];

// ─── Featured Scheme Banner ───────────────────────────────────────────────────
const FeaturedSchemeBanner: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("animate-fade-in-up");
            el.classList.remove("opacity-initial");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="opacity-initial">
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)",
        }}
      >
        {/* Orbs */}
        <div
          className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #2dd4bf, transparent)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Icon + badge */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <ShieldCheck size={36} className="text-blue-300" />
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ background: "rgba(255,255,255,0.12)", color: "#fde68a", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <Sparkles size={10} /> Featured · Most Popular
                </span>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  Central Government Scheme
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-xl md:text-3xl font-bold font-display text-white leading-tight mb-1">
                Ayushman Bharat – PM-JAY
              </h2>
              <p className="text-blue-200 text-sm mb-5 max-w-2xl">
                World's largest government-funded health insurance scheme. Provides ₹5 Lakh annual coverage per family for secondary and tertiary hospitalization — completely cashless.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: <IndianRupee size={14} />, label: "Coverage", value: "₹5 Lakh/family/yr" },
                  { icon: <Users size={14} />, label: "Beneficiaries", value: "50 Crore+" },
                  { icon: <MapPin size={14} />, label: "Hospitals", value: "25,000+ Empanelled" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <div className="flex items-center gap-1.5 text-blue-300 text-xs mb-1">
                      {stat.icon}
                      {stat.label}
                    </div>
                    <div className="text-white font-bold text-sm font-display">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Bullets */}
              <div className="grid sm:grid-cols-2 gap-2 mb-6">
                {[
                  "Cashless hospitalization at CHC Bharno",
                  "Pre & post-hospitalization covered",
                  "ICU, surgery, daycare procedures",
                  "Free medicines & diagnostics",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {point}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-lg px-6 py-2.5"
                  style={{ background: "#ffffff", color: "#1d4ed8", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                  <CheckCircle size={15} />
                  Check Eligibility
                </button>
                <button className="btn-outline-white px-6 py-2.5 text-xs">
                  Learn More
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Scheme Card ──────────────────────────────────────────────────────────────
const SchemeCard: React.FC<{ scheme: Scheme; index: number }> = ({ scheme, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("animate-fade-in-up");
            el.classList.remove("opacity-initial");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-initial bg-white rounded-2xl overflow-hidden transition-all duration-300 group"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
        animationDelay: `${(index % 4) * 100}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.1), 0 24px 56px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)";
      }}
    >
      {/* Left accent border */}
      <div className="flex">
        <div
          className="w-1 flex-shrink-0 rounded-l-2xl"
          style={{ background: scheme.accentColor }}
        />

        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            {/* Icon */}
            <div
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white",
                scheme.iconBg
              )}
            >
              {scheme.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-800 font-display leading-snug">
                  {scheme.name}
                </h3>
                <span
                  className={cn(
                    "flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full",
                    scheme.type === "Central"
                      ? "badge-blue"
                      : "badge-teal"
                  )}
                >
                  {scheme.type}
                </span>
              </div>

              {/* Coverage */}
              <div
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: scheme.bgColor, color: scheme.accentColor }}
              >
                <IndianRupee size={12} />
                {scheme.coverage}
              </div>
            </div>
          </div>

          {/* Beneficiary count */}
          {scheme.beneficiaryCount && (
            <div className="flex items-center gap-1.5 mb-4 text-xs text-slate-500">
              <Users size={12} className="text-slate-400" />
              {scheme.beneficiaryCount}
            </div>
          )}

          {/* Eligibility */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Eligibility
            </p>
            <ul className="space-y-1.5">
              {scheme.eligibility.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <AlertCircle
                    size={12}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: scheme.accentColor }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Key Benefits
            </p>
            <ul className="space-y-1.5">
              {scheme.benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle
                    size={12}
                    className="flex-shrink-0 mt-0.5 text-emerald-500"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              className="btn-primary flex-1 py-2.5 text-xs"
              style={{
                background: `linear-gradient(135deg, ${scheme.accentColor} 0%, ${scheme.accentColor}cc 100%)`,
                boxShadow: `0 4px 14px ${scheme.accentColor}40`,
              }}
            >
              <CheckCircle size={13} />
              Check Eligibility
            </button>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors flex-shrink-0">
              Learn More
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Eligibility CTA Section ──────────────────────────────────────────────────
const EligibilityCTA: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("animate-fade-in-up");
            el.classList.remove("opacity-initial");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-pad bg-slate-50">
      <div className="page-container">
        <div
          ref={ref}
          className="opacity-initial rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)", border: "1px solid #bbf7d0" }}
        >
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <span className="section-label mb-4 inline-flex">
                  <ShieldCheck size={13} />
                  Eligibility Checker
                </span>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-800 mb-4">
                  Are You Eligible for{" "}
                  <span className="gradient-text">Free Healthcare?</span>
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Most government schemes require only your Ration Card, Aadhaar Card, or BPL certificate. Our OPD desk team will help you register and avail benefits within minutes — at no cost.
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { icon: <CheckCircle size={15} className="text-emerald-500" />, text: "Bring your Aadhaar Card / Ration Card" },
                    { icon: <CheckCircle size={15} className="text-emerald-500" />, text: "Visit OPD Registration Desk (Mon – Sat, 8 AM – 2 PM)" },
                    { icon: <CheckCircle size={15} className="text-emerald-500" />, text: "Our ASHA / ANM worker will assist you free of charge" },
                    { icon: <CheckCircle size={15} className="text-emerald-500" />, text: "Get enrolled in PM-JAY, MSBY, JSY & other schemes same day" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      {item.icon}
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="btn-teal px-6 py-3">
                    <MapPin size={15} />
                    Visit OPD Desk
                  </button>
                  <button className="btn-outline px-6 py-3">
                    Call: 06524-XXXXXX
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Right — scheme icons */}
              <div className="grid grid-cols-2 gap-4">
                {schemesData.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-white flex flex-col gap-3 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                        s.iconBg
                      )}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 leading-tight">{s.shortName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.type}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-lg self-start"
                      style={{ background: s.bgColor, color: s.accentColor }}
                    >
                      {s.coverage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SchemeSummaryStrip: React.FC = () => (
  <div className="bg-white border-b border-slate-100 py-8">
    <div className="page-container">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
        {[
          { icon: <ShieldCheck size={20} className="text-blue-600" />, value: "15+", label: "Active Schemes" },
          { icon: <IndianRupee size={20} className="text-teal-600" />, value: "₹5 Lakh", label: "Max Coverage / Year" },
          { icon: <Users size={20} className="text-emerald-600" />, value: "100%", label: "Free at CHC Bharno" },
          { icon: <CheckCircle size={20} className="text-amber-500" />, value: "Same Day", label: "Enrollment Available" },
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

// ─── Schemes Page ─────────────────────────────────────────────────────────────
const SchemesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const tabs: FilterTab[] = ["All", "Central", "State"];

  const filteredSchemes = schemesData.filter((s) => {
    if (activeTab === "All") return true;
    return s.type === activeTab;
  });

  // Non-featured schemes for the grid
  const gridSchemes = filteredSchemes.filter((s) => !s.featured || activeTab !== "All");

  return (
    <>
      <Helmet>
        <title>Government Health Schemes — CHC Bharno | PM-JAY, MSBY, JSY & More</title>
        <meta
          name="description"
          content="Explore 15+ central and state government health schemes available at CHC Bharno, Jharkhand. Check eligibility for PM-JAY, MSBY, Janani Suraksha Yojana, and more — all free."
        />
        <meta
          name="keywords"
          content="PM-JAY Bharno, Ayushman Bharat Jharkhand, MSBY health scheme, Janani Suraksha Yojana, free health scheme Gumla, CHC Bharno schemes"
        />
      </Helmet>

      <main>
        {/* Page Header */}
        <PageHeader
          title="Government Health Schemes"
          subtitle="Access 15+ central and state government health schemes at CHC Bharno — completely free. From maternity benefits to TB nutritional support, know your entitlements."
          badge="15+ Schemes · 100% Free"
          breadcrumbs={[{ label: "Health Schemes" }]}
        />

        {/* Summary Strip */}
        <SchemeSummaryStrip />

        {/* Category Tabs */}
        <section className="bg-white border-b border-slate-100 sticky top-[64px] z-30">
          <div className="page-container py-4">
            <div className="flex items-center gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200",
                    activeTab === tab
                      ? "text-white border-transparent shadow-md"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-white"
                  )}
                  style={
                    activeTab === tab
                      ? { background: "linear-gradient(135deg, #2563eb 0%, #0d9488 100%)" }
                      : {}
                  }
                >
                  {tab === "All" ? "All Schemes" : `${tab} Govt.`}
                  <span
                    className={cn(
                      "ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold",
                      activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {tab === "All"
                      ? schemesData.length
                      : schemesData.filter((s) => s.type === tab).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Banner — only when All tab or Central tab */}
        {(activeTab === "All" || activeTab === "Central") && (
          <section className="section-pad pb-0">
            <div className="page-container">
              <div className="mb-6">
                <span className="section-label">
                  <Star size={13} />
                  Featured Scheme
                </span>
              </div>
              <FeaturedSchemeBanner />
            </div>
          </section>
        )}

        {/* Schemes Grid */}
        <section className="section-pad bg-slate-50">
          <div className="page-container">
            {/* Section header */}
            <div className="mb-10">
              <span className="section-label mb-4 inline-flex">
                <Shield size={13} />
                {activeTab === "All" ? "All Health Schemes" : `${activeTab} Government Schemes`}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-800 mt-3">
                {activeTab === "All"
                  ? "Schemes Available at CHC Bharno"
                  : `${activeTab} Government Schemes`}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Showing{" "}
                <span className="font-semibold text-slate-700">{gridSchemes.length}</span>{" "}
                scheme{gridSchemes.length !== 1 ? "s" : ""}. All available at CHC Bharno — visit OPD desk to enroll.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridSchemes.map((scheme, i) => (
                <SchemeCard key={scheme.id} scheme={scheme} index={i} />
              ))}

              {gridSchemes.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield size={28} className="text-slate-300" />
                  </div>
                  <p className="text-slate-600 font-semibold">No schemes found</p>
                  <p className="text-sm text-slate-400 mt-1">Try a different category.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Eligibility CTA */}
        <EligibilityCTA />

        {/* Info banner */}
        <section className="py-12 bg-white">
          <div className="page-container">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Important Information</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All schemes listed are operational at CHC Bharno as of 2026. Benefits and eligibility criteria are subject to change per Government of India and Jharkhand Government notifications. For the latest updates, contact our OPD desk or call our helpline. Enrollment assistance is available free of charge.
                </p>
              </div>
              <button className="btn-outline text-xs px-5 py-2.5 flex-shrink-0">
                Contact Us
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SchemesPage;
