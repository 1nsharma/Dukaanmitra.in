import React from "react";
import { Card } from "./Card";
import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: "indigo" | "emerald" | "rose" | "amber";
  className?: string;
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  label,
  value,
  icon,
  trend,
  color = "indigo",
  className,
}) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <Card className={cn("overflow-hidden relative", className)}>
      <Card.Content className="flex items-center gap-8 p-0">
        <div
          className={cn(
            "w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-500",
            colors[color],
          )}
        >
          {icon}
        </div>
        <div className="space-y-2 min-w-0 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] leading-none mb-1">
            {label}
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none truncate">
              {value}
            </h3>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-black uppercase tracking-tight px-3 py-1 rounded-full shadow-sm",
                  trend.isUp
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600",
                )}
              >
                {trend.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend.value}%
              </div>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
