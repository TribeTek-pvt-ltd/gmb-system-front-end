import React from "react";
import { User, FileText, MapPin, Plus, Copy, Trash2, Camera } from "lucide-react";
import { Button } from "../ui/Button";
import { CoveringForm } from "./CoveringForm";
import { WindowLocation, CoveringRow } from "../../types/measurements";

export function MeasurementStep2({
  locations,
  activeLocId,
  clientName,
  jobId,
  clientAddress,
  setActiveLocId,
  addLocation,
  duplicateLocation,
  deleteLocation,
  updateLocName,
  addCovering,
  addNoCovering,
  deleteCovering,
  updateCovering,
  onSave
}: {
  locations: WindowLocation[];
  activeLocId: number;
  clientName: string;
  jobId: string;
  clientAddress: string;
  setActiveLocId: (id: number) => void;
  addLocation: () => void;
  duplicateLocation: (id: number) => void;
  deleteLocation: (id: number) => void;
  updateLocName: (id: number, name: string) => void;
  addCovering: (id: number) => void;
  addNoCovering: (id: number) => void;
  deleteCovering: (locId: number, covId: string) => void;
  updateCovering: (locId: number, covId: string, field: keyof CoveringRow, val: any) => void;
  onSave: () => void;
}) {
  const activeLoc = locations.find(l => l.id === activeLocId);

  return (
    <div className="space-y-6">
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

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar: Locations */}
        <aside className="w-full lg:w-72 space-y-4 shrink-0 lg:sticky lg:top-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Locations</h3>
            <Button variant="ghost" size="sm" onClick={addLocation} className="h-8 w-8 p-0 rounded-full hover:bg-accent/10 text-accent">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {locations.map(loc => (
              <div 
                key={loc.id}
                onClick={() => setActiveLocId(loc.id)}
                className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                  activeLocId === loc.id 
                    ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20" 
                    : "bg-card border-border text-foreground hover:border-accent/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">Loc #{loc.id}</span>
                  <div className={`flex gap-1 transition-opacity ${activeLocId === loc.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <button 
                      onClick={e => { e.stopPropagation(); duplicateLocation(loc.id); }}
                      className={`p-1 rounded-lg ${activeLocId === loc.id ? "hover:bg-white/20" : "hover:bg-muted"}`}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {locations.length > 1 && (
                      <button 
                        onClick={e => { e.stopPropagation(); deleteLocation(loc.id); }}
                        className={`p-1 rounded-lg ${activeLocId === loc.id ? "hover:bg-red-500/20" : "hover:bg-red-500/10 hover:text-red-500"}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="font-semibold truncate pr-8">{loc.locationName || `Location ${loc.id}`}</p>
                <div className="mt-2 flex items-center gap-1.5 opacity-60">
                   <LayersIcon className="h-3 w-3" />
                   <span className="text-[10px] font-medium">{loc.coverings.length} items</span>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onSave} className="w-full h-12 shadow-lg shadow-accent/20" size="lg">
            Save All Data
          </Button>
        </aside>

        {/* Main: Active Location Editor */}
        <main className="flex-1 w-full space-y-6">
          {activeLoc && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="space-y-1 flex-1">
                    <input 
                      className="bg-transparent border-none text-2xl font-bold p-0 focus:ring-0 w-full placeholder:text-muted-foreground/30"
                      value={activeLoc.locationName}
                      onChange={e => updateLocName(activeLoc.id, e.target.value)}
                      placeholder="Give this location a name…"
                    />
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                       <span className="uppercase font-bold tracking-widest text-accent/80">Active Editor</span>
                       <span>•</span>
                       <span>{activeLoc.coverings.length} Coverings configured</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => addNoCovering(activeLoc.id)} className="h-10 px-4 border-dashed">
                      <Trash2 className="h-4 w-4 mr-2" /> No Covering
                    </Button>
                    <Button size="sm" onClick={() => addCovering(activeLoc.id)} className="h-10 px-4">
                      <Plus className="h-4 w-4 mr-2" /> Add Covering
                    </Button>
                  </div>
               </div>

               <div className="space-y-6">
                 {activeLoc.coverings.map(cov => (
                   <CoveringForm
                     key={cov.id}
                     cov={cov}
                     update={(f, v) => updateCovering(activeLoc.id, cov.id, f, v)}
                     onDelete={() => deleteCovering(activeLoc.id, cov.id)}
                     showDelete={activeLoc.coverings.length > 1}
                   />
                 ))}
               </div>

               {/* Add More button at bottom */}
               <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => addCovering(activeLoc.id)}
                    className="group flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-border group-hover:border-accent group-hover:bg-accent/5 flex items-center justify-center transition-all">
                       <Plus className="h-5 w-5 text-muted-foreground group-hover:text-accent" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">Add another window</span>
                  </button>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function LayersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.27a1 1 0 0 0 0 1.83l8.57 4.09a2 2 0 0 0 1.66 0l8.57-4.09a1 1 0 0 0 0-1.83Z" />
      <path d="m2.6 11.41 8.57 4.09a2 2 0 0 0 1.66 0l8.57-4.09" />
      <path d="m2.6 15.63 8.57 4.09a2 2 0 0 0 1.66 0l8.57-4.09" />
    </svg>
  );
}
