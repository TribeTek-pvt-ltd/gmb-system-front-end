import React from "react";

interface ManufacturingTableProps {
  jobs: any[];
  isPreview: boolean;
  updateJob: (index: number, field: string, value: string) => void;
}

export function ManufacturingTable({ jobs, isPreview, updateJob }: ManufacturingTableProps) {
  return (
    <div className={`overflow-x-auto border border-border rounded-xl ${isPreview ? 'shadow-inner bg-muted/5' : ''}`}>
      <table className="w-full text-left border-collapse min-w-[1400px]">
        <thead>
          <tr className="bg-muted/50 border-b border-border text-center text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            <th colSpan={5} className="py-3 border-r border-border px-2">Fabric Supplier Section</th>
            <th colSpan={7} className="py-3 border-r border-border px-2">Collection Section</th>
            <th colSpan={2} className="py-3 border-r border-border px-2 bg-accent/5 text-accent">Fabric Info</th>
            <th colSpan={4} className="py-3 px-2 bg-orange-500/5 text-orange-500">Dimensions (mm)</th>
          </tr>
          <tr className="bg-muted/30 border-b border-border text-[9px] font-bold text-center leading-tight text-foreground uppercase tracking-wider">
            {["Supplier", "Location", "Control", "Bracket", "Chain"].map(h => <th key={h} className="border-r border-border p-2.5">{h}</th>)}
            {["Customer", "Collection", "Bottom", "Rolling", "Mount", "Surface", "Pelmet"].map(h => <th key={h} className="border-r border-border p-2.5">{h}</th>)}
            <th className="border-r border-border p-2.5 bg-accent/5 w-16">Needed</th>
            <th className="border-r border-border p-2.5 bg-accent/5 min-w-[120px]">Notes</th>
            <th className="border-r border-border p-2.5 bg-orange-500/5 w-16 text-orange-500/80">W (Act)</th>
            <th className="border-r border-border p-2.5 bg-red-500/10 text-red-500 w-16">W (Cut)</th>
            <th className="border-r border-border p-2.5 bg-orange-500/5 w-16 text-orange-500/80">H (Act)</th>
            <th className="p-2.5 bg-red-500/10 text-red-500 w-16">H (Cut)</th>
          </tr>
        </thead>
        <tbody className="bg-card">
          {jobs.map((job, i) => (
            <tr key={i} className={`border-b border-border transition-colors ${isPreview ? '' : 'hover:bg-muted/20'}`}>
              {[
                "supplier", "location", "control", "bracket", "chain",
                "customer", "collectionName", "bottomStyle", "rollingWay", "mountPoint", "surface", "pelmetType"
              ].map(field => (
                <td key={field} className="border-r border-border">
                  {isPreview ? (
                    <div className="px-2.5 py-2.5 min-h-[2.5rem] flex items-center justify-center text-center">
                      {job[field] || ""}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={job[field] || ""} 
                      onChange={(e) => updateJob(i, field, e.target.value)}
                      className="w-full bg-transparent px-2.5 py-2.5 focus:outline-none focus:bg-background text-foreground text-center" 
                    />
                  )}
                </td>
              ))}
              <td className="border-r border-border bg-accent/5">
                {isPreview ? <div className="px-2.5 py-2.5 text-center font-medium">{job.neededFabric}</div> : <input type="text" value={job.neededFabric || ""} onChange={(e) => updateJob(i, "neededFabric", e.target.value)} className="w-full bg-transparent px-2.5 py-2.5 focus:outline-none focus:bg-background text-foreground text-center" />}
              </td>
              <td className="border-r border-border bg-accent/5">
                {isPreview ? <div className="px-2.5 py-2.5 text-xs italic opacity-70">{job.notes}</div> : <input type="text" value={job.notes || ""} onChange={(e) => updateJob(i, "notes", e.target.value)} className="w-full bg-transparent px-2.5 py-2.5 focus:outline-none focus:bg-background text-foreground" />}
              </td>
              <td className="border-r border-border bg-orange-500/5">
                {isPreview ? <div className="px-2.5 py-2.5 text-center font-mono">{job.wActual}</div> : <input type="text" value={job.wActual || ""} onChange={(e) => updateJob(i, "wActual", e.target.value)} className="w-full bg-transparent px-2.5 py-2.5 focus:outline-none focus:bg-background font-mono text-center text-foreground" />}
              </td>
              <td className="border-r border-border bg-red-500/5">
                {isPreview ? <div className="px-2.5 py-2.5 text-center font-bold text-red-500 font-mono">{job.wCut}</div> : <input type="text" value={job.wCut || ""} onChange={(e) => updateJob(i, "wCut", e.target.value)} className="w-full bg-transparent px-2.5 py-2.5 focus:outline-none focus:bg-background font-mono text-red-500 font-bold text-center" />}
              </td>
              <td className="border-r border-border bg-orange-500/5">
                {isPreview ? <div className="px-2.5 py-2.5 text-center font-mono">{job.hActual}</div> : <input type="text" value={job.hActual || ""} onChange={(e) => updateJob(i, "hActual", e.target.value)} className="w-full bg-transparent px-2.5 py-2.5 focus:outline-none focus:bg-background font-mono text-center text-foreground" />}
              </td>
              <td className="bg-red-500/5">
                {isPreview ? <div className="px-2.5 py-2.5 text-center font-bold text-red-500 font-mono">{job.hCut}</div> : <input type="text" value={job.hCut || ""} onChange={(e) => updateJob(i, "hCut", e.target.value)} className="w-full bg-transparent px-2.5 py-2.5 focus:outline-none focus:bg-background font-mono text-red-500 font-bold text-center" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
