import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  Clock,
  MapPin,
  Stethoscope,
  LogIn,
  CalendarCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { mainNavLinks } from "../../data/dummyData";

// ─── Top Info Bar ─────────────────────────────────────────────────────────────
const TopBar: React.FC = () => (
  <div className="hidden lg:block bg-gradient-to-r from-chc-blue-900 via-chc-blue-800 to-chc-teal-800 text-white text-xs">
    <div className="page-container">
      <div className="flex items-center justify-between h-9">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-blue-100">
            <Phone size={11} className="text-chc-teal-300" />
            Emergency: <span className="font-semibold text-white">108</span>
          </span>
          <span className="text-blue-300">|</span>
          <span className="flex items-center gap-1.5 text-blue-100">
            <Phone size={11} className="text-chc-teal-300" />
            OPD: <span className="font-semibold text-white">+91 94310 XXXXX</span>
          </span>
          <span className="text-blue-300">|</span>
          <span className="flex items-center gap-1.5 text-blue-100">
            <Clock size={11} className="text-chc-teal-300" />
            OPD Hours: <span className="font-semibold text-white">8:00 AM – 2:00 PM</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-blue-100">
            <MapPin size={11} className="text-chc-teal-300" />
            Bharno, Gumla District, Jharkhand
          </span>
          <span className="text-blue-300">|</span>
          <span className="badge-teal py-0.5 text-[10px] animate-pulse-soft">
            🟢 Emergency Open 24/7
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <>
      <TopBar />
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-nav"
            : "bg-white border-b border-slate-100"
        )}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #0d9488 100%)" }}>
                <Stethoscope size={20} className="text-white" strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse-soft" />
              </div>
              <div>
                <div className="text-lg font-bold font-display leading-tight">
                  <span className="text-chc-blue-700">CHC</span>
                  <span className="text-chc-teal-600"> Bharno</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wide leading-none">
                  Community Health Centre
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "nav-link px-3.5 py-2 rounded-lg text-[13.5px]",
                    isActive(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop CTAs ── */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login/staff" className="btn-outline py-2 px-4 text-xs">
                <LogIn size={14} />
                Staff Login
              </Link>
              <Link to="/appointment" className="btn-primary py-2 px-5 text-xs">
                <CalendarCheck size={14} />
                Book Appointment
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100",
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="page-container py-4 space-y-1">
            {/* Emergency Banner Mobile */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-red-700">Emergency: 108 | Available 24/7</span>
            </div>

            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/login/staff" className="btn-outline w-full justify-center py-2.5">
                <LogIn size={15} />
                Staff Login
              </Link>
              <Link to="/appointment" className="btn-primary w-full justify-center py-2.5">
                <CalendarCheck size={15} />
                Book Appointment
              </Link>
            </div>

            {/* Mobile Contact Info */}
            <div className="pt-2 grid grid-cols-1 gap-1 text-xs text-slate-500">
              <div className="flex items-center gap-2 px-2">
                <Phone size={11} className="text-teal-500" />
                OPD: +91 94310 XXXXX
              </div>
              <div className="flex items-center gap-2 px-2">
                <Clock size={11} className="text-teal-500" />
                Mon–Sat: 8:00 AM – 2:00 PM
              </div>
              <div className="flex items-center gap-2 px-2">
                <MapPin size={11} className="text-teal-500" />
                Bharno, Gumla, Jharkhand
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
