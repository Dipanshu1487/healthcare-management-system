import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  className,
  actionLabel,
  onActionClick
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto space-y-4 animate-fade-in",
        className
      )}
    >
      <div className="p-4 bg-slate-100 rounded-full text-slate-400">
        <Icon size={32} />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 max-w-xs">{description}</p>
      </div>
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="btn-primary text-xs px-4 py-2 rounded-xl font-bold shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
