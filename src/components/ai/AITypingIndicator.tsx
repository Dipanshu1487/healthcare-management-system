import React from "react";
import { Bot } from "lucide-react";

export const AITypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 my-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        <Bot className="w-5 h-5" />
      </div>
      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none flex items-center gap-1">
        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
      </div>
    </div>
  );
};

export default AITypingIndicator;
