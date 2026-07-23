import React from "react";
import { Link2 } from "lucide-react";

interface AISourceCardProps {
  title: string;
  category: string;
}

export const AISourceCard: React.FC<AISourceCardProps> = ({ title, category }) => {
  return (
    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-xs">
      <Link2 className="w-3.5 h-3.5 text-blue-500" />
      <div>
        <span className="font-semibold text-gray-700 block">{title}</span>
        <span className="text-gray-500">{category}</span>
      </div>
    </div>
  );
};

export default AISourceCard;
