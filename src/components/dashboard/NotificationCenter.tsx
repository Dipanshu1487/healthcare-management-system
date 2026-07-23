import React, { useState, useRef, useEffect } from "react";
import { Bell, Info, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "alert" | "success";
  time: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Demo notification list
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Lab Results",
      message: "Blood test reports for Patient Ramesh Oraon are completed and ready for review.",
      type: "success",
      time: "5 mins ago",
      read: false,
    },
    {
      id: "2",
      title: "Low Inventory Alert",
      message: "Paracetamol 650mg is below safe reorder levels in pharmacy stock.",
      type: "warning",
      time: "25 mins ago",
      read: false,
    },
    {
      id: "3",
      title: "Emergency Bed Status",
      message: "Emergency Ward bed capacity is currently at 90% (27/30 occupied).",
      type: "alert",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "4",
      title: "Ayushman Scheme Audit",
      message: "Upcoming weekly PM-JAY registration audit scheduled at 2:00 PM today.",
      type: "info",
      time: "2 hours ago",
      read: true,
    },
  ]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle size={14} className="text-emerald-500" />;
      case "warning":
        return <AlertTriangle size={14} className="text-amber-500" />;
      case "alert":
        return <AlertTriangle size={14} className="text-rose-500" />;
      case "info":
      default:
        return <Info size={14} className="text-blue-500" />;
    }
  };

  const getBgClass = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border-emerald-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "alert":
        return "bg-rose-50 border-rose-100";
      case "info":
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all duration-200"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-lg py-2 z-50 animate-fade-in-up">
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Bell size={32} className="opacity-30" />
                <span>All caught up! No notifications.</span>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "p-3.5 hover:bg-slate-50/50 cursor-pointer flex gap-3 transition-colors",
                    !notification.read ? "bg-blue-50/15" : ""
                  )}
                >
                  {/* Status Indicator Icon */}
                  <div className={cn(
                    "w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5",
                    getBgClass(notification.type)
                  )}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={cn(
                        "text-xs font-bold truncate",
                        !notification.read ? "text-slate-800" : "text-slate-500"
                      )}>
                        {notification.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal mt-0.5">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All Footer */}
          <div className="border-t border-slate-100 p-2 text-center">
            <button className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors w-full py-1">
              View All Activities
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
