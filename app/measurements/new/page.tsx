"use client";

import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type CoveringType =
  | "Roller Blinds" | "Curtain" | "Sheer" | "Roman Blind"
  | "Venetian" | "Plantation Shutter" | "No Covering" | "Other";

interface CoveringRow {
  id: string;
  coveringType: CoveringType;
  opacity: string;
  qty: number;
  spec: string;
  // Specification
  sp1: string; sp2: string; sp3: string;
  // Control
  c1: string; c2: string; c3: string; c4: string;
  // Mounting Point
  m1: string; m3: string; m4: string; surface: string;
  // Components
  com1: string; brackets: string;
  // In Frame
  inWidth: number; inDrop: number;
  // Out Frame
  outWidth: number; outDrop: number;
  addL: number; addR: number; endToEnd: number;
  // Position
  above: string; uc: string; ceil: string; floor: string;
  // Notes
  productNote: string; productionNote: string; installNote: string;
  quotationNote: string; quotationSent: boolean; quotationChanged: boolean;
}

interface WindowLocation {
  id: number;
  locationName: string;
  coverings: CoveringRow[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const coveringTypes: CoveringType[] = [
  "Roller Blinds", "Curtain", "Sheer", "Roman Blind",
  "Venetian", "Plantation Shutter", "No Covering", "Other",
];

const opacityOptions = ["Blackout", "Dim-Out", "Light-Filter", "See-Through", "Translucent", "N/A"];
const sp1Options = ["Front Roll", "Back Roll", "Wave", "Pinch Pleat", "Eyelet", "Slats89Mm", "N/A"];
const sp2Options = ["Rolling Up & Down", "Hinged", "Fixed", "N/A"];
const sp3Options = ["stainless Chain", "By Wand", "By Hand", "Motorised", "Cord", "N/A"];
const c4Options = ["bottom rail Ovel", "bottom rail Square", "direct mount window frame", "N/A"];
const m1Options = ["window", "wall to wall", "N/A"];
const m3Options = ["under cornise to floor", "floor to ceiling", "window", "N/A"];
const m4Options = ["Under Cornice", "Ceiling", "In Frame", "Out Frame", "N/A"];
const surfaceOptions = ["on plaster", "on timber / MDF", "on brick", "on concrete", "N/A"];
const bracketOptions = [
  "Single standard BKT", "Extra double BKT", "Single face fix BKT",
  "Ceiling top fix BKT", "GMB STD track", "N/A",
];
const com1ColorOptions = ["White", "Charcoal", "Black", "Cream", "Grey", "N/A"];
const houseTypeOptions = [
  "House", "Townhouse", "Apartment", "Unit", "Villa", "Commercial", "Other"
];
const jobTypeOptions = [
  "New Installation", "Replacement", "Repair", "Consultation", "Measure Only"
];
const jobHardnessOptions = ["Easy", "Standard", "Complex", "Very Complex"];
const measuredOrderOptions = ["Room by Room", "floor by floor", "Front to Back", "Other"];
const floorOptions = ["Ground", "1st Floor", "2nd Floor", "Multi Level", "N/A"];
const installersOptions = ["1", "2", "3", "4+"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const newCovering = (): CoveringRow => ({
  id: uid(), coveringType: "Roller Blinds", opacity: "Blackout", qty: 1,
  spec: "", sp1: "Front Roll", sp2: "Rolling Up & Down", sp3: "stainless Chain",
  c1: "", c2: "", c3: "", c4: "bottom rail Ovel",
  m1: "window", m3: "window", m4: "In Frame", surface: "on timber / MDF",
  com1: "White", brackets: "Single standard BKT",
  inWidth: 0, inDrop: 0, outWidth: 0, outDrop: 0,
  addL: 0, addR: 0, endToEnd: 0,
  above: "", uc: "", ceil: "", floor: "",
  productNote: "", productionNote: "", installNote: "",
  quotationNote: "", quotationSent: false, quotationChanged: false,
});

const newLocation = (id: number): WindowLocation => ({
  id, locationName: "", coverings: [newCovering()],
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, title, defaultExpanded = true, color = "accent", children }: {
  icon: React.ElementType; title: string; defaultExpanded?: boolean; color?: string; children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color === "accent" ? "bg-accent/15 text-accent" :
              color === "green" ? "bg-green-500/15 text-green-500" :
                color === "blue" ? "bg-blue-500/15 text-blue-500" :
                  color === "orange" ? "bg-orange-500/15 text-orange-500" :
                    color === "purple" ? "bg-purple-500/15 text-purple-500" :
                      "bg-muted text-muted-foreground"
            }`}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, id, required, children }: {
  label: string; id: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-red-400 normal-case tracking-normal">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition-all";
const selectCls = inputCls + " cursor-pointer";
const dimInputCls = "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-center font-mono text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition-all";

function NoteTextarea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <textarea
      rows={2}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? "Add notes…"}
      className={inputCls + " resize-none"}
    />
  );
}

function TogglePill({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${checked
          ? "bg-accent text-accent-foreground border-accent shadow-sm"
          : "bg-muted/30 text-muted-foreground border-border hover:border-accent/50"
        }`}
    >
      {checked ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5 opacity-50" />}
      {label}
    </button>
  );
}

// ─── Covering Form ─────────────────────────────────────────────────────────────

type TabOptions = "details" | "dimensions" | "hardware" | "notes";

function CoveringForm({
  cov, locId, update, onDelete, showDelete,
}: {
  cov: CoveringRow;
  locId: number;
  update: (field: keyof CoveringRow, val: any) => void;
  onDelete: () => void;
  showDelete: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<TabOptions>("details");

  const typeColor =
    cov.coveringType === "Curtain" || cov.coveringType === "Sheer" ? "purple" :
      cov.coveringType === "Roller Blinds" ? "blue" :
        cov.coveringType === "Plantation Shutter" ? "green" :
          cov.coveringType === "No Covering" ? "muted" : "orange";

  const tabs: { id: TabOptions; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "dimensions", label: "Dimensions" },
    { id: "hardware", label: "Hardware" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className={`rounded-xl border transition-all duration-300 ${cov.coveringType === "No Covering" ? "border-border/40 bg-muted/10" : "border-border bg-card shadow-sm"
      }`}>
      {/* Covering Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/10 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColor === "purple" ? "bg-purple-500/15 text-purple-500" :
            typeColor === "blue" ? "bg-blue-500/15 text-blue-500" :
              typeColor === "green" ? "bg-green-500/15 text-green-500" :
                typeColor === "orange" ? "bg-orange-500/15 text-orange-500" :
                  "bg-muted/50 text-muted-foreground"
          }`}>
          <Layers className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{cov.coveringType}</p>
          {!expanded && cov.coveringType !== "No Covering" && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {cov.qty}x • {cov.opacity !== "N/A" ? cov.opacity : cov.spec || "No fabric specified"} • {cov.inWidth ? `${cov.inWidth}w` : "?w"} x {cov.inDrop ? `${cov.inDrop}d` : "?d"} {cov.m4 !== "N/A" ? `• ${cov.m4}` : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showDelete && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
              title="Delete covering"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && cov.coveringType !== "No Covering" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-border/50"
          >
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-border bg-muted/5 px-4 pt-1">
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`whitespace-nowrap px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === t.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Tab: DETAILS */}
              {activeTab === "details" && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 md:col-span-4">
                    <InputField label="Covering Type" id="">
                      <select value={cov.coveringType} onChange={e => update("coveringType", e.target.value)} className={selectCls}>
                        {coveringTypes.filter(t => t !== "No Covering").map(t => <option key={t}>{t}</option>)}
                      </select>
                    </InputField>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <InputField label="Opacity / Style" id="">
                      <select value={cov.opacity} onChange={e => update("opacity", e.target.value)} className={selectCls}>
                        {opacityOptions.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </InputField>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <InputField label="Qty" id="">
                      <input type="number" min={1} value={cov.qty} onChange={e => update("qty", parseInt(e.target.value) || 1)}
                        className={inputCls + " text-center font-mono"} />
                    </InputField>
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <InputField label="Fabric / Spec" id="">
                      <input type="text" value={cov.spec} onChange={e => update("spec", e.target.value)}
                        placeholder="e.g. Group 3 - Shaw Karma" className={inputCls} />
                    </InputField>
                  </div>
                </motion.div>
              )}

              {/* Tab: DIMENSIONS */}
              {activeTab === "dimensions" && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* In Frame */}
                    <div className="rounded-xl border border-border/60 p-4 bg-muted/10">
                      <p className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-2 mb-3 border-b border-border/40 pb-2">
                        <Maximize2 className="h-3 w-3" /> In Frame Dimensions
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Width (mm)" id="">
                          <input type="number" value={cov.inWidth || ""} onChange={e => update("inWidth", parseFloat(e.target.value) || 0)}
                            className={dimInputCls} placeholder="0" />
                        </InputField>
                        <InputField label="Drop (mm)" id="">
                          <input type="number" value={cov.inDrop || ""} onChange={e => update("inDrop", parseFloat(e.target.value) || 0)}
                            className={dimInputCls} placeholder="0" />
                        </InputField>
                      </div>
                    </div>
                    {/* Out Frame */}
                    <div className="rounded-xl border border-border/60 p-4 bg-muted/10">
                      <p className="text-[10px] font-bold text-orange-500 uppercase flex items-center gap-2 mb-3 border-b border-border/40 pb-2">
                        <AppWindow className="h-3 w-3" /> Out Frame Dimensions
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Width (mm)" id="">
                          <input type="number" value={cov.outWidth || ""} onChange={e => update("outWidth", parseFloat(e.target.value) || 0)}
                            className={dimInputCls} placeholder="0" />
                        </InputField>
                        <InputField label="Drop (mm)" id="">
                          <input type="number" value={cov.outDrop || ""} onChange={e => update("outDrop", parseFloat(e.target.value) || 0)}
                            className={dimInputCls} placeholder="0" />
                        </InputField>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 p-4 bg-muted/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-3">Adjustments & Clearances</p>
                    <div className="grid grid-cols-3 gap-4">
                      <InputField label="Add Left (mm)" id="">
                        <input type="number" value={cov.addL || ""} onChange={e => update("addL", parseFloat(e.target.value) || 0)}
                          className={dimInputCls} placeholder="0" />
                      </InputField>
                      <InputField label="Add Right (mm)" id="">
                        <input type="number" value={cov.addR || ""} onChange={e => update("addR", parseFloat(e.target.value) || 0)}
                          className={dimInputCls} placeholder="0" />
                      </InputField>
                      <InputField label="End–End (mm)" id="">
                        <input type="number" value={cov.endToEnd || ""} onChange={e => update("endToEnd", parseFloat(e.target.value) || 0)}
                          className={dimInputCls} placeholder="0" />
                      </InputField>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: HARDWARE */}
              {activeTab === "hardware" && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Specifics */}
                  <div className="rounded-xl border border-border/60 p-4 bg-muted/5 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Specs & Controls</p>
                    <InputField label="SP1 — Style" id="">
                      <select value={cov.sp1} onChange={e => update("sp1", e.target.value)} className={selectCls}>
                        {sp1Options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </InputField>
                    <InputField label="SP2 — Operation" id="">
                      <select value={cov.sp2} onChange={e => update("sp2", e.target.value)} className={selectCls}>
                        {sp2Options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </InputField>
                    <InputField label="SP3 — Control Drive" id="">
                      <select value={cov.sp3} onChange={e => update("sp3", e.target.value)} className={selectCls}>
                        {sp3Options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </InputField>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {(["c1", "c2", "c3"] as const).map(f => (
                        <InputField key={f} label={f.toUpperCase()} id="">
                          <input type="text" value={cov[f]} onChange={e => update(f, e.target.value)}
                            className={inputCls + " text-center px-1"} placeholder="—" />
                        </InputField>
                      ))}
                    </div>
                    <InputField label="C4 — Bottom Rail" id="">
                      <select value={cov.c4} onChange={e => update("c4", e.target.value)} className={selectCls}>
                        {c4Options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </InputField>
                  </div>

                  {/* Mounting */}
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/60 p-4 bg-muted/5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Mounting Point</p>
                      <InputField label="M1 — Width Range" id="">
                        <select value={cov.m1} onChange={e => update("m1", e.target.value)} className={selectCls}>
                          {m1Options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </InputField>
                      <InputField label="M3 — Drop Range" id="">
                        <select value={cov.m3} onChange={e => update("m3", e.target.value)} className={selectCls}>
                          {m3Options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </InputField>
                      <InputField label="M4 — Fixing Point" id="">
                        <select value={cov.m4} onChange={e => update("m4", e.target.value)} className={selectCls}>
                          {m4Options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </InputField>
                      <InputField label="Surface" id="">
                        <select value={cov.surface} onChange={e => update("surface", e.target.value)} className={selectCls}>
                          {surfaceOptions.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </InputField>
                    </div>

                    <div className="rounded-xl border border-border/60 p-4 bg-muted/5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Components</p>
                      <InputField label="Com 1 — Colour" id="">
                        <select value={cov.com1} onChange={e => update("com1", e.target.value)} className={selectCls}>
                          {com1ColorOptions.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </InputField>
                      <InputField label="Brackets" id="">
                        <select value={cov.brackets} onChange={e => update("brackets", e.target.value)} className={selectCls}>
                          {bracketOptions.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </InputField>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: NOTES */}
              {activeTab === "notes" && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="rounded-xl border border-border/60 p-4 bg-muted/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-3">Position References</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(["above", "uc", "ceil", "floor"] as const).map(f => (
                        <InputField key={f} label={f === "above" ? "Above" : f === "uc" ? "UC" : f === "ceil" ? "Ceiling" : "Floor"} id="">
                          <input type="text" value={cov[f]} onChange={e => update(f, e.target.value)}
                            className={inputCls} placeholder="—" />
                        </InputField>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 p-4 bg-muted/5 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status & Notes</p>
                      <div className="flex gap-2">
                        <TogglePill label="Quoted" checked={cov.quotationSent} onChange={v => update("quotationSent", v)} />
                        <TogglePill label="Changed" checked={cov.quotationChanged} onChange={v => update("quotationChanged", v)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Product Note" id="">
                        <NoteTextarea value={cov.productNote} onChange={v => update("productNote", v)} placeholder="Product-specific instructions…" />
                      </InputField>
                      <InputField label="Production Note" id="">
                        <NoteTextarea value={cov.productionNote} onChange={v => update("productionNote", v)} placeholder="Manufacturing notes…" />
                      </InputField>
                      <InputField label="Installation Note" id="">
                        <NoteTextarea value={cov.installNote} onChange={v => update("installNote", v)} placeholder="Installer instructions…" />
                      </InputField>
                      <InputField label="Quotation Note" id="">
                        <NoteTextarea value={cov.quotationNote} onChange={v => update("quotationNote", v)} placeholder="Notes for pricing…" />
                      </InputField>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Covering minimal display */}
      <AnimatePresence initial={false}>
        {expanded && cov.coveringType === "No Covering" && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-5 pb-4 pt-2 border-t border-border/30">
              <div className="flex items-center gap-3">
                <select value={cov.coveringType} onChange={e => update("coveringType", e.target.value as CoveringType)} className={selectCls + " max-w-xs"}>
                  {coveringTypes.map(t => <option key={t}>{t}</option>)}
                </select>
                <p className="text-sm text-muted-foreground italic">No window covering needed for this location.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewMeasurementPage() {
  // ── Step state ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2>(1);

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    customerType: "New",
    clientName: "",
    clientAddress: "",
    email: "",
    contactNumber: "",
    customer: "",
    jobId: "",
    depositPaid: false,
    date: new Date().toISOString().slice(0, 10),
    parkingFlexibility: "",
    findUs: "",
    pets: "",
    explainProduct: "",
    clientUnderstandsLevel: "",
    customerOrigin: "",
    colourTheme: "",
    fabricSelection: "",
    componentsSelection: "",
    changesToGetDeposit: "",
    houseType: "House",
    existingCovering: "",
    clearances: "",
    damageHoles: "",
    installationTimeframe: "",
    jobType: "New Installation",
    jobHardness: "Standard",
    numberOfInstallers: "2",
    measurementsNote: "",
    measuredOrder: "Room by Room",
    windowsStats: "",
    floorStates: "Ground",
    checkMeasurements: "",
    installationNote: "",
    productNote: "",
    photos: "",
    dateTime: "",
  });

  const updateClientInfo = (field: keyof ClientInfo, val: any) => {
    setClientInfo(prev => ({ ...prev, [field]: val }));
  };

  // ── Step 2: Window Measurements ────────────────────────────────────────────
  const [locations, setLocations] = useState<WindowLocation[]>([newLocation(1)]);
  const [nextLocId, setNextLocId] = useState(2);
  const [activeLocId, setActiveLocId] = useState(1);

  const addLocation = useCallback(() => {
    const loc = newLocation(nextLocId);
    setLocations(p => [...p, loc]);
    setActiveLocId(nextLocId);
    setNextLocId(p => p + 1);
  }, [nextLocId]);

  const duplicateLocation = useCallback((locId: number) => {
    const src = locations.find(l => l.id === locId);
    if (!src) return;
    const cloned: WindowLocation = {
      id: nextLocId,
      locationName: src.locationName ? `${src.locationName} (Copy)` : `Location ${nextLocId}`,
      coverings: src.coverings.map(c => ({ ...c, id: uid() })),
    };
    setLocations(p => [...p, cloned]);
    setActiveLocId(nextLocId);
    setNextLocId(p => p + 1);
  }, [locations, nextLocId]);

  const deleteLocation = useCallback((locId: number) => {
    setLocations(p => {
      const remaining = p.filter(l => l.id !== locId);
      if (remaining.length === 0) return p;
      return remaining;
    });
    setActiveLocId(p => {
      if (p !== locId) return p;
      const remaining = locations.filter(l => l.id !== locId);
      return remaining[0]?.id ?? 1;
    });
  }, [locations]);

  const updateLocName = useCallback((locId: number, name: string) => {
    setLocations(p => p.map(l => l.id === locId ? { ...l, locationName: name } : l));
  }, []);

  const addCovering = useCallback((locId: number) => {
    const cov = newCovering();
    setLocations(p => p.map(l => l.id === locId ? { ...l, coverings: [...l.coverings, cov] } : l));
  }, []);

  const addNoCovering = useCallback((locId: number) => {
    const cov: CoveringRow = { ...newCovering(), id: uid(), coveringType: "No Covering" };
    setLocations(p => p.map(l => l.id === locId ? { ...l, coverings: [...l.coverings, cov] } : l));
  }, []);

  const deleteCovering = useCallback((locId: number, covId: string) => {
    setLocations(p => p.map(l => {
      if (l.id !== locId) return l;
      const remaining = l.coverings.filter(c => c.id !== covId);
      return { ...l, coverings: remaining.length ? remaining : l.coverings };
    }));
  }, []);

  const updateCovering = useCallback((locId: number, covId: string, field: keyof CoveringRow, val: any) => {
    setLocations(p => p.map(l => {
      if (l.id !== locId) return l;
      return { ...l, coverings: l.coverings.map(c => c.id === covId ? { ...c, [field]: val } : c) };
    }));
  }, []);

  const handleSave = () => {
    const payload = { clientInfo, locations };
    console.log("Saved measurement sheet:", payload);
    alert("✅ Measurement sheet saved successfully!");
  };

  const activeLoc = locations.find(l => l.id === activeLocId);

  // ─── Step 1 Render ─────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="space-y-6"
    >
      {/* CLIENT INFO */}
      <SectionCard icon={User} title="Client Information" color="accent" defaultExpanded={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField label="Client Name & Address" id="clientName" required>
            <input id="clientName" value={clientName} onChange={e => setClientName(e.target.value)}
              className={inputCls} placeholder="Full name" />
          </InputField>
          <InputField label="Street Address" id="clientAddress">
            <input id="clientAddress" value={clientAddress} onChange={e => setClientAddress(e.target.value)}
              className={inputCls} placeholder="123 Main St, Suburb VIC 3000" />
          </InputField>
          <InputField label="Customer / Account" id="customer">
            <input id="customer" value={customer} onChange={e => setCustomer(e.target.value)}
              className={inputCls} placeholder="Account name or reference" />
          </InputField>
          <InputField label="Email Address" id="email">
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              className={inputCls} placeholder="client@email.com" />
          </InputField>
          <InputField label="Contact Number" id="contactNumber" required>
            <input id="contactNumber" type="tel" value={contactNumber} onChange={e => setContactNumber(e.target.value)}
              className={inputCls} placeholder="+61 4xx xxx xxx" />
          </InputField>
          <InputField label="Job ID" id="jobId" required>
            <input id="jobId" value={jobId} onChange={e => setJobId(e.target.value)}
              className={inputCls + " font-mono"} placeholder="J-001" />
          </InputField>
          <InputField label="Date" id="date" required>
            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)}
              className={inputCls} />
          </InputField>
          <InputField label="Appointment Date & Time" id="dateTime">
            <input id="dateTime" type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)}
              className={inputCls} />
          </InputField>
        </div>
      </SectionCard>

      {/* JOB DETAILS */}
      <SectionCard icon={Wrench} title="Job Scope & Details" color="orange" defaultExpanded={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <InputField label="Job Type" id="jobType">
            <select id="jobType" value={jobType} onChange={e => setJobType(e.target.value)} className={selectCls}>
              {jobTypeOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Job Complexity" id="jobHardness">
            <select id="jobHardness" value={jobHardness} onChange={e => setJobHardness(e.target.value)} className={selectCls}>
              {jobHardnessOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="No. of Installers" id="installers">
            <select id="installers" value={numberOfInstallers} onChange={e => setNumberOfInstallers(e.target.value)} className={selectCls}>
              {installersOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Installation Timeframe" id="timeframe">
            <input id="timeframe" value={installationTimeframe} onChange={e => setInstallationTimeframe(e.target.value)}
              className={inputCls} placeholder="e.g. 2 weeks, ASAP" />
          </InputField>
          <InputField label="Measured Order" id="measuredOrder">
            <select id="measuredOrder" value={measuredOrder} onChange={e => setMeasuredOrder(e.target.value)} className={selectCls}>
              {measuredOrderOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="No. of Check Measurements" id="checkMeasurements">
            <input id="checkMeasurements" value={checkMeasurements} onChange={e => setCheckMeasurements(e.target.value)}
              className={inputCls} placeholder="e.g. 3" />
          </InputField>
          <InputField label="Windows Stats" id="windowStats">
            <input id="windowStats" value={windowsStats} onChange={e => setWindowsStats(e.target.value)}
              className={inputCls} placeholder="Total count, types" />
          </InputField>
        </div>
      </SectionCard>

      {/* SITE & PROPERTY */}
      <SectionCard icon={Home} title="Property & Site Conditions" color="blue" defaultExpanded={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField label="House Type" id="houseType">
            <select id="houseType" value={houseType} onChange={e => setHouseType(e.target.value)} className={selectCls}>
              {houseTypeOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Parking Flexibility" id="parking">
            <input id="parking" value={parkingFlexibility} onChange={e => setParkingFlexibility(e.target.value)}
              className={inputCls} placeholder="Street, driveway, tight access…" />
          </InputField>
          <InputField label="Pets" id="pets">
            <input id="pets" value={pets} onChange={e => setPets(e.target.value)}
              className={inputCls} placeholder="Dogs, cats, none…" />
          </InputField>
          <InputField label="Floor States" id="floor">
            <select id="floor" value={floorStates} onChange={e => setFloorStates(e.target.value)} className={selectCls}>
              {floorOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Clearances Around Windows" id="clearances">
            <input id="clearances" value={clearances} onChange={e => setClearances(e.target.value)}
              className={inputCls} placeholder="Note any obstructions" />
          </InputField>
          <InputField label="Damage or Holes" id="damage">
            <input id="damage" value={damageHoles} onChange={e => setDamageHoles(e.target.value)}
              className={inputCls} placeholder="Describe any damage" />
          </InputField>
          <div className="md:col-span-2 lg:col-span-3">
            <InputField label="Existing Covering" id="existing">
              <input id="existing" value={existingCovering} onChange={e => setExistingCovering(e.target.value)}
                className={inputCls} placeholder="Describe what is currently installed" />
            </InputField>
          </div>
        </div>
      </SectionCard>

      {/* CUSTOMER  CONSULTATION */}
      <SectionCard icon={ClipboardList} title="Customer Consultation & Preferences" color="purple" defaultExpanded={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField label="How Did They Find Us" id="findUs">
            <input id="findUs" value={findUs} onChange={e => setFindUs(e.target.value)}
              className={inputCls} placeholder="Google, referral, social media…" />
          </InputField>
          <InputField label="Customer Origin" id="customerOrigin">
            <input id="customerOrigin" value={customerOrigin} onChange={e => setCustomerOrigin(e.target.value)}
              className={inputCls} placeholder="Nationality / background (optional)" />
          </InputField>
          <InputField label="Colour Theme" id="colourTheme">
            <input id="colourTheme" value={colourTheme} onChange={e => setColourTheme(e.target.value)}
              className={inputCls} placeholder="e.g. White, Grey/White, Warm tones" />
          </InputField>
          <InputField label="Explain About Product" id="explain">
            <input id="explain" value={explainProduct} onChange={e => setExplainProduct(e.target.value)}
              className={inputCls} placeholder="Details explained to client" />
          </InputField>
          <InputField label="Client Understands Level" id="understand">
            <input id="understand" value={clientUnderstandsLevel} onChange={e => setClientUnderstandsLevel(e.target.value)}
              className={inputCls} placeholder="e.g. Fully understands, Needs follow-up" />
          </InputField>
          <InputField label="Fabric Selection Notes" id="fabric">
            <input id="fabric" value={fabricSelection} onChange={e => setFabricSelection(e.target.value)}
              className={inputCls} placeholder="Selected fabric groups / favourites" />
          </InputField>
          <InputField label="Components Selection" id="components">
            <input id="components" value={componentsSelection} onChange={e => setComponentsSelection(e.target.value)}
              className={inputCls} placeholder="Track types, motor preferences…" />
          </InputField>
          <div className="md:col-span-2">
            <InputField label="Changes Needed to Get Deposit" id="changes">
              <input id="changes" value={changesToGetDeposit} onChange={e => setChangesToGetDeposit(e.target.value)}
                className={inputCls} placeholder="What needs to happen before deposit is secured…" />
            </InputField>
          </div>
        </div>
      </SectionCard>

      {/* NOTES */}
      <SectionCard icon={FileText} title="General Comments & Notes" color="green" defaultExpanded={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField label="Measurements Note" id="measNote">
            <NoteTextarea value={measurementsNote} onChange={setMeasurementsNote} placeholder="General measurements notes…" />
          </InputField>
          <InputField label="Installation Note" id="instNote">
            <NoteTextarea value={installationNote} onChange={setInstallationNote} placeholder="Installation instructions…" />
          </InputField>
          <InputField label="Product Note" id="prodNote">
            <NoteTextarea value={productNote} onChange={setProductNote} placeholder="Product observations…" />
          </InputField>
          <InputField label="Photos" id="photos">
            <NoteTextarea value={photos} onChange={setPhotos} placeholder="Photo references / locations…" />
          </InputField>
        </div>
      </SectionCard>

      {/* STEP NAVIGATION */}
      <div className="flex justify-end pt-4">
        <Button onClick={() => setStep(2)} size="lg" className="px-8 gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-md transition-all">
          Continue to Window Measurements
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );

  // ─── Step 2 Render ─────────────────────────────────────────────────────────
  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      {/* Summary Bar */}
      <div className="rounded-2xl border border-border bg-card/60 p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-accent" />
          <span className="font-semibold text-foreground">{clientName || "Unnamed Client"}</span>
        </div>
        {jobId && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> <span className="font-mono">{jobId}</span>
          </div>
        )}
        {clientAddress && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> <span>{clientAddress}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-auto">
          <span className="text-xs font-medium">{locations.reduce((a, l) => a + l.coverings.length, 0)} coverings across {locations.length} location(s)</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: location list */}
        <div className="lg:w-64 shrink-0 space-y-2">
          <div className="flex items-center justify-between px-1 mb-2 hidden lg:flex">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Locations</p>
            <button type="button" onClick={addLocation}
              className="p-1 rounded-lg hover:bg-accent/10 text-accent transition-colors" title="Add location">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Location Selector (horizontal) */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {locations.map((loc, idx) => (
              <button key={loc.id} type="button" onClick={() => setActiveLocId(loc.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${activeLocId === loc.id ? "bg-accent text-accent-foreground" : "bg-card border border-border text-foreground hover:bg-muted/50"
                  }`}>
                {loc.locationName || `Loc ${idx + 1}`}
              </button>
            ))}
            <button type="button" onClick={addLocation}
              className="flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground bg-card border border-dashed border-border hover:border-accent hover:text-accent transition-all">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {/* Desktop Location Selector (vertical list) */}
          <div className="hidden lg:flex flex-col gap-2">
            {locations.map((loc, idx) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActiveLocId(loc.id)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${activeLocId === loc.id
                    ? "bg-accent/10 border-accent/20 text-accent shadow-sm"
                    : "bg-card border-transparent text-foreground hover:bg-muted/40"
                  } border`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeLocId === loc.id ? "bg-accent text-accent-foreground" : "bg-muted/60 text-muted-foreground"
                  }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activeLocId === loc.id ? "text-accent" : ""}`}>
                    {loc.locationName || `Location ${idx + 1}`}
                  </p>
                  <p className={`text-[10px] ${activeLocId === loc.id ? "text-accent/70" : "text-muted-foreground"}`}>
                    {loc.coverings.length} covering{loc.coverings.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronRight className={`h-4 w-4 flex-shrink-0 ${activeLocId === loc.id ? "text-accent/70" : "text-muted-foreground/30 group-hover:text-muted-foreground"}`} />
              </button>
            ))}
            <button type="button" onClick={addLocation}
              className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground border border-dashed border-border/60 hover:border-accent/40 hover:bg-muted hover:text-accent transition-all mt-2">
              <Plus className="h-4 w-4" /> New Location
            </button>
          </div>
        </div>

        {/* Right: active location detail */}
        <AnimatePresence mode="wait">
          {activeLoc && (
            <motion.div
              key={activeLoc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0 space-y-4"
            >
              {/* Location header */}
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center text-accent font-bold text-xl ring-4 ring-accent/5">
                    {locations.findIndex(l => l.id === activeLoc.id) + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Window / Room Location</p>
                    <input
                      value={activeLoc.locationName}
                      onChange={e => updateLocName(activeLoc.id, e.target.value)}
                      placeholder="e.g. Master Bedroom, Living Bifold"
                      className="w-full text-xl md:text-2xl font-bold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => duplicateLocation(activeLoc.id)} title="Duplicate location">
                      <Copy className="h-4 w-4" />
                    </Button>
                    {locations.length > 1 && (
                      <Button variant="outline" size="icon" onClick={() => deleteLocation(activeLoc.id)}
                        className="text-muted-foreground hover:text-red-500 hover:border-red-200" title="Delete location">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Coverings List */}
              <div className="space-y-4">
                {activeLoc.coverings.map((cov, index) => (
                  <CoveringForm
                    key={cov.id}
                    cov={cov}
                    locId={activeLoc.id}
                    update={(field, val) => updateCovering(activeLoc.id, cov.id, field, val)}
                    onDelete={() => deleteCovering(activeLoc.id, cov.id)}
                    showDelete={activeLoc.coverings.length > 1}
                  />
                ))}
              </div>

              {/* Add covering buttons */}
              <div className="flex gap-3 pt-4 border-t border-border mt-6">
                <Button onClick={() => addCovering(activeLoc.id)} className="gap-2 bg-muted/50 hover:bg-muted text-foreground border border-border shadow-sm">
                  <Plus className="h-4 w-4 text-accent" /> Add Another Component / Layer
                </Button>
                <Button variant="ghost" onClick={() => addNoCovering(activeLoc.id)} className="gap-2 text-muted-foreground hover:text-foreground">
                  Mark as "No Covering"
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save footer */}
      <div className="flex items-center justify-between pt-6 border-t border-border mt-10">
        <Button variant="ghost" onClick={() => setStep(1)} className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Check Details
        </Button>
        <Button onClick={handleSave} size="lg" className="px-10 gap-2 bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-700 shadow-xl shadow-accent/20 text-white transition-all transform hover:-translate-y-0.5">
          <Save className="h-5 w-5" />
          Save Full Measurement Sheet
        </Button>
      </div>
    </motion.div>
  );

  // ─── Page Shell ────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/measurements">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Measurement Form</h1>
            <p className="text-sm text-muted-foreground mt-1">Record site dimensions and specifications.</p>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {[
          { n: 1, label: "Client & Site Info", icon: User },
          { n: 2, label: "Window Measurements", icon: Ruler },
        ].map(({ n, label, icon: Icon }, i) => (
          <div key={n} className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setStep(n as 1 | 2)}
              className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${step === n
                  ? "bg-foreground text-background shadow-lg"
                  : step > n
                    ? "bg-green-500/15 text-green-600 dark:text-green-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === n ? "bg-background/20" : step > n ? "bg-green-500/20" : "bg-muted-foreground/15"
                }`}>
                {step > n ? <CheckCircle className="h-3 w-3" /> : n}
              </div>
              <Icon className="h-4 w-4" />
              {label}
            </button>
            {i < 1 && <div className="w-6 md:w-12 h-px bg-border flex-shrink-0 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <main>
        <AnimatePresence mode="wait">
          {step === 1 && <motion.div key="step1">{renderStep1()}</motion.div>}
          {step === 2 && <motion.div key="step2">{renderStep2()}</motion.div>}
        </AnimatePresence>
      </main>
    </div>
  );
}