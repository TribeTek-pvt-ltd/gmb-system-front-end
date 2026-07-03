"use client";

import React from "react";
import { Printer, Edit3, Eye, FileText, Send, ChevronLeft, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Rejected";

interface QuotationToolbarProps {
  quoteNumber: string;
  customerName: string;
  date: string;
  status: QuotationStatus;
  isEditing: boolean;
  isSaving?: boolean;
  onToggleEdit: () => void;
  onPrint: () => void;
  onSave?: () => void;
  onSend?: () => void;
  onStatusChange?: (status: QuotationStatus) => void;
  backHref?: string;
}

const statusStyles: Record<QuotationStatus, string> = {
  Draft:    "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Sent:     "bg-accent/10 text-accent border-accent/20",
  Accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
};

const allStatuses: QuotationStatus[] = ["Draft", "Sent", "Accepted", "Rejected"];

export function QuotationToolbar({
  quoteNumber,
  customerName,
  date,
  status,
  isEditing,
  isSaving,
  onToggleEdit,
  onPrint,
  onSave,
  onSend,
  onStatusChange,
  backHref = "/quotations",
}: QuotationToolbarProps) {
  const [statusOpen, setStatusOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between no-print bg-card text-card-foreground p-4 rounded-xl border border-border shadow-md sticky top-0 z-50 transition-colors duration-300 gap-3 flex-wrap">
      {/* Left — back + info */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href={backHref}>
          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-accent/10 text-accent flex items-center justify-center rounded-lg shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-none mb-1 truncate">
              Quotation {quoteNumber}
            </h2>
            <p className="text-xs text-muted-foreground truncate">{customerName} • {date}</p>
          </div>
        </div>

        {/* Status badge / dropdown */}
        <div className="relative">
          <button
            onClick={() => onStatusChange && setStatusOpen((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${statusStyles[status]} ${
              onStatusChange ? "cursor-pointer hover:opacity-80" : "cursor-default"
            }`}
          >
            {status}
            {onStatusChange && <ChevronDown className="h-3 w-3 opacity-60" />}
          </button>

          {statusOpen && onStatusChange && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
              <div className="absolute left-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-40">
                {allStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(s); setStatusOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors text-foreground"
                  >
                    <span>{s}</span>
                    {s === status && <Check className="h-3.5 w-3.5 text-accent" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Toggle edit/preview */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleEdit}
          className="border-accent/20 text-accent hover:bg-accent/10 transition-all font-semibold"
        >
          {isEditing ? (
            <><Eye className="mr-2 h-4 w-4" /> Preview</>
          ) : (
            <><Edit3 className="mr-2 h-4 w-4" /> Edit</>
          )}
        </Button>

        {/* Save */}
        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="font-semibold"
          >
            {isSaving ? "Saving…" : "Save Draft"}
          </Button>
        )}

        {/* Send */}
        {onSend && status !== "Sent" && status !== "Accepted" && (
          <Button
            size="sm"
            onClick={onSend}
            className="bg-gradient-to-r from-accent to-indigo-600 text-white hover:from-accent/90 hover:to-indigo-700 shadow-md shadow-accent/20 font-semibold"
          >
            <Send className="mr-2 h-4 w-4" /> Send to Client
          </Button>
        )}

        {/* Print */}
        <Button
          size="sm"
          variant="outline"
          onClick={onPrint}
          className="font-semibold"
        >
          <Printer className="mr-2 h-4 w-4" /> Print A4
        </Button>
      </div>
    </div>
  );
}
