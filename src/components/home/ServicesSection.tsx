import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Baby,
  Ambulance,
  Smile,
  Eye,
  Apple,
  FlaskConical,
  Brain,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { departments } from "../../data/dummyData";
import { cn } from "../../lib/utils";

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope size={24} strokeWidth={1.8} />,
  Baby: <Baby size={24} strokeWidth={1.8} />,
  Ambulance: <Ambulance size={24} strokeWidth={1.8} />,
  Smile: <Smile size={24} strokeWidth={1.8} />,
  Eye: <Eye size={24} strokeWidth={1.8} />,
  Apple: <Apple size={24} strokeWidth={1.8} />,
  FlaskConical: <FlaskConical size={24} strokeWidth={1.8} />,
  Brain: <Brain size={24} strokeWidth={1.8} />,
};

// ─── Color Map ────────────────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; light: string; border: string }> = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    light: "bg-blue-50",
    border: "border-blue-100",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-pink-600",
    light: "bg-pink-50",
    border: "border-pink-100",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-600",
    light: "bg-red-50",
    border: "border-red-100",
  },
  teal: {
    bg: "bg-teal-500",
    text: "text-teal-600",
    light: "bg-teal-50",
    border: "border-teal-100",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    light: "bg-indigo-50",
    border: "border-indigo-100",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    light: "bg-green-50",
    border: "border-green-100",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    light: "bg-purple-50",
    border: "border-purple-100",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    light: "bg-amber-50",
    border: "border-amber-100",
  },
};

// ─── Department Card ──────────────────────────────────────────────────────────
interface DeptCardProps {
  dept: (typeof departments)[0];
  index: number;
  visible: boolean;
}
const DeptCard: React.FC<DeptCardProps> = ({ dept, index, visible }) => {
  const c = colorMap[dept.color] || colorMap.blue;
  const delay = `delay-${Math.min(index * 100, 700)}`;

  return (
    <div
      className={cn(
        "opacity-initial",
        visible ? `animate-fade-in-up ${delay}` : ""
      )}
    >
      <Link to={`/departments#${dept.name.toLowerCase().replace(/\s+/g, "-")}`}>
        <div className={cn(
          "group relative card-premium border",
          c.border,
          !dept.available && "opacity-70"
        )}>
          {/* Hover gradient background */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, ${c.light.replace("bg-", "").replace("-50", "")} 0%, transparent 100%)` }} />

          {/* Icon */}
          <div className="relative z-10">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
              c.bg
            )}>
              {iconMap[dept.icon]}
            </div>

            {/* Name & available badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={cn("text-base font-semibold text-slate-800 group-hover:transition-colors", `group-hover:${c.text}`)}>
                {dept.name}
              </h3>
              {!dept.available && (
                <span className="badge-amber flex-shrink-0">Coming Soon</span>
              )}
            </div>

            <p className="text-sm text-slate-500 leading-relaxed mb-4">{dept.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className={cn("text-xs font-medium", c.text)}>
                {dept.doctors} Doctors
              </span>
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium transition-all duration-300",
                c.text,
                "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
              )}>
                View <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// ─── Services Section ─────────────────────────────────────────────────────────
const ServicesSection: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-pad bg-chc-slate-50">
      <div className="page-container">
        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="section-label">
              <Stethoscope size={12} />
              Our Departments
            </span>
          </div>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold font-display text-slate-900 text-balance opacity-initial",
            visible ? "animate-fade-in-up delay-100" : ""
          )}>
            Comprehensive Healthcare{" "}
            <span className="gradient-text">Under One Roof</span>
          </h2>
          <p className={cn(
            "text-slate-500 leading-relaxed opacity-initial",
            visible ? "animate-fade-in-up delay-200" : ""
          )}>
            From primary care to specialized treatments, CHC Bharno offers a wide spectrum of medical services — all accessible, affordable, and backed by government schemes.
          </p>
        </div>

        {/* ── Department Grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept, i) => (
            <DeptCard key={dept.id} dept={dept} index={i} visible={visible} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className={cn(
          "text-center mt-10 opacity-initial",
          visible ? "animate-fade-in-up delay-700" : ""
        )}>
          <Link to="/departments" className="btn-outline">
            Explore All Departments
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
