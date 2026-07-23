import React from "react";
import AIChat from "./AIChat";
import { X, Sparkles } from "lucide-react";

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose, role }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-300 transform translate-x-0">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-teal-500 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold text-sm">Hospital AI Assistant</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-md transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <AIChat role={role} />
    </div>
  );
};

export default AIAssistantDrawer;
