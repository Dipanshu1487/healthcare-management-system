import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Target,
  Eye,
  Quote,
  Award,
  Building2,
  FlaskConical,
  ShoppingBag,
  Smile,
  Scan,
  Ambulance,
  Baby,
  Stethoscope,
  Shield,
  Clock,
  Users,
  HeartHandshake,
  Microscope,
  CheckCircle,
  Star,
  HeartPulse,
  MapPin,
  Calendar,
  Tent,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../lib/utils";
import { statistics } from "../data/dummyData";
import PageHeader from "../components/shared/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface FacilityItem {
  icon: React.ReactNode;
  name: string;
  description: string;
  highlight: string;
  color: string;
}

interface WhyFeature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

interface AwardCard {
  icon: React.ReactNode;
  title: string;
  year: string;
  issuer: string;
  description: string;
  color: string;
  badge: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const timelineMilestones: TimelineMilestone[] = [
  {
    year: "2018",
    title: "CHC Bharno Established",
    description:
      "Community Health Centre Bharno was inaugurated under the National Health Mission with a mandate to provide comprehensive primary and secondary care to Gumla District, Jharkhand.",
    color: "blue",
  },
  {
    year: "2019",
    title: "Emergency Wing Inaugurated",
    description:
      "A fully equipped Emergency & Trauma ward with 24/7 casualty services was opened. Dr. Anil Kumar Tiwari was appointed as Medical Superintendent, bringing renewed vision and leadership.",
    color: "teal",
  },
  {
    year: "2021",
    title: "Laboratory Upgraded",
    description:
      "State-of-the-art diagnostic laboratory was established with automated CBC analyzers, biochemistry equipment, and digital X-ray unit — enabling same-day diagnostic results.",
    color: "purple",
  },
  {
    year: "2023",
    title: "Kayakalp Award Won",
    description:
      "CHC Bharno received the prestigious Kayakalp Award for outstanding performance in cleanliness, infection control, and patient experience — a national recognition from MoHFW.",
    color: "amber",
  },
  {
    year: "2024",
    title: "Ayushman Bharat Empanelment",
    description:
      "Full empanelment under PM-JAY (Ayushman Bharat) was achieved, enabling 45,000+ patients from Bharno block to avail ₹5 lakh cashless secondary-care services annually.",
    color: "green",
  },
  {
    year: "2026",
    title: "Digital Health Records & HMIS",
    description:
      "Launch of the integrated Hospital Management Information System (HMIS) to digitize OPD registrations, patient records, inventory management, and lab reports in real time.",
    color: "blue",
  },
];

const facilities: FacilityItem[] = [
  {
    icon: <Stethoscope size={22} strokeWidth={1.8} />,
    name: "OPD Services",
    description: "Daily outpatient consultations with specialists across 8 departments, 6 days a week.",
    highlight: "150+ patients/day",
    color: "blue",
  },
  {
    icon: <Ambulance size={22} strokeWidth={1.8} />,
    name: "Emergency Ward",
    description: "24/7 emergency and trauma services with a trained team of first responders and specialists.",
    highlight: "24/7 Available",
    color: "red",
  },
  {
    icon: <Baby size={22} strokeWidth={1.8} />,
    name: "Labour Room",
    description: "Two fully equipped labour rooms with skilled birth attendants for safe institutional deliveries.",
    highlight: "2 Labour Rooms",
    color: "pink",
  },
  {
    icon: <FlaskConical size={22} strokeWidth={1.8} />,
    name: "Diagnostic Lab",
    description: "In-house laboratory with CBC, blood glucose, urine analysis, malaria tests, and pregnancy tests.",
    highlight: "25+ Tests",
    color: "purple",
  },
  {
    icon: <ShoppingBag size={22} strokeWidth={1.8} />,
    name: "Pharmacy",
    description: "Fully stocked government pharmacy providing free medicines under NHM and PM-JAY schemes.",
    highlight: "Free Medicines",
    color: "green",
  },
  {
    icon: <Smile size={22} strokeWidth={1.8} />,
    name: "Dental Unit",
    description: "Equipped dental chair for extractions, scaling, fluoride treatments, and routine oral health care.",
    highlight: "3 Days/Week",
    color: "teal",
  },
  {
    icon: <Scan size={22} strokeWidth={1.8} />,
    name: "X-Ray Unit",
    description: "Digital X-ray facility for chest, limb, and other imaging needs with quick turnaround.",
    highlight: "Digital X-Ray",
    color: "indigo",
  },
  {
    icon: <Ambulance size={22} strokeWidth={1.8} />,
    name: "Ambulance Service",
    description: "108 EMRI ambulance network available for emergency referrals and inter-facility transport.",
    highlight: "108 EMRI Network",
    color: "amber",
  },
];

const whyFeatures: WhyFeature[] = [
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

const awards: AwardCard[] = [
  {
    icon: <Award size={28} strokeWidth={1.6} />,
    title: "Kayakalp Award 2024",
    year: "2024",
    issuer: "Ministry of Health & Family Welfare, GOI",
    description:
      "Awarded for outstanding performance in cleanliness, hygiene, sanitation, infection control, and waste management among Community Health Centres.",
    color: "amber",
    badge: "National Recognition",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.6} />,
    title: "NHSRC Quality Certification",
    year: "2023",
    issuer: "National Health Systems Resource Centre",
    description:
      "Received NHSRC quality certification for implementing LaQshya (Labour Room Quality Improvement Initiative) and improving maternal and newborn care outcomes.",
    color: "blue",
    badge: "Quality Excellence",
  },
  {
    icon: <Tent size={28} strokeWidth={1.6} />,
    title: "NHM Best CHC Award",
    year: "2022",
    issuer: "National Health Mission, Jharkhand",
    description:
      "Recognized as the Best Community Health Centre in Gumla District by the NHM Jharkhand for consistent service delivery, patient satisfaction, and health camp outreach.",
    color: "teal",
    badge: "State Award",
  },
];

// ─── Color Variants ───────────────────────────────────────────────────────────
const colorVariants: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  red: "bg-red-50 text-red-600 border-red-100",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  green: "bg-green-50 text-green-600 border-green-100",
  pink: "bg-pink-50 text-pink-600 border-pink-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

const timelineColorDot: Record<string, string> = {
  blue: "bg-blue-500 ring-blue-200",
  teal: "bg-teal-500 ring-teal-200",
  purple: "bg-purple-500 ring-purple-200",
  amber: "bg-amber-500 ring-amber-200",
  green: "bg-green-500 ring-green-200",
};

const awardBgVariants: Record<string, string> = {
  amber: "from-amber-50 to-amber-50/30 border-amber-100",
  blue: "from-blue-50 to-blue-50/30 border-blue-100",
  teal: "from-teal-50 to-teal-50/30 border-teal-100",
};

const awardIconVariants: Record<string, string> = {
  amber: "bg-amber-100 text-amber-600",
  blue: "bg-blue-100 text-blue-600",
  teal: "bg-teal-100 text-teal-600",
};

const awardBadgeVariants: Record<string, string> = {
  amber: "badge-amber",
  blue: "badge-blue",
  teal: "badge-teal",
};

// ─── Animated Counter (reused from StatisticsSection pattern) ─────────────────
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

function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] };
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={26} strokeWidth={1.8} />,
  HeartPulse: <HeartPulse size={26} strokeWidth={1.8} />,
  Stethoscope: <Stethoscope size={26} strokeWidth={1.8} />,
  ShieldCheck: <ShieldCheck size={26} strokeWidth={1.8} />,
  Tent: <Tent size={26} strokeWidth={1.8} />,
  Star: <Star size={26} strokeWidth={1.8} />,
};

// ─── Section: Mission & Vision ────────────────────────────────────────────────
const MissionVisionSection: React.FC = () => {
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
    <section ref={ref} className="section-pad bg-white">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="section-label">
              <HeartPulse size={12} />
              Our Purpose
            </span>
          </div>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold font-display text-slate-900 opacity-initial",
            visible ? "animate-fade-in-up delay-100" : ""
          )}>
            Mission &{" "}
            <span className="gradient-text">Vision</span>
          </h2>
          <p className={cn(
            "text-slate-500 leading-relaxed opacity-initial",
            visible ? "animate-fade-in-up delay-200" : ""
          )}>
            Guiding principles that shape every decision, every service, and every patient interaction at CHC Bharno.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up delay-200" : "")}>
            <div className="card-premium h-full relative overflow-hidden group">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.03), rgba(13,148,136,0.03))" }} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Target size={26} strokeWidth={1.7} />
                </div>
                <div className="badge-blue mb-3">Our Mission</div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-4">
                  Delivering Equitable, Quality Healthcare
                </h3>
                <p className="text-slate-600 leading-relaxed mb-5">
                  To provide comprehensive, accessible, and affordable healthcare services to every individual in Bharno Block and surrounding rural communities — regardless of economic status, caste, or geographic barrier.
                </p>
                <ul className="space-y-3">
                  {[
                    "Free diagnostics & medicines under NHM for eligible patients",
                    "Timely emergency care with zero-delay treatment protocol",
                    "Maternal & child health services under Janani Suraksha Yojana",
                    "Community outreach through 120+ health camps annually",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up delay-300" : "")}>
            <div className="card-premium h-full relative overflow-hidden group">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(13,148,136,0.03), rgba(37,99,235,0.03))" }} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Eye size={26} strokeWidth={1.7} />
                </div>
                <div className="badge-teal mb-3">Our Vision</div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-4">
                  A Healthier, Empowered Jharkhand
                </h3>
                <p className="text-slate-600 leading-relaxed mb-5">
                  To become the most trusted Community Health Centre in Jharkhand — a model of rural healthcare excellence where advanced medical services, compassionate care, and digital health systems converge for the well-being of all.
                </p>
                <ul className="space-y-3">
                  {[
                    "Zero preventable maternal and infant deaths by 2028",
                    "100% digital health records and HMIS integration",
                    "Expand IPD capacity to 60 beds by 2027",
                    "Establish telemedicine for rural consultation outreach",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle size={15} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: MS Message ──────────────────────────────────────────────────────
const MSMessageSection: React.FC = () => {
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
    <section ref={ref} className="section-pad bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="section-label">
              <Users size={12} />
              Leadership
            </span>
          </div>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold font-display text-slate-900 opacity-initial",
            visible ? "animate-fade-in-up delay-100" : ""
          )}>
            Medical Superintendent's{" "}
            <span className="gradient-text">Message</span>
          </h2>
        </div>

        <div className={cn(
          "max-w-4xl mx-auto opacity-initial",
          visible ? "animate-fade-in-up delay-200" : ""
        )}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <div className="md:flex">
              {/* Left - Avatar & Info */}
              <div className="md:w-72 flex-shrink-0 relative p-10 flex flex-col items-center justify-center text-center"
                style={{ background: "linear-gradient(145deg, #1e3a8a 0%, #0f766e 100%)" }}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }} />
                {/* Avatar */}
                <div className="relative z-10 w-28 h-28 rounded-full border-4 border-white/30 flex items-center justify-center text-white text-4xl font-bold font-display mb-5"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                  AKT
                </div>
                <div className="relative z-10">
                  <div className="text-xl font-bold font-display text-white mb-1">
                    Dr. Anil Kumar Tiwari
                  </div>
                  <div className="text-blue-200 text-sm mb-2">MBBS, MD</div>
                  <div className="text-teal-300 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    Medical Superintendent
                  </div>
                  <div className="text-blue-300 text-xs mt-3">Since 2019 · CHC Bharno</div>
                  <div className="flex items-center justify-center gap-1.5 mt-4 text-blue-200 text-xs">
                    <MapPin size={11} />
                    <span>Bharno, Gumla, Jharkhand</span>
                  </div>
                </div>
              </div>

              {/* Right - Quote */}
              <div className="flex-1 p-8 md:p-12 relative">
                <div className="absolute top-6 right-8 text-slate-100">
                  <Quote size={72} />
                </div>
                <div className="relative z-10">
                  <blockquote className="text-slate-700 text-base md:text-lg leading-relaxed italic mb-6 font-medium">
                    "When I took charge of CHC Bharno in 2019, my singular goal was simple: ensure that no family in this block goes untreated due to lack of resources. Over the years, with the dedication of our staff and the trust of our community, we have transformed this centre into a beacon of hope for rural Jharkhand.
                  </blockquote>
                  <blockquote className="text-slate-600 text-base leading-relaxed italic mb-8 border-l-4 border-teal-300 pl-5">
                    "Our focus remains on preventive care, safe motherhood, child health, and accessible diagnostics. Every patient who walks through our doors deserves dignity, compassion, and world-class care — regardless of where they come from."
                  </blockquote>

                  <div className="flex flex-wrap gap-3">
                    <span className="badge-blue">18+ Years Experience</span>
                    <span className="badge-teal">MD — Community Medicine</span>
                    <span className="badge-green">NHM Program Lead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: History Timeline ────────────────────────────────────────────────
const TimelineSection: React.FC = () => {
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
    <section ref={ref} className="section-pad bg-white">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="section-label">
              <Calendar size={12} />
              Our Journey
            </span>
          </div>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold font-display text-slate-900 opacity-initial",
            visible ? "animate-fade-in-up delay-100" : ""
          )}>
            History &{" "}
            <span className="gradient-text">Milestones</span>
          </h2>
          <p className={cn(
            "text-slate-500 leading-relaxed opacity-initial",
            visible ? "animate-fade-in-up delay-200" : ""
          )}>
            From humble beginnings in 2018 to becoming a district-level centre of excellence — the CHC Bharno story.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-teal-200 to-blue-200 -translate-x-0 md:-translate-x-px" />

            <div className="space-y-10">
              {timelineMilestones.map((milestone, index) => {
                const delay = `delay-${Math.min(index * 100, 500)}`;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={cn(
                      "relative opacity-initial",
                      visible ? `animate-fade-in-up ${delay}` : "",
                      "md:flex md:items-start"
                    )}
                  >
                    {/* Mobile layout */}
                    <div className="flex md:hidden items-start gap-4 pl-0">
                      {/* Dot */}
                      <div className={cn(
                        "relative z-10 flex-shrink-0 w-11 h-11 rounded-full ring-4 ring-offset-2 flex items-center justify-center text-white text-xs font-bold",
                        timelineColorDot[milestone.color] || "bg-blue-500 ring-blue-200"
                      )}>
                        {milestone.year.slice(2)}
                      </div>
                      <div className="flex-1 card-premium">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{milestone.year}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">{milestone.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:flex items-start w-full gap-0">
                      {/* Left side */}
                      <div className={cn("flex-1 pr-10", isEven ? "text-right" : "opacity-0 pointer-events-none")}>
                        {isEven && (
                          <div className="card-premium inline-block text-left max-w-xs">
                            <div className="flex items-center gap-2 mb-2 justify-end">
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{milestone.year}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{milestone.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{milestone.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Center dot */}
                      <div className="flex-shrink-0 relative z-10">
                        <div className={cn(
                          "w-11 h-11 rounded-full ring-4 ring-offset-2 flex items-center justify-center text-white text-xs font-bold",
                          timelineColorDot[milestone.color] || "bg-blue-500 ring-blue-200"
                        )}>
                          {milestone.year.slice(2)}
                        </div>
                      </div>

                      {/* Right side */}
                      <div className={cn("flex-1 pl-10", !isEven ? "" : "opacity-0 pointer-events-none")}>
                        {!isEven && (
                          <div className="card-premium inline-block max-w-xs">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{milestone.year}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{milestone.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{milestone.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: Infrastructure & Facilities ─────────────────────────────────────
const FacilitiesSection: React.FC = () => {
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
    <section ref={ref} className="section-pad bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="section-label">
              <Building2 size={12} />
              Infrastructure
            </span>
          </div>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold font-display text-slate-900 opacity-initial",
            visible ? "animate-fade-in-up delay-100" : ""
          )}>
            Infrastructure &{" "}
            <span className="gradient-text">Facilities</span>
          </h2>
          <p className={cn(
            "text-slate-500 leading-relaxed opacity-initial",
            visible ? "animate-fade-in-up delay-200" : ""
          )}>
            CHC Bharno is equipped with modern infrastructure and essential medical facilities to serve the healthcare needs of Gumla District.
          </p>
        </div>

        {/* IPD highlight strip */}
        <div className={cn(
          "mb-10 p-5 rounded-2xl flex flex-wrap items-center justify-center gap-8 opacity-initial",
          visible ? "animate-fade-in-up delay-200" : ""
        )}
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(13,148,136,0.06))",
            border: "1px solid rgba(37,99,235,0.12)",
          }}>
          {[
            { value: "30", label: "IPD Beds" },
            { value: "2", label: "Labour Rooms" },
            { value: "1", label: "X-Ray Unit" },
            { value: "25+", label: "Lab Tests" },
            { value: "8", label: "Departments" },
            { value: "108", label: "EMRI Ambulance" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black font-display gradient-text">{item.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {facilities.map((facility, i) => {
            const delay = `delay-${Math.min(i * 100, 500)}`;
            const colorClass = colorVariants[facility.color] || colorVariants.blue;
            return (
              <div
                key={i}
                className={cn("opacity-initial group", visible ? `animate-fade-in-up ${delay}` : "")}
              >
                <div className="card-premium h-full">
                  <div className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                    colorClass
                  )}>
                    {facility.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1.5">{facility.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{facility.description}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600">
                    <CheckCircle size={11} className="text-teal-500" />
                    {facility.highlight}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Section: Why Choose CHC ──────────────────────────────────────────────────
const WhyChooseSection: React.FC = () => {
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
          {whyFeatures.map((feature, i) => {
            const delay = `delay-${Math.min(i * 100, 500)}`;
            const variant = colorVariants[feature.color] || colorVariants.blue;
            return (
              <div
                key={i}
                className={cn("opacity-initial group", visible ? `animate-fade-in-up ${delay}` : "")}
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
  );
};

// ─── Section: Government Recognition ─────────────────────────────────────────
const RecognitionSection: React.FC = () => {
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
    <section ref={ref} className="section-pad bg-gradient-to-br from-slate-50 via-amber-50/20 to-blue-50/20">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="section-label">
              <Award size={12} />
              Recognition
            </span>
          </div>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold font-display text-slate-900 opacity-initial",
            visible ? "animate-fade-in-up delay-100" : ""
          )}>
            Government{" "}
            <span className="gradient-text">Awards & Recognition</span>
          </h2>
          <p className={cn(
            "text-slate-500 leading-relaxed opacity-initial",
            visible ? "animate-fade-in-up delay-200" : ""
          )}>
            National and state-level recognition for our commitment to quality healthcare, cleanliness, and community service.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {awards.map((award, i) => {
            const delay = `delay-${Math.min(i * 150, 400)}`;
            return (
              <div
                key={i}
                className={cn("opacity-initial group", visible ? `animate-fade-in-up ${delay}` : "")}
              >
                <div className={cn(
                  "h-full rounded-2xl p-7 border bg-gradient-to-br transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]",
                  awardBgVariants[award.color] || awardBgVariants.blue
                )}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                      awardIconVariants[award.color] || awardIconVariants.blue
                    )}>
                      {award.icon}
                    </div>
                    <span className={awardBadgeVariants[award.color] || "badge-blue"}>
                      {award.badge}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{award.year}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 font-display">{award.title}</h3>
                  <div className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={11} className="text-slate-400" />
                    {award.issuer}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{award.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Section: Statistics Strip ────────────────────────────────────────────────
interface StatCardProps {
  stat: (typeof statistics)[0];
  index: number;
  visible: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, visible }) => {
  const delay = `delay-${Math.min(index * 100, 500)}`;
  const parsed = parseStat(stat.value);
  const isNumeric = parsed.num > 0;
  const displayValue = useAnimatedNumber(parsed.num, parsed.suffix, 2200, visible && isNumeric);

  return (
    <div className={cn("opacity-initial", visible ? `animate-fade-in-up ${delay}` : "")}>
      <div
        className="group relative overflow-hidden rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 cursor-default"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15), transparent 70%)" }} />

        <div className="relative z-10 w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.6), rgba(13,148,136,0.6))" }}>
          {iconMap[stat.icon]}
        </div>

        <div className="relative z-10 text-4xl md:text-5xl font-black font-display text-white mb-2 tracking-tight">
          {isNumeric ? displayValue : stat.value}
        </div>
        <div className="relative z-10 text-base font-semibold text-blue-100 mb-1">{stat.label}</div>
        <div className="relative z-10 text-xs text-blue-300">{stat.sublabel}</div>
      </div>
    </div>
  );
};

const AboutStatisticsSection: React.FC = () => {
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
      style={{ background: "linear-gradient(145deg, #1e3a8a 0%, #0f172a 50%, #0f766e 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }} />
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #0d9488, transparent)" }} />
      </div>

      <div className="page-container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className={cn("opacity-initial", visible ? "animate-fade-in-up" : "")}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border"
              style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "#5eead4" }}>
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
            Numbers that reflect our commitment to making quality healthcare accessible for every resident of Bharno Block.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statistics.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} visible={visible} />
          ))}
        </div>

        <div className={cn("text-center mt-14 opacity-initial", visible ? "animate-fade-in-up delay-600" : "")}>
          <div className="inline-block px-8 py-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
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

// ─── About Page ───────────────────────────────────────────────────────────────
const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About CHC Bharno — Community Health Centre | Jharkhand</title>
        <meta
          name="description"
          content="Learn about CHC Bharno — its mission, vision, history, leadership, and infrastructure. Established in 2018, CHC Bharno serves Gumla District, Jharkhand with quality free healthcare."
        />
        <meta
          name="keywords"
          content="CHC Bharno About, Community Health Centre History, Dr. Anil Kumar Tiwari, Kayakalp Award, Gumla Hospital, NHM Jharkhand"
        />
      </Helmet>

      <main>
        <PageHeader
          title="About CHC Bharno"
          badge="Est. 2018 · Bharno, Jharkhand"
          subtitle="A story of commitment, compassion, and community healthcare — serving over 45,000 patients across Gumla District since our inception."
          breadcrumbs={[{ label: "About" }]}
        />
        <MissionVisionSection />
        <MSMessageSection />
        <TimelineSection />
        <FacilitiesSection />
        <WhyChooseSection />
        <RecognitionSection />
        <AboutStatisticsSection />
      </main>
    </>
  );
};

export default AboutPage;
