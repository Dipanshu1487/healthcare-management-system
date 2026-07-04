import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import StatisticsSection from "../components/home/StatisticsSection";
import WhyUsSection from "../components/home/WhyUsSection";

// ─── Quick Appointment Banner ─────────────────────────────────────────────────
import { Link } from "react-router-dom";
import { CalendarCheck, ArrowRight, Tent, ShieldCheck } from "lucide-react";

const QuickLinks: React.FC = () => (
  <section className="py-12 bg-white border-b border-slate-100">
    <div className="page-container">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <CalendarCheck size={20} className="text-blue-600" />,
            title: "Book OPD Appointment",
            desc: "Register online in 2 minutes",
            href: "/appointment",
            bg: "bg-blue-50",
            border: "border-blue-100",
            cta: "Book Now",
          },
          {
            icon: <ShieldCheck size={20} className="text-teal-600" />,
            title: "Health Scheme Eligibility",
            desc: "Check your PM-JAY & state benefits",
            href: "/schemes",
            bg: "bg-teal-50",
            border: "border-teal-100",
            cta: "Check Now",
          },
          {
            icon: <Tent size={20} className="text-purple-600" />,
            title: "Upcoming Health Camps",
            desc: "Free camps near your village",
            href: "/health-camps",
            bg: "bg-purple-50",
            border: "border-purple-100",
            cta: "View Camps",
          },
          {
            icon: <ArrowRight size={20} className="text-amber-600" />,
            title: "Find a Doctor",
            desc: "Browse specialist availability",
            href: "/doctors",
            bg: "bg-amber-50",
            border: "border-amber-100",
            cta: "Find Doctor",
          },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.href}
            className={`group flex items-center gap-4 p-4 rounded-2xl border ${item.bg} ${item.border} hover:shadow-card transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800">{item.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
            </div>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// ─── Home Page ────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>CHC Bharno — Community Health Centre | Quality Healthcare in Jharkhand</title>
        <meta
          name="description"
          content="Community Health Centre Bharno provides free and subsidized healthcare services to Gumla District, Jharkhand. Book OPD appointments, check PM-JAY eligibility, and explore our health camps."
        />
        <meta name="keywords" content="CHC Bharno, Community Health Centre, Gumla Hospital, Jharkhand Health, PM-JAY, Free Treatment, OPD Appointment" />
      </Helmet>

      <main>
        <HeroSection />
        <QuickLinks />
        <ServicesSection />
        <StatisticsSection />
        <WhyUsSection />
      </main>
    </>
  );
};

export default HomePage;
