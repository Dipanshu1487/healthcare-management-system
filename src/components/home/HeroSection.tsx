import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Phone,
  HeartPulse,
  Shield,
  Stethoscope,
  ArrowRight,
  Star,
} from "lucide-react";

// ─── Hero Section helpers ─────────────────────────────────────────────────────

// ─── Quick stat pill (inside hero) ───────────────────────────────────────────
interface HeroStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay?: string;
}
const HeroStat: React.FC<HeroStatProps> = ({ label, value, icon, delay = "" }) => (
  <div className={`opacity-initial animate-fade-in-up ${delay} flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 min-w-[140px]`}>
    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-lg font-bold text-white font-display leading-none">{value}</div>
      <div className="text-[11px] text-blue-100 mt-0.5">{label}</div>
    </div>
  </div>
);

// ─── Trust Badge ──────────────────────────────────────────────────────────────
interface TrustBadgeProps { icon: React.ReactNode; text: string }
const TrustBadge: React.FC<TrustBadgeProps> = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-white/80 text-xs">
    <span className="text-chc-teal-300">{icon}</span>
    <span>{text}</span>
  </div>
);

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start animations after brief delay
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[88vh] flex items-center"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e3a8a 45%, #0f766e 100%)",
      }}
    >
      {/* ── Background decorative elements ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #0d9488, transparent 70%)" }} />
        <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }} />

        {/* Floating medical cross */}
        <div className="absolute top-16 right-16 opacity-5 text-white text-9xl font-bold select-none hidden lg:block animate-float">
          +
        </div>
        <div className="absolute bottom-20 left-20 opacity-5 text-white text-7xl font-bold select-none hidden lg:block animate-float delay-300" style={{ animationDelay: "1.5s" }}>
          +
        </div>
      </div>

      <div className="page-container relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Left Column ── */}
          <div className="space-y-8">
            {/* Label badge */}
            <div className={`opacity-initial ${visible ? "animate-fade-in-up" : ""} inline-flex items-center gap-2`}>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-white tracking-wide">
                  Govt. of Jharkhand · Community Health Centre
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className={`opacity-initial ${visible ? "animate-fade-in-up delay-100" : ""} space-y-4`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white leading-[1.1] tracking-tight">
                Your Health,{" "}
                <span
                  className="block bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #34d399 100%)" }}
                >
                  Our Mission
                </span>
              </h1>
              <p className="text-base md:text-lg text-blue-100 leading-relaxed max-w-lg">
                CHC Bharno delivers accessible, high-quality healthcare to the communities of Bharno Block, Gumla District — powered by compassionate doctors and government health schemes.
              </p>
            </div>

            {/* Trust badges */}
            <div className={`opacity-initial ${visible ? "animate-fade-in-up delay-200" : ""} flex flex-wrap gap-x-6 gap-y-2`}>
              <TrustBadge icon={<Shield size={12} />} text="NHSRC Accredited" />
              <TrustBadge icon={<Star size={12} />} text="4.9★ Patient Rating" />
              <TrustBadge icon={<HeartPulse size={12} />} text="24/7 Emergency" />
              <TrustBadge icon={<Stethoscope size={12} />} text="28+ Specialists" />
            </div>

            {/* CTA Buttons */}
            <div className={`opacity-initial ${visible ? "animate-fade-in-up delay-300" : ""} flex flex-wrap gap-4`}>
              <Link
                to="/appointment"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 group"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #0d9488)",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
                }}
              >
                <CalendarCheck size={16} />
                Book Appointment
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:108"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border-2 border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50"
              >
                <Phone size={16} className="text-green-300" />
                Emergency: 108
              </a>
            </div>

            {/* Hero mini-stats */}
            <div className={`opacity-initial ${visible ? "animate-fade-in-up delay-400" : ""} flex flex-wrap gap-3`}>
              <HeroStat
                label="Patients Served"
                value="45K+"
                icon={<HeartPulse size={16} className="text-blue-300" />}
              />
              <HeroStat
                label="Free Treatment"
                value="PM-JAY"
                icon={<Shield size={16} className="text-teal-300" />}
                delay="delay-100"
              />
              <HeroStat
                label="Departments"
                value="8 Depts"
                icon={<Stethoscope size={16} className="text-purple-300" />}
                delay="delay-200"
              />
            </div>
          </div>

          {/* ── Right Column — Visual Card Stack ── */}
          <div className={`opacity-initial ${visible ? "animate-fade-in-up delay-200" : ""} relative hidden lg:block`}>
            {/* Main card */}
            <div className="relative glass-card rounded-3xl p-6 shadow-2xl max-w-sm mx-auto animate-float">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-600">Today's OPD — Live</span>
                </div>
                <span className="text-xs text-slate-400">July 1, 2026</span>
              </div>

              {/* Doctor cards */}
              {[
                { name: "Dr. Priya Sharma", dept: "General Medicine", time: "10:00 AM", status: "Consulting", color: "#2563eb", initials: "PS" },
                { name: "Dr. Rakesh Kumar", dept: "Maternal & Child", time: "11:30 AM", status: "Available", color: "#0d9488", initials: "RK" },
                { name: "Dr. Anita Singh", dept: "Emergency", time: "Now", status: "On Duty", color: "#dc2626", initials: "AS" },
              ].map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl mb-2 last:mb-0 transition-colors hover:bg-slate-50"
                  style={{ background: i === 0 ? `${doc.color}08` : undefined }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: doc.color }}
                  >
                    {doc.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{doc.name}</div>
                    <div className="text-xs text-slate-500">{doc.dept} · {doc.time}</div>
                  </div>
                  <span
                    className="text-[10px] font-medium px-2 py-1 rounded-full whitespace-nowrap"
                    style={{
                      background: `${doc.color}15`,
                      color: doc.color,
                    }}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}

              {/* Book slot button */}
              <Link
                to="/appointment"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2563eb, #0d9488)" }}
              >
                <CalendarCheck size={15} />
                Book a Slot — Free OPD
              </Link>
            </div>

            {/* Floating mini card — Emergency */}
            <div className="absolute -bottom-6 -left-8 glass-card rounded-2xl p-4 shadow-xl flex items-center gap-3 max-w-[180px] animate-float" style={{ animationDelay: "0.8s" }}>
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <HeartPulse size={18} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">108</div>
                <div className="text-[10px] text-slate-500">Ambulance Ready</div>
              </div>
            </div>

            {/* Floating mini card — Schemes */}
            <div className="absolute -top-6 -right-4 glass-card rounded-2xl p-4 shadow-xl flex items-center gap-3 max-w-[190px] animate-float" style={{ animationDelay: "0.4s" }}>
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">PM-JAY</div>
                <div className="text-[10px] text-slate-500">Free ₹5L Coverage</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll Indicator ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] text-white tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
