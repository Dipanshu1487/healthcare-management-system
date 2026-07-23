import React from "react";
import { Stethoscope, ClipboardList, BookOpen, HeartPulse, Search } from "lucide-react";

interface AISuggestionsProps {
  onSelect: (prompt: string) => void;
  role: string;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ onSelect, role }) => {
  const getSuggestions = () => {
    switch (role) {
      case "doctor":
        return [
          { text: "Summarize Patient History", icon: ClipboardList },
          { text: "Draft Consultation Notes", icon: Stethoscope },
          { text: "Explain Lab Report", icon: HeartPulse }
        ];
      case "reception":
        return [
          { text: "Registration SOP Help", icon: BookOpen },
          { text: "Search Government Schemes", icon: Search }
        ];
      case "lab":
        return [
          { text: "Search Laboratory SOPs", icon: BookOpen },
          { text: "Verify Reference Ranges", icon: HeartPulse }
        ];
      case "pharmacy":
        return [
          { text: "Search Drug Formulary", icon: Search },
          { text: "Deduct Inventory Stock", icon: ClipboardList }
        ];
      default:
        return [
          { text: "Explain Prescriptions", icon: Stethoscope },
          { text: "Explain Lab Reports", icon: HeartPulse },
          { text: "Hospital FAQ Guides", icon: BookOpen }
        ];
    }
  };

  const list = getSuggestions();

  return (
    <div className="my-4">
      <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Suggested Actions</h3>
      <div className="flex flex-col gap-2">
        {list.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelect(item.text)}
              className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg text-left text-xs text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-blue-500" />
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AISuggestions;
