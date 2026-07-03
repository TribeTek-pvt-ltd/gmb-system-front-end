"use client";

import React, { useState } from "react";
import { Printer, Edit3, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TrackerHeader } from "./TrackerHeader";
import { FabricTrackingPanel } from "./FabricTrackingPanel";
import { ManufacturingTable } from "./ManufacturingTable";

export interface TrackerData {
  header: {
    attention: string;
    clientName: string;
    clientNumber: string;
    status: string;
    projectManager: string;
    numberOfBlinds: number;
    supplyAndInstall: string;
    productionDate: string;
    startTime: string;
    finishedTime: string;
  };
  fabricTracking: {
    neededFabric: string;
    anyStock: string;
    orderedFabric: string;
    receivedFabric: string;
    balanceFabric: string;
  };
  jobs: any[];
  hardwareSummary: {
    singleBKTs: number;
    doubleBKTs: number;
    remotes: number;
    chargers: number;
  };
  productionNotes: string;
}

export function ProductionTracker({ initialData }: { initialData?: TrackerData }) {
  const [data, setData] = useState<TrackerData>(initialData || {
    header: {
      attention: "", clientName: "", clientNumber: "", status: "", projectManager: "Kiru",
      numberOfBlinds: 0, supplyAndInstall: "", productionDate: "", startTime: "", finishedTime: ""
    },
    fabricTracking: {
      neededFabric: "", anyStock: "", orderedFabric: "", receivedFabric: "", balanceFabric: ""
    },
    jobs: Array.from({ length: 15 }).map((_, i) => ({ id: i + 1 })),
    hardwareSummary: { singleBKTs: 0, doubleBKTs: 0, remotes: 0, chargers: 0 },
    productionNotes: ""
  });

  const [isPreview, setIsPreview] = useState(false);

  const updateHeader = (field: any, value: any) => {
    setData(prev => ({ ...prev, header: { ...prev.header, [field]: value } }));
  };

  const updateFabric = (field: any, value: string) => {
    setData(prev => ({ ...prev, fabricTracking: { ...prev.fabricTracking, [field]: value } }));
  };

  const updateJob = (index: number, field: string, value: string) => {
    const newJobs = [...data.jobs];
    newJobs[index] = { ...newJobs[index], [field]: value };
    setData(prev => ({ ...prev, jobs: newJobs }));
  };

  const updateHardware = (field: any, value: number) => {
    setData(prev => ({ ...prev, hardwareSummary: { ...prev.hardwareSummary, [field]: value } }));
  };

  const DisplayField = ({ label, value, onChange, type = "text", className = "" }: any) => {
    if (isPreview) {
      return (
        <div className={`flex flex-col gap-1 ${className}`}>
          <span className="font-bold uppercase tracking-widest text-[9px] text-muted-foreground">{label}</span>
          <span className="text-sm font-medium border-b border-transparent py-1.5 min-h-[2rem] flex items-center">
            {value || "—"}
          </span>
        </div>
      );
    }
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">{label}</label>
        {type === "select" ? (
          <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="border-b border-border py-1.5 outline-none text-sm focus:border-accent transition-colors bg-transparent cursor-pointer"
          >
            <option value="" className="bg-card"></option>
            <option value="Yes" className="bg-card">Yes</option>
            <option value="No" className="bg-card">No</option>
          </select>
        ) : (
          <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="border-b border-border py-1.5 outline-none text-sm focus:border-accent transition-colors bg-transparent placeholder:text-muted-foreground/30"
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-card text-foreground border border-border rounded-2xl shadow-sm overflow-hidden text-xs max-w-full transition-all print:border-none print:shadow-none">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30 print:hidden">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Production Tracking Sheet</h2>
          <p className="text-muted-foreground">Manufacturing order entry and tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)} className="text-accent hover:bg-accent/10">
            {isPreview ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isPreview ? "Switch to Edit" : "Preview Mode"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print Sheet
          </Button>
        </div>
      </div>

      <div className="p-6 md:p-8 print:p-0">
        <h1 className="text-2xl font-black tracking-tighter text-center border-b-2 border-border pb-4 mb-8 text-foreground uppercase">
          Holland Block Out
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          <TrackerHeader 
            data={data.header} 
            updateHeader={updateHeader} 
            isPreview={isPreview} 
            DisplayField={DisplayField} 
          />
          <FabricTrackingPanel 
            fabricTracking={data.fabricTracking} 
            updateFabric={updateFabric} 
            isPreview={isPreview} 
          />
        </div>

        <ManufacturingTable 
          jobs={data.jobs} 
          isPreview={isPreview} 
          updateJob={updateJob} 
        />

        {/* Bottom Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 pb-8">
          <div className="md:col-span-1 space-y-6">
            <h4 className="font-bold text-xs border-b border-border pb-2 text-foreground uppercase tracking-widest">Hardware Summary</h4>
            <div className="space-y-4">
              {[
                { label: "Number of Single BKTs", field: "singleBKTs" },
                { label: "Number of Double BKTs", field: "doubleBKTs" },
                { label: "Number of Remotes", field: "remotes" },
                { label: "Number of Chargers", field: "chargers" }
              ].map(({ label, field }) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">{label}</span>
                  {isPreview ? (
                    <span className="text-right font-semibold">{(data.hardwareSummary as any)[field] || 0}</span>
                  ) : (
                    <input 
                      type="number" 
                      value={(data.hardwareSummary as any)[field]} 
                      onChange={(e) => updateHardware(field as any, parseInt(e.target.value) || 0)}
                      className="w-20 border border-border rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground" 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-xs border-b border-border pb-2 text-foreground uppercase tracking-widest mb-2">Production Notes</h4>
            {isPreview ? (
              <div className="w-full min-h-[10rem] border border-border rounded-2xl p-5 bg-muted/10 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {data.productionNotes || "No specific production notes provided."}
              </div>
            ) : (
              <textarea 
                value={data.productionNotes}
                onChange={(e) => setData(prev => ({ ...prev, productionNotes: e.target.value }))}
                className="w-full h-40 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-accent bg-muted/10 resize-none text-sm text-foreground placeholder:text-muted-foreground/30 transition-all font-medium"
                placeholder="Add any specific instructions, discrepancies, or issues during production here..."
              ></textarea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
