import * as React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputCls = "w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition-all";
export const selectCls = inputCls + " cursor-pointer";
export const dimInputCls = "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-center font-mono text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition-all";

export function InputField({ label, id, required, children, className }: {
  label: string; 
  id?: string; 
  required?: boolean; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
        {label} {required && <span className="text-red-400 normal-case tracking-normal">*</span>}
      </label>
      {children}
    </div>
  );
}

export function NoteTextarea({ value, onChange, placeholder, className, rows = 2 }: {
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string;
  className?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? "Add notes…"}
      className={cn(inputCls, "resize-none", className)}
    />
  );
}

export function TogglePill({ label, checked, onChange, className }: {
  label: string; 
  checked: boolean; 
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
        checked
          ? "bg-accent text-accent-foreground border-accent shadow-sm"
          : "bg-muted/30 text-muted-foreground border-border hover:border-accent/50",
        className
      )}
    >
      {checked ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5 opacity-50" />}
      {label}
    </button>
  );
}
