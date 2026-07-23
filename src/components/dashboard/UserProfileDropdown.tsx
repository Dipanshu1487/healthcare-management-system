import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Key } from "lucide-react";

interface UserProfileDropdownProps {
  role: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ role }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    // In our prototype, logout redirects back to landing page
    setIsOpen(false);
    navigate("/");
  };

  // Get demo names for testing
  const getDemoUserData = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return { name: "Amit Mahato", desc: "System Admin" };
      case "doctor":
        return { name: "Dr. Priya Sharma", desc: "Chief Medical Officer" };
      case "reception":
      case "receptionist":
        return { name: "Sunita Kumari", desc: "Senior Receptionist" };
      case "lab":
      case "laboratory":
        return { name: "Arvind Munda", desc: "Lab Technologist" };
      case "pharmacy":
      case "pharmacist":
        return { name: "Vikram Oraon", desc: "Chief Pharmacist" };
      case "patient":
        return { name: "Ramesh Oraon", desc: "Patient (UHID: 10842)" };
      default:
        return { name: "Staff Member", desc: "Medical Operations" };
    }
  };

  const user = getDemoUserData(role);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 text-white font-bold font-display text-xs flex items-center justify-center relative shadow-sm">
          {user.name.substring(0, 2).toUpperCase()}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
          <div className="text-[10px] text-slate-400 font-semibold">{user.desc}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-lg py-2 z-50 animate-fade-in-up">
          {/* User Header */}
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="text-sm font-bold text-slate-800">{user.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{user.desc}</div>
          </div>

          {/* Action Links */}
          <div className="p-1 space-y-0.5">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left"
            >
              <User size={16} className="text-slate-400" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left"
            >
              <Settings size={16} className="text-slate-400" />
              <span>Account Settings</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/forgot-password");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left"
            >
              <Key size={16} className="text-slate-400" />
              <span>Change Password</span>
            </button>
          </div>

          <div className="border-t border-slate-100 my-1.5" />

          {/* Logout Section */}
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
            >
              <LogOut size={16} className="text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
