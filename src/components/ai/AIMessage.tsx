import React from "react";
import { Bot } from "lucide-react";

interface AIMessageProps {
  sender: "user" | "bot";
  text: string;
}

export const AIMessage: React.FC<AIMessageProps> = ({ sender, text }) => {
  const isUser = sender === "user";
  return (
    <div className={`flex gap-3 my-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Bot className="w-5 h-5" />
        </div>
      )}
      <div
        className={`max-w-[75%] p-3 rounded-lg text-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-line">{text}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
          U
        </div>
      )}
    </div>
  );
};

export default AIMessage;
