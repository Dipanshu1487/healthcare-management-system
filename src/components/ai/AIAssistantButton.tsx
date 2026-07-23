import React from "react";
import { Sparkles } from "lucide-react";

interface AIAssistantButtonProps {
  onClick: () => void;
}

export const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 border border-slate-100 rounded-xl transition-colors bg-white shadow-sm flex items-center justify-center"
      aria-label="AI Assistant"
    >
      <Sparkles className="w-5 h-5 text-blue-500" />
    </button>
  );
};

export default AIAssistantButton;
