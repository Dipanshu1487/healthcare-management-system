import React, { useEffect, useRef, useState } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Shield,
  Users,
  HeartHandshake,
  Microscope,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { testimonials } from "../../data/dummyData";

// ─── Why Us Features ──────────────────────────────────────────────────────────
const whyUsFeatures = [
  {
    icon: <Shield size={22} strokeWidth={1.8} />,
    title: "Government Backed",
    desc: "Fully funded under National Health Mission with free medicines & diagnostics for eligible patients.",
    color: "blue",
  },
  {
    icon: <Clock size={22} strokeWidth={1.8} />,
    title: "24/7 Emergency",
    desc: "Round-the-clock emergency services with ambulance support and trained first responders.",
    color: "red",
  },
  {
    icon: <Users size={22} strokeWidth={1.8} />,
    title: "Expert Doctors",
    desc: "28+ experienced doctors across 8 specialties, dedicated to rural healthcare excellence.",
    color: "teal",
  },
  {
    icon: <HeartHandshake size={22} strokeWidth={1.8} />,
    title: "Patient-First Care",
    desc: "Compassionate, multilingual care in Hindi, English, Sadri, and Mundari languages.",
    color: "purple",
  },
  {
    icon: <Microscope size={22} strokeWidth={1.8} />,
    title: "Modern Diagnostics",
    desc: "In-house laboratory, X-ray, and digital health records for accurate and fast diagnosis.",
    color: "amber",
  },
  {
    icon: <CheckCircle size={22} strokeWidth={1.8} />,
    title: "Scheme Integration",
    desc: "Seamless enrollment for PM-JAY, MSBY, JSY, and 10+ other government health schemes.",
    color: "green",
  },
];

const colorVariants: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  red: "bg-red-50 text-red-600 border-red-100",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  green: "bg-green-50 text-green-600 border-green-100",
};

// ─── Testimonial Card ─────────────────────────────────────────────────────────
interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  active: boolean;
}
const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, active }) => {
  const avatarColors: Record<string, string> = {
    teal: "bg-teal-500",
    blue: "bg-blue-600",
    green: "bg-green-600",
  };

  return (
    <div className={cn(
      "transition-all duration-500 ease-in-out",
      active ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
    )}>
      <div className="bg-white rounded-3xl p-8 shadow-card max-w-2xl mx-auto relative overflow-hidden">
        {/* Decorative quote */}
        <div className="absolute top-4 right-6 text-slate-100">
          <Quote size={64} />
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
          ))}
        </div>

        {/* Original text */}
        <p className="text-slate-700 text-base leading-relaxed mb-2 font-medium italic">
          "{testimonial.text}"
        </p>
        {/* Translated */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 italic border-l-2 border-teal-200 pl-3">
          {testimonial.translated}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold",
            avatarColors[testimonial.color] || "bg-slate-500"
          )}>
            {testimonial.initials}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{testimonial.name}</div>
            <div className="text-xs text-slate-400">{testimonial.village} · {testimonial.date}</div>
          </div>
          <div className="ml-auto badge-teal text-[10px]">Verified Patient</div>
        </div>
      </div>
    </div>
  );
};

// ─── Why Us + Testimonials Section ───────────────────────────────────────────
const WhyUsSection: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── Why Choose Us ── */}
      <section ref={ref} className="section-pad bg-white">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
              <span className="section-label">
                <HeartHandshake size={12} />
                Why CHC Bharno
              </span>
            </div>
            <h2 className={cn(
              "text-3xl md:text-4xl font-bold font-display text-slate-900 text-balance opacity-initial",
              visible ? "animate-fade-in-up delay-100" : ""
            )}>
              Healthcare You Can{" "}
              <span className="gradient-text">Trust & Rely On</span>
            </h2>
            <p className={cn(
              "text-slate-500 leading-relaxed opacity-initial",
              visible ? "animate-fade-in-up delay-200" : ""
            )}>
              We combine the strength of government healthcare schemes with compassionate, modern medical practice to serve every family in our community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUsFeatures.map((feature, i) => {
              const delay = `delay-${Math.min(i * 100, 500)}`;
              const variant = colorVariants[feature.color] || colorVariants.blue;
              return (
                <div
                  key={i}
                  className={cn(
                    "opacity-initial group",
                    visible ? `animate-fade-in-up ${delay}` : ""
                  )}
                >
                  <div className="card-premium h-full">
                    <div className={cn(
                      "w-11 h-11 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                      variant
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-pad bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
        <div className="page-container">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
            <span className="section-label">
              <Star size={12} />
              Patient Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900">
              Words from Our{" "}
              <span className="gradient-text">Community</span>
            </h2>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative min-h-[280px]">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} active={i === activeTestimonial} />
            ))}
          </div>

          {/* Navigation dots & arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-9 h-9 rounded-full bg-white shadow-card border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === activeTestimonial
                      ? "w-6 h-2.5 bg-gradient-to-r from-blue-500 to-teal-500"
                      : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="w-9 h-9 rounded-full bg-white shadow-card border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyUsSection;
