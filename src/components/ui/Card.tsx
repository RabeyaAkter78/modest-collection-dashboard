import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function StatCard({ title, value, icon, change, changeType = "neutral" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-danger",
                changeType === "neutral" && "text-slate-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}
