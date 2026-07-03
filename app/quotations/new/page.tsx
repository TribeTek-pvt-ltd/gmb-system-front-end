"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Search, ClipboardList, CheckCircle2, Clock,
  FileWarning, FileText, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type SheetStatus = "Final" | "For Quotation" | "Draft";

interface MeasurementSheet {
  id: string;
  jobNo: string;
  customerName: string;
  address: string;
  phoneNo: string;
  date: string;
  status: SheetStatus;
  locationsCount: number;
  coveringsCount: number;
}

// Shared mock data (matches /measurements page)
const mockSheets: MeasurementSheet[] = [
  {
    id: "1", jobNo: "J-1001", customerName: "John & Sarah Doe",
    address: "42 Oakwood Drive, Glen Waverley VIC 3150",
    phoneNo: "+61 412 345 678", date: "2024-03-20",
    status: "Final", locationsCount: 5, coveringsCount: 9,
  },
  {
    id: "2", jobNo: "J-1002", customerName: "Jane Smith",
    address: "15 Harbour View Rd, Brighton VIC 3186",
    phoneNo: "+61 403 987 654", date: "2024-03-21",
    status: "For Quotation", locationsCount: 3, coveringsCount: 4,
  },
  {
    id: "3", jobNo: "J-1003", customerName: "Michael Johnson",
    address: "8 Balmoral Court, Hawthorn VIC 3122",
    phoneNo: "+61 432 111 222", date: "2024-03-22",
    status: "Final", locationsCount: 7, coveringsCount: 13,
  },
  {
    id: "4", jobNo: "J-1004", customerName: "Emily Chen",
    address: "23 Rosewood Ave, Balwyn VIC 3103",
    phoneNo: "+61 455 678 901", date: "2024-03-24",
    status: "Draft", locationsCount: 2, coveringsCount: 3,
  },
  {
    id: "5", jobNo: "J-1005", customerName: "Carlos & Ana Rivera",
    address: "101 Federation Blvd, Doncaster VIC 3108",
    phoneNo: "+61 499 234 567", date: "2024-03-25",
    status: "For Quotation", locationsCount: 4, coveringsCount: 7,
  },
];

const statusConfig: Record<SheetStatus, { cls: string; icon: React.ElementType; label: string }> = {
  Final:          { label: "Final",        cls: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20", icon: CheckCircle2 },
  "For Quotation":{ label: "For Quotation",cls: "bg-amber-500/10 text-amber-500 border border-amber-500/20",     icon: Clock },
  Draft:          { label: "Draft",        cls: "bg-slate-500/10 text-slate-400 border border-slate-500/20",      icon: FileWarning },
};

export default function NewQuotationPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = mockSheets.filter((s) => {
    const term = search.toLowerCase();
    return (
      !term ||
      s.customerName.toLowerCase().includes(term) ||
      s.jobNo.toLowerCase().includes(term) ||
      s.address.toLowerCase().includes(term)
    );
  });

  const handleGenerate = () => {
    if (!selectedId) return;
    router.push(`/quotations/generate?measurementId=${selectedId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border mb-8">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/quotations">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">New Quotation</h1>
              <p className="text-xs text-muted-foreground">
                Pick a measurement sheet to generate a quotation from
              </p>
            </div>
          </div>
          <Button
            disabled={!selectedId}
            onClick={handleGenerate}
            className="gap-2 bg-gradient-to-r from-accent to-indigo-600 text-white shadow-md shadow-accent/20 hover:from-accent/90 hover:to-indigo-700 disabled:opacity-40"
          >
            Generate Quotation <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-4 mb-6">
          <FileText className="h-5 w-5 text-accent mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select a measurement sheet below. All coverings and locations will be imported as line items in the quotation editor, which you can then price and customise before sending.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, job no or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background/60 outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Sheet cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ClipboardList className="h-10 w-10 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No sheets found</p>
            <p className="text-sm mt-1">Adjust your search or go create a measurement sheet first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((sheet) => {
              const s = statusConfig[sheet.status];
              const StatusIcon = s.icon;
              const isSelected = selectedId === sheet.id;

              return (
                <button
                  key={sheet.id}
                  onClick={() => setSelectedId(isSelected ? null : sheet.id)}
                  className={`group text-left rounded-2xl border-2 p-5 transition-all duration-200 focus:outline-none ${
                    isSelected
                      ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                      : "border-border bg-card hover:border-accent/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-accent">{sheet.jobNo}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
                      <StatusIcon className="h-3 w-3" />
                      {s.label}
                    </span>
                  </div>

                  <p className="font-bold text-foreground text-base mb-0.5">{sheet.customerName}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{sheet.address}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>
                        <span className="font-semibold text-foreground">{sheet.locationsCount}</span> locations
                      </span>
                      <span>·</span>
                      <span>
                        <span className="font-semibold text-foreground">{sheet.coveringsCount}</span> coverings
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(sheet.date).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-accent/20 flex items-center gap-2 text-accent text-xs font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Selected — click "Generate Quotation" above
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
