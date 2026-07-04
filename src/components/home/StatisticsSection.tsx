import React, { useEffect, useRef, useState } from "react";
import {
  Users,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Tent,
  Star,
} from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={26} strokeWidth={1.8} />,
  HeartPulse: <HeartPulse size={26} strokeWidth={1.8} />,
  Stethoscope: <Stethoscope size={26} strokeWidth={1.8} />,
  ShieldCheck: <ShieldCheck size={26} strokeWidth={1.8} />,
  Tent: <Tent size={26} strokeWidth={1.8} />,
  Star: <Star size={26} strokeWidth={1.8} />,
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function useAnimatedNumber(end: number, suffix: string, duration: number, started: boolean) {
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * end);
      setDisplay(current.toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, suffix, duration, started]);

  return display;
}

// ─── Parse stat value into number + suffix ────────────────────────────────────
function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)/);
  if (!match) return { num: 0, suffix: value };
  return {
    num: parseInt(match[1].replace(/,/g, ""), 10),
    suffix: match[2],
  };
}

// ─── Single Stat Card ─────────────────────────────────────────────────────────
interface StatCardProps {
  stat: {
    id: number;
    value: string;
    label: string;
    sublabel: string;
    icon: string;
  };
  index: number;
  visible: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, visible }) => {
  const delay = `delay-${Math.min(index * 100, 500)}`;
  const parsed = parseStat(stat.value);
  const isNumeric = parsed.num > 0;
  const displayValue = useAnimatedNumber(
    parsed.num,
    parsed.suffix,
    2200,
    visible && isNumeric
  );

  return (
    <div
      className={cn(
        "opacity-initial",
        visible ? `animate-fade-in-up ${delay}` : ""
      )}
    >
      <div className="group relative overflow-hidden rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 cursor-default"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15), transparent 70%)" }} />

        {/* Icon */}
        <div className="relative z-10 w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.6), rgba(13,148,136,0.6))" }}>
          {iconMap[stat.icon]}
        </div>

        {/* Value */}
        <div className="relative z-10 text-4xl md:text-5xl font-black font-display text-white mb-2 tracking-tight">
          {isNumeric ? displayValue : stat.value}
        </div>

        {/* Label */}
        <div className="relative z-10 text-base font-semibold text-blue-100 mb-1">{stat.label}</div>
        <div className="relative z-10 text-xs text-blue-300">{stat.sublabel}</div>
      </div>
    </div>
  );
};

// ─── Statistics Section ───────────────────────────────────────────────────────
import { statistics } from "../../data/dummyData";

const StatisticsSection: React.FC = () => {
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
      style={{
        background: "linear-gradient(145deg, #1e3a8a 0%, #0f172a 50%, #0f766e 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #0d9488, transparent)" }} />
      </div>

      <div className="page-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.2)",
                color: "#5eead4",
              }}>
              <HeartPulse size={12} />
              Impact & Reach
            </span>
          </div>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold font-display text-white text-balance opacity-initial",
            visible ? "animate-fade-in-up delay-100" : ""
          )}>
            Serving Communities,{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #34d399)" }}>
              Transforming Lives
            </span>
          </h2>
          <p className={cn(
            "text-blue-200 leading-relaxed opacity-initial",
            visible ? "animate-fade-in-up delay-200" : ""
          )}>
            Numbers that reflect our commitment to making quality healthcare accessible for every resident of Bharno Block and surrounding areas.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statistics.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} visible={visible} />
          ))}
        </div>

        {/* Quote / Bottom note */}
        <div className={cn(
          "text-center mt-14 opacity-initial",
          visible ? "animate-fade-in-up delay-600" : ""
        )}>
          <div className="inline-block px-8 py-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
            <p className="text-blue-100 text-sm italic">
              "स्वस्थ भारत, समृद्ध भारत — Healthy India, Prosperous India"
            </p>
            <p className="text-blue-300 text-xs mt-1">— National Health Mission, Government of India</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
