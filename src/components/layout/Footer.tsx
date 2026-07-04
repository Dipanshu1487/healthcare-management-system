import React from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  MessageCircle,
  Video,
  Camera,
  ExternalLink,
  Heart,
  Shield,
  ArrowRight,
} from "lucide-react";

// ─── Footer Data ──────────────────────────────────────────────────────────────
const footerLinks = {
  quickLinks: [
    { label: "About CHC Bharno", href: "/about" },
    { label: "Our Departments", href: "/departments" },
    { label: "Find a Doctor", href: "/doctors" },
    { label: "Health Schemes", href: "/schemes" },
    { label: "Health Camps", href: "/health-camps" },
    { label: "Photo Gallery", href: "/gallery" },
    { label: "Contact Us", href: "/contact" },
    { label: "Book Appointment", href: "/appointment" },
  ],
  services: [
    { label: "General OPD", href: "/departments" },
    { label: "Emergency Care (24/7)", href: "/departments#emergency" },
    { label: "Maternal & Child Health", href: "/departments#mch" },
    { label: "Free Lab Diagnostics", href: "/departments#laboratory" },
    { label: "Dental Services", href: "/departments#dental" },
    { label: "Free Medicines", href: "/schemes" },
    { label: "Ayushman Bharat", href: "/schemes#pmjay" },
    { label: "Immunization Program", href: "/schemes#immunization" },
  ],
  govLinks: [
    { label: "National Health Mission", href: "https://nhm.gov.in", external: true },
    { label: "Ayushman Bharat", href: "https://pmjay.gov.in", external: true },
    { label: "Jharkhand Health Dept.", href: "https://health.jharkhand.gov.in", external: true },
    { label: "MoHFW India", href: "https://mohfw.gov.in", external: true },
  ],
};

// ─── Social Links ─────────────────────────────────────────────────────────────
const socialLinks = [
  { icon: <Share2 size={16} />, href: "#", label: "Facebook" },
  { icon: <MessageCircle size={16} />, href: "#", label: "Twitter" },
  { icon: <Video size={16} />, href: "#", label: "YouTube" },
  { icon: <Camera size={16} />, href: "#", label: "Instagram" },
];

// ─── Footer Component ─────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chc-slate-900 text-white">
      {/* ── CTA Banner ── */}
      <div
        className="py-12"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)" }}
      >
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-display text-white mb-1">
                Need Medical Assistance?
              </h3>
              <p className="text-blue-100 text-sm">
                Our team is available Mon–Sat (OPD) and 24/7 for emergencies.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:108"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all hover:-translate-y-0.5"
              >
                <Phone size={15} />
                Emergency: 108
              </a>
              <Link
                to="/appointment"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Book Appointment
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ── */}
      <div className="py-16 border-b border-white/5">
        <div className="page-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            {/* ── Brand Column ── */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: "linear-gradient(135deg, #2563eb, #0d9488)" }}
                >
                  <Stethoscope size={20} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-lg font-bold font-display">
                    <span className="text-blue-400">CHC</span>
                    <span className="text-teal-400"> Bharno</span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none">Community Health Centre</div>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Serving the communities of Bharno Block, Gumla District, Jharkhand with quality government healthcare since 2018.
              </p>

              {/* Contact */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>CHC Bharno, NH-75, Bharno Block, Gumla District, Jharkhand – 835209</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone size={14} className="text-teal-400 flex-shrink-0" />
                  <span>OPD: +91 94310 XXXXX | Emergency: 108</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail size={14} className="text-teal-400 flex-shrink-0" />
                  <span>chcbharno@jharkhand.gov.in</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Clock size={14} className="text-teal-400 flex-shrink-0" />
                  <span>OPD: Mon–Sat, 8:00 AM – 2:00 PM</span>
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-2 mt-6">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Quick Links</h4>
              <ul className="space-y-2.5">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Services ── */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Our Services</h4>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Government Links + Accreditations ── */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Government Portals</h4>
              <ul className="space-y-2.5 mb-7">
                {footerLinks.govLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-1.5"
                    >
                      {link.label}
                      <ExternalLink size={10} className="flex-shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Accreditation badges */}
              <h4 className="text-sm font-semibold text-white mb-3 tracking-wide">Accreditations</h4>
              <div className="space-y-2">
                {[
                  { label: "NHSRC Certified Facility", color: "blue" },
                  { label: "Kayakalp Award 2024", color: "teal" },
                  { label: "Ayushman Bharat Empanelled", color: "green" },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5"
                  >
                    <Shield size={12} className={`text-${badge.color}-400`} />
                    <span className="text-xs text-slate-300">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="py-5">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              © {currentYear} CHC Bharno, Government of Jharkhand. Made with
              <Heart size={11} className="text-red-400 fill-red-400 mx-0.5" />
              for Community Health.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <span>·</span>
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
              <span>·</span>
              <Link to="/sitemap" className="hover:text-slate-300 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
