"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Filter, Eye, Edit2, Trash2, Send,
  FileText, CheckCircle2, Clock, XCircle, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "Draft" | "Sent" | "Accepted" | "Rejected";
type FilterType = "all" | Status;

interface QuotationRecord {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerPhone: string;
  date: string;
  expiryDate: string;
  total: number;
  itemCount: number;
  status: Status;
}

// Mock data — replace with Supabase fetch when ready
const mockQuotations: QuotationRecord[] = [
  {
    id: "Q-0042",
    quoteNumber: "Q-0042",
    customerName: "Charlie Davis",
    customerPhone: "+61 444 555 666",
    date: "2026-10-15",
    expiryDate: "2026-11-15",
    total: 1107.00,
    itemCount: 2,
    status: "Sent",
  },
  {
    id: "Q-0041",
    quoteNumber: "Q-0041",
    customerName: "Jane Smith",
    customerPhone: "+61 403 987 654",
    date: "2026-10-10",
    expiryDate: "2026-11-10",
    total: 860.00,
    itemCount: 3,
    status: "Accepted",
  },
  {
    id: "Q-0040",
    quoteNumber: "Q-0040",
    customerName: "John & Sarah Doe",
    customerPhone: "+61 412 345 678",
    date: "2026-10-05",
    expiryDate: "2026-11-05",
    total: 2450.00,
    itemCount: 5,
    status: "Draft",
  },
  {
    id: "Q-0039",
    quoteNumber: "Q-0039",
    customerName: "Michael Johnson",
    customerPhone: "+61 432 111 222",
    date: "2026-09-28",
    expiryDate: "2026-10-28",
    total: 390.00,
    itemCount: 1,
    status: "Rejected",
  },
  {
    id: "Q-0038",
    quoteNumber: "Q-0038",
    customerName: "Emily Chen",
    customerPhone: "+61 455 678 901",
    date: "2026-09-22",
    expiryDate: "2026-10-22",
    total: 1780.00,
    itemCount: 4,
    status: "Draft",
  },
];

const statusConfig: Record<Status, { label: string; cls: string; icon: React.ElementType }> = {
  Draft:    { label: "Draft",    cls: "bg-slate-500/10 text-slate-400 border border-slate-500/20",     icon: AlertCircle },
  Sent:     { label: "Sent",     cls: "bg-accent/10 text-accent border border-accent/20",              icon: Clock },
  Accepted: { label: "Accepted", cls: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20", icon: CheckCircle2 },
  Rejected: { label: "Rejected", cls: "bg-red-500/10 text-red-500 border border-red-500/20",          icon: XCircle },
};

const filterTabs: { key: FilterType; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "Draft",    label: "Draft" },
  { key: "Sent",     label: "Sent" },
  { key: "Accepted", label: "Accepted" },
  { key: "Rejected", label: "Rejected" },
];

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [data, setData] = useState(mockQuotations);
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);

  const filtered = data.filter((q) => {
    const matchFilter = filter === "all" || q.status === filter;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      q.customerName.toLowerCase().includes(term) ||
      q.quoteNumber.toLowerCase().includes(term);
    return matchFilter && matchSearch;
  });

  const handleSend = (id: string) => {
    setData((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "Sent" as Status } : q))
    );
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    setData((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
    setOpenStatusId(null);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((q) => q.id !== id));
  };

  // Stats
  const stats = [
    { label: "Total",    value: data.length,                                      color: "accent",   icon: FileText },
    { label: "Draft",    value: data.filter((q) => q.status === "Draft").length,  color: "slate",    icon: AlertCircle },
    { label: "Sent",     value: data.filter((q) => q.status === "Sent").length,   color: "blue",     icon: Clock },
    { label: "Accepted", value: data.filter((q) => q.status === "Accepted").length, color: "emerald", icon: CheckCircle2 },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Quotations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and send pricing quotations to customers.
          </p>
        </div>
        <Link href="/quotations/new">
          <Button className="gap-2 bg-gradient-to-r from-accent to-indigo-600 text-white shadow-md shadow-accent/20 hover:from-accent/90 hover:to-indigo-700">
            <Plus className="h-4 w-4" /> New Quotation
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              color === "accent"  ? "bg-accent/10 text-accent" :
              color === "emerald" ? "bg-emerald-500/10 text-emerald-500" :
              color === "blue"    ? "bg-blue-500/10 text-blue-500" :
              "bg-slate-500/10 text-slate-400"
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border bg-muted/20">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or quote #…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-background/60 outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex rounded-xl border border-border p-1 bg-background/50 gap-1 flex-wrap">
              {filterTabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    filter === key
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/10 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Quote #</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">Date</th>
                <th className="px-6 py-4 font-semibold hidden lg:table-cell">Expiry</th>
                <th className="px-6 py-4 font-semibold hidden sm:table-cell">Items</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No quotations found</p>
                    <p className="text-xs mt-1">Try adjusting filters or create a new quotation</p>
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const s = statusConfig[q.status];
                  const StatusIcon = s.icon;
                  return (
                    <tr key={q.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-accent">{q.quoteNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{q.customerName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{q.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-xs text-muted-foreground">
                        {new Date(q.date).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-xs text-muted-foreground">
                        {new Date(q.expiryDate).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-xs text-muted-foreground">
                        {q.itemCount} item{q.itemCount !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-foreground">${q.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenStatusId(openStatusId === q.id ? null : q.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer ${s.cls}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {s.label}
                          </button>
                          
                          {openStatusId === q.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenStatusId(null)} />
                              <div className="absolute left-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-32 py-1">
                                {filterTabs.filter(t => t.key !== 'all').map((t) => (
                                  <button
                                    key={t.key}
                                    onClick={() => handleStatusChange(q.id, t.key as Status)}
                                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors text-foreground flex items-center justify-between"
                                  >
                                    {t.label}
                                    {t.key === q.status && <CheckCircle2 className="h-3 w-3 text-accent" />}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/quotation/${q.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-accent"
                              title="View / Edit"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {q.status === "Draft" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-blue-500"
                              title="Mark as Sent"
                              onClick={() => handleSend(q.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500"
                            title="Delete"
                            onClick={() => handleDelete(q.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            <span className="font-semibold text-foreground">{data.length}</span> quotations
          </p>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Total value:{" "}
            <span className="font-semibold text-foreground">
              ${filtered.reduce((s, q) => s + q.total, 0).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
