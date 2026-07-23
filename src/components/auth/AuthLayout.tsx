import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, ShieldCheck, HeartPulse } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ── Left Side (Branding & Visuals) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between"
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #0f766e 100%)",
        }}
      >
        {/* Background Decorative Elements */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #0d9488, transparent)" }} />

        {/* Top: Logo */}
        <div className="relative z-10 p-12">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center relative">
              <Stethoscope className="text-blue-600" size={28} strokeWidth={2} />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-black font-display tracking-tight text-white flex items-center">
                CHC <span className="text-teal-300 ml-1.5">Bharno</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-blue-200 mt-0.5">
                Community Health Centre
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Value Proposition */}
        <div className="relative z-10 p-12 max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold font-display text-white leading-tight mb-6">
            Pioneering the future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              rural healthcare.
            </span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            A comprehensive, government-backed medical platform ensuring zero-compromise care for every patient.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-100 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 w-fit">
              <ShieldCheck className="text-teal-300" size={20} />
              <span className="font-medium text-sm">NHSRC Accredited Facility</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 w-fit">
              <HeartPulse className="text-rose-300" size={20} />
              <span className="font-medium text-sm">24/7 Emergency & Trauma Care</span>
            </div>
          </div>
        </div>

        {/* Bottom: Footer info */}
        <div className="relative z-10 p-12 text-sm text-blue-200/60 font-medium">
          © {new Date().getFullYear()} CHC Bharno. All rights reserved. <br />
          Jharkhand State Health Department
        </div>
      </div>

      {/* ── Right Side (Auth Form) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center mb-8">
           <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl shadow-md flex items-center justify-center relative">
              <Stethoscope className="text-white" size={20} strokeWidth={2} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full border border-blue-600" />
            </div>
            <div>
              <div className="text-xl font-black font-display tracking-tight text-slate-800">
                CHC <span className="text-teal-600">Bharno</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto animate-fade-in-up">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-display text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
