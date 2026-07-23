import React, { useState } from "react";
import AIMessage from "./AIMessage";
import AITypingIndicator from "./AITypingIndicator";
import AISuggestions from "./AISuggestions";
import AISourceCard from "./AISourceCard";
import { Send, Trash2 } from "lucide-react";
import { api } from "../../services/api";

interface AIChatProps {
  role: string;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

export const AIChat: React.FC<AIChatProps> = ({ role }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<{ title: string; category: string }[]>([]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);

    try {
      const response = await api.request<{
        answer: string;
        sources: { title: string; category: string }[];
      }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: text, role })
      });
      setMessages((prev) => [...prev, { sender: "bot", text: response.answer }]);
      setSources(response.sources || []);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "AI Response failed: Service Offline." }]);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] justify-between">
      <div className="overflow-y-auto px-4 py-2 flex-grow">
        {messages.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            <p>🤖 Welcome to Hospital AI Assistant.</p>
            <p>Ask anything about patients, SOPs, or stock levels.</p>
            <AISuggestions role={role} onSelect={handleSend} />
          </div>
        )}
        
        {messages.map((m, i) => (
          <AIMessage key={i} sender={m.sender} text={m.text} />
        ))}
        {loading && <AITypingIndicator />}

        {sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Retrieved References</h4>
            <div className="grid grid-cols-2 gap-2">
              {sources.map((s, idx) => (
                <AISourceCard key={idx} title={s.title} category={s.category} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-white flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI..."
          className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
        />
        <button
          onClick={() => handleSend(input)}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setMessages([]);
            setSources([]);
          }}
          className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
