import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  subtitle?: string;
  start: Date;
  end: Date;
  type: "appointment" | "shift" | "leave" | "resource";
  status?: string;
  meta?: any;
}

interface HospitalCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
  role: "doctor" | "receptionist" | "admin" | "patient";
}

export const HospitalCalendar: React.FC<HospitalCalendarProps> = ({
  events,
  onEventClick,
  onAddEvent,
  role
}) => {
  const [view, setView] = useState<"day" | "week" | "month" | "agenda">("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Generate helper calendar structure
  const startOfWeek = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const getDaysOfWeek = (d: Date) => {
    const start = startOfWeek(new Date(d));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const daysOfWeek = getDaysOfWeek(currentDate);

  const navigateDate = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(currentDate);
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }
    const offset = view === "day" ? 1 : view === "week" ? 7 : 30;
    newDate.setDate(currentDate.getDate() + (direction === "next" ? offset : -offset));
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(e => 
      e.start.getDate() === date.getDate() &&
      e.start.getMonth() === date.getMonth() &&
      e.start.getFullYear() === date.getFullYear()
    );
  };

  // Color mapping utility
  const getEventClass = (e: CalendarEvent) => {
    if (e.type === "leave") return "bg-rose-50 text-rose-700 border-rose-200";
    if (e.type === "shift") return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (e.type === "resource") return "bg-amber-50 text-amber-700 border-amber-200";
    
    // Appointments
    if (e.status === "Checked In") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (e.status === "Cancelled") return "bg-slate-100 text-slate-500 border-slate-200 line-through";
    if (e.status === "Needs Rescheduling") return "bg-red-50 text-red-700 border-red-200 animate-pulse";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px] animate-fade-in">
      {/* Calendar Header Control Strip */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <p className="text-xs text-slate-500">Resource & OPD Scheduling Engine</p>
          </div>
        </div>

        {/* Navigation Toggles */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => navigateDate("prev")}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => navigateDate("today")}
            className="px-3 py-1 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors"
          >
            Today
          </button>
          <button 
            onClick={() => navigateDate("next")}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(["day", "week", "month", "agenda"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                view === v ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Action Button */}
        {role === "receptionist" && onAddEvent && (
          <button 
            onClick={() => onAddEvent(currentDate)}
            className="w-full sm:w-auto btn-primary py-2 px-4 text-xs font-semibold rounded-xl"
          >
            <Plus size={14} />
            <span>Book OPD Slot</span>
          </button>
        )}
      </div>

      {/* Main Calendar Body Workspace */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === "week" && (
          <div className="grid grid-cols-7 gap-2 h-full min-w-[700px]">
            {daysOfWeek.map((day, idx) => {
              const isToday = new Date().toDateString() === day.toDateString();
              const dateEvents = getEventsForDate(day);

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "flex flex-col border border-slate-100 rounded-xl p-3 min-h-[400px] transition-all",
                    isToday ? "bg-blue-50/20 border-blue-200 ring-2 ring-blue-50" : "bg-white"
                  )}
                >
                  <div className="text-center pb-3 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className={cn(
                      "text-base font-bold mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full",
                      isToday ? "bg-blue-600 text-white shadow-sm" : "text-slate-700"
                    )}>
                      {day.getDate()}
                    </p>
                  </div>

                  <div className="flex-1 space-y-2 mt-3 overflow-y-auto max-h-[380px] scrollbar-thin">
                    {dateEvents.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-4 italic">No scheduled items</p>
                    ) : (
                      dateEvents.map(e => (
                        <div
                          key={e.id}
                          onClick={() => onEventClick?.(e)}
                          className={cn(
                            "p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] hover:shadow-sm",
                            getEventClass(e)
                          )}
                        >
                          <p className="font-bold text-[11px] truncate">{e.title}</p>
                          <div className="flex items-center gap-1 text-[9px] mt-1 opacity-80">
                            <Clock size={10} />
                            <span>
                              {e.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "day" && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Viewing Day schedule</p>
                <p className="font-bold text-slate-700 text-sm mt-0.5">
                  {currentDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                {getEventsForDate(currentDate).length} Total Events
              </span>
            </div>

            <div className="space-y-2.5 max-w-3xl mx-auto">
              {getEventsForDate(currentDate).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Clock className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-sm font-semibold text-slate-500">No events scheduled for today</p>
                </div>
              ) : (
                getEventsForDate(currentDate).map(e => (
                  <div
                    key={e.id}
                    onClick={() => onEventClick?.(e)}
                    className={cn(
                      "p-4 rounded-xl border flex items-center justify-between cursor-pointer hover:shadow-md transition-all",
                      getEventClass(e)
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/60 rounded-lg">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{e.title}</p>
                        {e.subtitle && <p className="text-xs opacity-80 mt-0.5">{e.subtitle}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold bg-white/70 px-3 py-1 rounded-full border border-current">
                        {e.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === "month" && (
          <div className="grid grid-cols-7 gap-1 h-[450px]">
            {Array.from({ length: 30 }, (_, i) => {
              const dayDate = new Date(currentDate);
              dayDate.setDate(i + 1);
              const isToday = new Date().toDateString() === dayDate.toDateString();
              const dateEvents = getEventsForDate(dayDate);

              return (
                <div 
                  key={i}
                  className={cn(
                    "border border-slate-100 rounded-lg p-1.5 flex flex-col h-20",
                    isToday ? "bg-blue-50/20 border-blue-200" : "bg-white"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold self-end inline-flex items-center justify-center w-5 h-5 rounded-full",
                    isToday ? "bg-blue-600 text-white" : "text-slate-600"
                  )}>
                    {i + 1}
                  </span>
                  <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                    {dateEvents.slice(0, 2).map(e => (
                      <div 
                        key={e.id} 
                        className="text-[9px] px-1 py-0.5 bg-blue-100 text-blue-800 rounded truncate border border-blue-200"
                      >
                        {e.title}
                      </div>
                    ))}
                    {dateEvents.length > 2 && (
                      <div className="text-[8px] text-slate-400 text-center font-bold">
                        +{dateEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "agenda" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Upcoming Hospital Agenda</h3>
            <div className="divide-y divide-slate-100">
              {events
                .filter(e => e.start >= new Date(new Date().setHours(0,0,0,0)))
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .map(e => (
                  <div 
                    key={e.id}
                    onClick={() => onEventClick?.(e)}
                    className="py-3.5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors"
                  >
                    <div className="w-24 text-left flex-shrink-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {e.start.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {e.start.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                      </p>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          e.type === "leave" ? "bg-red-500" : e.type === "shift" ? "bg-indigo-500" : "bg-blue-500"
                        )} />
                        <p className="font-bold text-xs text-slate-800">{e.title}</p>
                      </div>
                      {e.subtitle && <p className="text-[10px] text-slate-500 mt-0.5 ml-4">{e.subtitle}</p>}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {e.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
