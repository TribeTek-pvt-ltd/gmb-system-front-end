import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  color?: "accent" | "green" | "blue" | "orange" | "purple" | "muted";
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function SectionCard({ 
  icon: Icon, 
  title, 
  color = "accent", 
  children, 
  className,
  headerClassName
}: SectionCardProps) {
  const colorClasses = {
    accent: "bg-accent/15 text-accent",
    green: "bg-green-500/15 text-green-500",
    blue: "bg-blue-500/15 text-blue-500",
    orange: "bg-orange-500/15 text-orange-500",
    purple: "bg-purple-500/15 text-purple-500",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-sm overflow-hidden", className)}>
      <div className={cn("flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20", headerClassName)}>
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
