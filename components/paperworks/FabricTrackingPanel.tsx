import React from "react";

interface FabricTrackingPanelProps {
  fabricTracking: any;
  updateFabric: (field: string, value: string) => void;
  isPreview: boolean;
}

export function FabricTrackingPanel({ fabricTracking, updateFabric, isPreview }: FabricTrackingPanelProps) {
  return (
    <div className="bg-muted/20 border border-border p-6 rounded-2xl self-start">
      <h3 className="font-bold text-sm mb-6 pb-2 border-b border-border text-foreground tracking-tight">Fabric Tracking</h3>
      <div className="space-y-4">
        {[
          { label: "Needed Fabric", field: "neededFabric" },
          { label: "Any Stock", field: "anyStock" },
          { label: "Ordered Fabric", field: "orderedFabric" },
          { label: "Received Fabric", field: "receivedFabric" }
        ].map(({ label, field }) => (
          <div key={field} className="flex items-center justify-between gap-4">
            <span className="font-medium text-muted-foreground">{label}</span>
            {isPreview ? (
              <span className="text-right font-semibold">{fabricTracking[field] || "—"}</span>
            ) : (
              <input 
                type="text" 
                value={fabricTracking[field] || ""} 
                onChange={(e) => updateFabric(field, e.target.value)}
                className="w-24 border border-border rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground" 
              />
            )}
          </div>
        ))}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="font-bold text-foreground">Balance Fabric</span>
          {isPreview ? (
            <span className="text-right font-bold text-accent">{fabricTracking.balanceFabric || "—"}</span>
          ) : (
            <input 
              type="text" 
              value={fabricTracking.balanceFabric || ""} 
              onChange={(e) => updateFabric("balanceFabric", e.target.value)}
              className="w-24 border border-border font-bold rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-accent bg-background text-accent" 
            />
          )}
        </div>
      </div>
    </div>
  );
}
