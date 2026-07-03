import React, { useState } from "react";
import { Trash2, ChevronDown, Layers } from "lucide-react";
import { CoveringRow, CoveringType } from "../../types/measurements";
import { 
  coveringTypes, opacityOptions, sp1Options, sp2Options, sp3Options, 
  c4Options, surfaceOptions, m1Options, m3Options, m4Options, 
  com1ColorOptions, bracketOptions 
} from "../../constants/measurements";
import { InputField, NoteTextarea, TogglePill, inputCls, selectCls, dimInputCls } from "../ui/FormElements";

export function CoveringForm({
  cov, update, onDelete, showDelete,
}: {
  cov: CoveringRow;
  update: (field: keyof CoveringRow, val: any) => void;
  onDelete: () => void;
  showDelete: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  const typeColor =
    cov.coveringType === "Curtain" || cov.coveringType === "Sheer" ? "purple" :
    cov.coveringType === "Roller Blinds" ? "blue" :
    cov.coveringType === "Plantation Shutter" ? "green" :
    cov.coveringType === "No Covering" ? "muted" : "orange";

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${
      cov.coveringType === "No Covering" ? "border-border/40 bg-muted/10" : "border-border bg-card"
    }`}>
      {/* Covering Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/10 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          typeColor === "purple" ? "bg-purple-500/15 text-purple-500" :
          typeColor === "blue" ? "bg-blue-500/15 text-blue-500" :
          typeColor === "green" ? "bg-green-500/15 text-green-500" :
          typeColor === "orange" ? "bg-orange-500/15 text-orange-500" :
          "bg-muted/50 text-muted-foreground"
        }`}>
          <Layers className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{cov.coveringType}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {cov.opacity} · {cov.spec || "No description"} · {cov.m4}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showDelete && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {expanded && cov.coveringType !== "No Covering" && (
        <div className="px-5 pb-5 space-y-6 border-t border-border/50">

          {/* Row 1: Core info */}
          <div className="pt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <InputField label="Covering Type">
                <select value={cov.coveringType} onChange={e => update("coveringType", e.target.value)} className={selectCls}>
                  {coveringTypes.filter(t => t !== "No Covering").map(t => <option key={t}>{t}</option>)}
                </select>
              </InputField>
            </div>
            <InputField label="Opacity / Style">
              <select value={cov.opacity} onChange={e => update("opacity", e.target.value)} className={selectCls}>
                {opacityOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </InputField>
            <InputField label="Qty">
              <input type="number" min={1} value={cov.qty} onChange={e => update("qty", parseInt(e.target.value) || 1)}
                className={inputCls + " text-center font-mono"} />
            </InputField>
            <InputField label="Fabric / Spec">
              <input type="text" value={cov.spec} onChange={e => update("spec", e.target.value)}
                placeholder="e.g. Group 3 - Shaw Karma" className={inputCls} />
            </InputField>
          </div>

          {/* Row 2: Specification + Controls + Mount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Specification sub-panel */}
            <div className="rounded-xl border border-border/60 p-4 bg-muted/10 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Specification</p>
              <InputField label="SP1 — Style">
                <select value={cov.sp1} onChange={e => update("sp1", e.target.value)} className={selectCls}>
                  {sp1Options.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
              <InputField label="SP2 — Operation">
                <select value={cov.sp2} onChange={e => update("sp2", e.target.value)} className={selectCls}>
                  {sp2Options.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
              <InputField label="SP3 — Control Drive">
                <select value={cov.sp3} onChange={e => update("sp3", e.target.value)} className={selectCls}>
                  {sp3Options.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
            </div>

            {/* Control + Surface */}
            <div className="rounded-xl border border-border/60 p-4 bg-muted/10 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Control Details</p>
              <div className="grid grid-cols-3 gap-2">
                {(["c1","c2","c3"] as const).map(f => (
                  <InputField key={f} label={f.toUpperCase()}>
                    <input type="text" value={cov[f]} onChange={e => update(f, e.target.value)}
                      className={inputCls + " text-center"} placeholder="—" />
                  </InputField>
                ))}
              </div>
              <InputField label="C4 — Bottom Rail">
                <select value={cov.c4} onChange={e => update("c4", e.target.value)} className={selectCls}>
                  {c4Options.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
              <InputField label="Surface">
                <select value={cov.surface} onChange={e => update("surface", e.target.value)} className={selectCls}>
                  {surfaceOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
            </div>

            {/* Mounting Point */}
            <div className="rounded-xl border border-border/60 p-4 bg-muted/10 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Mounting Point</p>
              <InputField label="M1 — Width Range">
                <select value={cov.m1} onChange={e => update("m1", e.target.value)} className={selectCls}>
                  {m1Options.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
              <InputField label="M3 — Drop Range">
                <select value={cov.m3} onChange={e => update("m3", e.target.value)} className={selectCls}>
                  {m3Options.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
              <InputField label="M4 — Fixing Point">
                <select value={cov.m4} onChange={e => update("m4", e.target.value)} className={selectCls}>
                  {m4Options.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputField>
            </div>
          </div>

          {/* Row 3: Components + Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Components */}
            <div className="rounded-xl border border-border/60 p-4 bg-muted/10 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Components</p>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Com 1 — Colour">
                  <select value={cov.com1} onChange={e => update("com1", e.target.value)} className={selectCls}>
                    {com1ColorOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </InputField>
                <InputField label="Brackets">
                  <select value={cov.brackets} onChange={e => update("brackets", e.target.value)} className={selectCls}>
                    {bracketOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </InputField>
              </div>
            </div>

            {/* Dimensions */}
            <div className="rounded-xl border border-border/60 p-4 bg-muted/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-3">Dimensions (mm)</p>
              <div className="grid grid-cols-2 gap-3">
                {/* In Frame */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-center text-blue-500 uppercase">In Frame</p>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Width</label>
                    <input type="number" value={cov.inWidth || ""} onChange={e => update("inWidth", parseFloat(e.target.value) || 0)}
                      className={dimInputCls} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Drop</label>
                    <input type="number" value={cov.inDrop || ""} onChange={e => update("inDrop", parseFloat(e.target.value) || 0)}
                      className={dimInputCls} placeholder="0" />
                  </div>
                </div>
                {/* Out Frame */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-center text-orange-500 uppercase">Out Frame</p>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Width</label>
                    <input type="number" value={cov.outWidth || ""} onChange={e => update("outWidth", parseFloat(e.target.value) || 0)}
                      className={dimInputCls} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Drop</label>
                    <input type="number" value={cov.outDrop || ""} onChange={e => update("outDrop", parseFloat(e.target.value) || 0)}
                      className={dimInputCls} placeholder="0" />
                  </div>
                </div>
              </div>

              {/* Add L/R + End to End */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Add L</label>
                  <input type="number" value={cov.addL || ""} onChange={e => update("addL", parseFloat(e.target.value) || 0)}
                    className={dimInputCls} placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">Add R</label>
                  <input type="number" value={cov.addR || ""} onChange={e => update("addR", parseFloat(e.target.value) || 0)}
                    className={dimInputCls} placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">End–End</label>
                  <input type="number" value={cov.endToEnd || ""} onChange={e => update("endToEnd", parseFloat(e.target.value) || 0)}
                    className={dimInputCls} placeholder="0" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Position references */}
          <div className="rounded-xl border border-border/60 p-4 bg-muted/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-3">Position References</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["above","uc","ceil","floor"] as const).map(f => (
                <InputField key={f} label={f === "above" ? "Above" : f === "uc" ? "UC" : f === "ceil" ? "Ceiling Ref" : "Floor Ref"}>
                  <input type="text" value={cov[f]} onChange={e => update(f, e.target.value)}
                    className={inputCls} placeholder="—" />
                </InputField>
              ))}
            </div>
          </div>

          {/* Row 5: Notes + Flags */}
          <div className="rounded-xl border border-border/60 p-4 bg-muted/10 space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notes & Status</p>
              <div className="flex gap-2">
                <TogglePill label="Quotation Sent" checked={cov.quotationSent} onChange={v => update("quotationSent", v)} />
                <TogglePill label="Quotation Changed" checked={cov.quotationChanged} onChange={v => update("quotationChanged", v)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <InputField label="Quotation Note">
                <NoteTextarea value={cov.quotationNote} onChange={v => update("quotationNote", v)} placeholder="Note for quote…" />
              </InputField>
              <InputField label="Product Note">
                <NoteTextarea value={cov.productNote} onChange={v => update("productNote", v)} placeholder="Product note…" />
              </InputField>
              <InputField label="Production Note">
                <NoteTextarea value={cov.productionNote} onChange={v => update("productionNote", v)} placeholder="Production note…" />
              </InputField>
              <InputField label="Installation Note">
                <NoteTextarea value={cov.installNote} onChange={v => update("installNote", v)} placeholder="Install note…" />
              </InputField>
            </div>
          </div>
        </div>
      )}

      {/* No Covering - minimal display */}
      {expanded && cov.coveringType === "No Covering" && (
        <div className="px-5 pb-4 border-t border-border/30 pt-4">
          <div className="flex items-center gap-3">
            <select value={cov.coveringType} onChange={e => update("coveringType", e.target.value as CoveringType)} className={selectCls + " max-w-xs"}>
              {coveringTypes.map(t => <option key={t}>{t}</option>)}
            </select>
            <p className="text-sm text-muted-foreground italic">No covering required for this window/door</p>
          </div>
        </div>
      )}
    </div>
  );
}
