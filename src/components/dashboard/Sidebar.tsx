import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  HeartPulse, 
  DollarSign, 
  Settings, 
  Activity, 
  Stethoscope, 
  FileText, 
  ClipboardList, 
  Calendar, 
  UserPlus, 
  Ticket, 
  Search, 
  FlaskConical, 
  TestTube, 
  CheckSquare, 
  AlertTriangle, 
  FileSpreadsheet,
  Receipt,
  Shield,
  Plus,
  Bell
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, role }) => {
  const location = useLocation();

  // Define navigation links for each role
  const getNavLinks = (roleName: string): NavItem[] => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return [
          { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
          { label: "Doctors & Staff", href: "/dashboard/admin/staff", icon: <Users size={18} /> },
          { label: "Available Beds", href: "/dashboard/admin/beds", icon: <BedDouble size={18} /> },
          { label: "OPD Analytics", href: "/dashboard/admin/opd", icon: <Activity size={18} /> },
          { label: "Financials", href: "/dashboard/admin/revenue", icon: <DollarSign size={18} /> },
          { label: "System Settings", href: "/dashboard/admin/settings", icon: <Settings size={18} /> },
          { label: "Tech Operations", href: "/dashboard/tech-ops", icon: <Settings size={18} /> },
          { label: "Operations Center", href: "/dashboard/ops", icon: <Settings size={18} /> },
          { label: "White-Label Setup", href: "/dashboard/settings", icon: <Settings size={18} /> },
          { label: "Developer Portal", href: "/dashboard/developer", icon: <Settings size={18} /> },
        ];
      case "doctor":
        return [
          { label: "Doctor Portal", href: "/dashboard/doctor", icon: <Stethoscope size={18} /> },
          { label: "Consultation Room", href: "/dashboard/doctor/consultation", icon: <Activity size={18} /> },
          { label: "Patient Records", href: "/dashboard/doctor/history", icon: <FileText size={18} /> },
          { label: "E-Prescriptions", href: "/dashboard/doctor/prescriptions", icon: <ClipboardList size={18} /> },
          { label: "Lab Requests", href: "/dashboard/doctor/labs", icon: <FlaskConical size={18} /> },
          { label: "OPD Schedule", href: "/dashboard/doctor/schedule", icon: <Calendar size={18} /> },
        ];
      case "reception":
      case "receptionist":
        return [
          { label: "Reception Desk", href: "/dashboard/reception", icon: <LayoutDashboard size={18} /> },
          { label: "Register Patient", href: "/dashboard/reception/register", icon: <UserPlus size={18} /> },
          { label: "OPD Queue & Tokens", href: "/dashboard/reception/queue", icon: <Ticket size={18} /> },
          { label: "Search Patient", href: "/dashboard/reception/search", icon: <Search size={18} /> },
          { label: "Appointment List", href: "/dashboard/reception/appointments", icon: <Calendar size={18} /> },
        ];
      case "lab":
      case "laboratory":
        return [
          { label: "Lab Overview", href: "/dashboard/lab", icon: <LayoutDashboard size={18} /> },
          { label: "Pending Tests", href: "/dashboard/lab/pending", icon: <TestTube size={18} /> },
          { label: "Sample Collection", href: "/dashboard/lab/samples", icon: <Activity size={18} /> },
          { label: "Reports Dispatch", href: "/dashboard/lab/reports", icon: <FileSpreadsheet size={18} /> },
        ];
      case "pharmacy":
      case "pharmacist":
        return [
          { label: "Pharmacy Hub", href: "/dashboard/pharmacy", icon: <LayoutDashboard size={18} /> },
          { label: "Dispense Meds", href: "/dashboard/pharmacy/dispense", icon: <Activity size={18} /> },
          { label: "Inventory Stock", href: "/dashboard/pharmacy/inventory", icon: <CheckSquare size={18} /> },
          { label: "Stock Alerts", href: "/dashboard/pharmacy/alerts", icon: <AlertTriangle size={18} /> },
        ];
      case "patient":
        return [
          { label: "Dashboard", href: "/dashboard/patient?tab=dashboard", icon: <LayoutDashboard size={18} /> },
          { label: "Book Appointment", href: "/dashboard/patient?tab=book", icon: <Plus size={18} /> },
          { label: "My Appointments", href: "/dashboard/patient?tab=appointments", icon: <Calendar size={18} /> },
          { label: "My Medical Records", href: "/dashboard/patient?tab=records", icon: <FileText size={18} /> },
          { label: "Prescriptions", href: "/dashboard/patient?tab=prescriptions", icon: <ClipboardList size={18} /> },
          { label: "Laboratory Reports", href: "/dashboard/patient?tab=labs", icon: <FlaskConical size={18} /> },
          { label: "Vaccination History", href: "/dashboard/patient?tab=vaccinations", icon: <HeartPulse size={18} /> },
          { label: "Health Timeline", href: "/dashboard/patient?tab=timeline", icon: <Activity size={18} /> },
          { label: "Bills & Payments", href: "/dashboard/patient?tab=bills", icon: <Receipt size={18} /> },
          { label: "Insurance / PM-JAY", href: "/dashboard/patient?tab=insurance", icon: <Shield size={18} /> },
          { label: "Notifications", href: "/dashboard/patient?tab=notifications", icon: <Bell size={18} /> },
          { label: "Profile", href: "/dashboard/patient?tab=profile", icon: <Users size={18} /> },
          { label: "Settings", href: "/dashboard/patient?tab=settings", icon: <Settings size={18} /> },
        ];
      case "it-admin":
      case "itadmin":
        return [
          { label: "IT Dashboard", href: "/dashboard/it-admin?tab=dashboard", icon: <LayoutDashboard size={18} /> },
          { label: "User Accounts", href: "/dashboard/it-admin?tab=users", icon: <Users size={18} /> },
          { label: "Role Matrix (RBAC)", href: "/dashboard/it-admin?tab=permissions", icon: <Shield size={18} /> },
          { label: "Departments", href: "/dashboard/it-admin?tab=departments", icon: <Activity size={18} /> },
          { label: "Device Registry", href: "/dashboard/it-admin?tab=devices", icon: <Settings size={18} /> },
          { label: "Security Alerts", href: "/dashboard/it-admin?tab=security", icon: <AlertTriangle size={18} /> },
          { label: "Hospital Config", href: "/dashboard/it-admin?tab=config", icon: <Settings size={18} /> },
          { label: "Tech Operations", href: "/dashboard/tech-ops", icon: <Settings size={18} /> },
          { label: "Operations Center", href: "/dashboard/ops", icon: <Settings size={18} /> },
          { label: "White-Label Setup", href: "/dashboard/settings", icon: <Settings size={18} /> },
          { label: "Developer Portal", href: "/dashboard/developer", icon: <Settings size={18} /> },
        ];
      default:
        return [
          { label: "Dashboard", href: `/dashboard/${role.toLowerCase()}`, icon: <LayoutDashboard size={18} /> }
        ];
    }
  };

  const links = getNavLinks(role);

  // Helper for highlighting active route
  const isActive = (href: string) => {
    const fullCurrent = location.pathname + location.search;
    if (href === "/dashboard/patient?tab=dashboard" && location.pathname === "/dashboard/patient" && !location.search) {
      return true;
    }
    if (href === "/dashboard/it-admin?tab=dashboard" && location.pathname === "/dashboard/it-admin" && !location.search) {
      return true;
    }
    if (href.includes("?")) {
      return fullCurrent === href;
    }
    if (href === "/appointment") {
      return location.pathname === href;
    }
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  // Human readable role tag styling
  const getRoleBadge = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return { label: "Administrator", cls: "bg-slate-100 text-slate-700 border-slate-200" };
      case "it-admin":
      case "itadmin":
        return { label: "System Admin & IT", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      case "doctor":
        return { label: "Medical Staff", cls: "bg-teal-50 text-teal-700 border-teal-200" };
      case "reception":
      case "receptionist":
        return { label: "Front Desk Staff", cls: "bg-blue-50 text-blue-700 border-blue-200" };
      case "lab":
      case "laboratory":
        return { label: "Pathology Lab", cls: "bg-purple-50 text-purple-700 border-purple-200" };
      case "pharmacy":
      case "pharmacist":
        return { label: "Pharmacy Unit", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "patient":
        return { label: "Registered Patient", cls: "bg-rose-50 text-rose-700 border-rose-200" };
      default:
        return { label: "Hospital Staff", cls: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const badge = getRoleBadge(role);

  return (
    <>
      {/* ── Mobile Overlay Backdroop ── */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* ── Sidebar Container ── */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200 bg-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Header Branding */}
          <div className="h-16 border-b border-slate-100 px-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #0d9488 100%)" }}>
              <HeartPulse size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold font-display leading-tight">
                <span className="text-slate-800">CHC</span>
                <span className="text-teal-600"> Bharno</span>
              </div>
              <div className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase leading-none">
                HOSPITAL SYSTEM
              </div>
            </div>
          </div>

          {/* User Role Card */}
          <div className="p-4 border-b border-slate-50 bg-slate-50/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 text-white font-bold font-display text-sm flex items-center justify-center shadow-sm">
                {role.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Access Level</div>
                <div className="text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
                <span className={cn(
                  "inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md border mt-1",
                  badge.cls
                )}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    active 
                      ? "text-blue-600 bg-blue-50/80 font-semibold shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <span className={cn(
                    "transition-colors duration-200",
                    active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  )}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Support Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <div className="rounded-xl p-3 bg-white border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
              <Shield size={14} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">Secured Session</div>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">CHC-Bharno portal encrypts all actions for HIPAA safety.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
