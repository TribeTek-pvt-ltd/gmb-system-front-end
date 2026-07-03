import React from "react";

interface TrackerHeaderProps {
  data: any;
  updateHeader: (field: string, value: any) => void;
  isPreview: boolean;
  DisplayField: any;
}

export function TrackerHeader({ data, updateHeader, isPreview, DisplayField }: TrackerHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
        <DisplayField label="Attention" value={data.attention} onChange={(v: string) => updateHeader("attention", v)} />
        <DisplayField label="Client's Name" value={data.clientName} onChange={(v: string) => updateHeader("clientName", v)} />
        <DisplayField label="Client's Number" value={data.clientNumber} onChange={(v: string) => updateHeader("clientNumber", v)} />
        <DisplayField label="Status" value={data.status} onChange={(v: string) => updateHeader("status", v)} />
        <DisplayField label="Project Manager" value={data.projectManager} onChange={(v: string) => updateHeader("projectManager", v)} />
        <DisplayField label="Number of Blinds" type="number" value={data.numberOfBlinds} onChange={(v: string) => updateHeader("numberOfBlinds", parseInt(v) || 0)} />
        <DisplayField label="Supply & Install" type="select" value={data.supplyAndInstall} onChange={(v: string) => updateHeader("supplyAndInstall", v)} />
        <DisplayField label="Production Date" type="date" value={data.productionDate} onChange={(v: string) => updateHeader("productionDate", v)} />
        <div className="flex gap-6">
          <DisplayField label="Start Time" type="time" value={data.startTime} onChange={(v: string) => updateHeader("startTime", v)} className="flex-1" />
          <DisplayField label="Finished Time" type="time" value={data.finishedTime} onChange={(v: string) => updateHeader("finishedTime", v)} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
