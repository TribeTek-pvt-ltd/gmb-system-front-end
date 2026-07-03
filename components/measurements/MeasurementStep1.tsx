import React from "react";
import { User, Home, ClipboardList, Wrench, FileText, ChevronRight, BadgeCheck, Clock } from "lucide-react";
import { SectionCard } from "../ui/SectionCard";
import { InputField, NoteTextarea, selectCls, inputCls } from "../ui/FormElements";
import { Button } from "../ui/Button";
import { 
  houseTypeOptions, floorOptions, jobTypeOptions, jobHardnessOptions, 
  installersOptions, measuredOrderOptions 
} from "../../constants/measurements";
import { ClientInfo } from "../../types/measurements";

export function MeasurementStep1({
  data, update, onNext
}: {
  data: ClientInfo;
  update: (field: keyof ClientInfo, val: any) => void;
  onNext: () => void;
}) {
  const handleDepositToggle = () => {
    const nowPaid = !data.depositPaid;
    if (nowPaid) {
      // Auto-generate a Job ID when deposit is marked as paid
      const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const generatedId = `JOB-${datePart}-${rand}`;
      update("jobId", generatedId);
    } else {
      update("jobId", "");
    }
    update("depositPaid", nowPaid);
  };
  return (
    <div className="space-y-6">
      {/* CLIENT INFO */}
      <SectionCard icon={User} title="Client Information" color="accent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="md:col-span-2 lg:col-span-3 flex gap-4 items-center mb-2">
            <span className="font-medium text-sm text-foreground">Customer Type:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="customerType" 
                value="New" 
                checked={data.customerType !== "Old"} 
                onChange={() => update("customerType", "New")}
                className="w-4 h-4 text-primary focus:ring-primary border-border bg-background"
              />
              <span className="text-sm text-foreground">New Customer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="customerType" 
                value="Old" 
                checked={data.customerType === "Old"} 
                onChange={() => update("customerType", "Old")}
                className="w-4 h-4 text-primary focus:ring-primary border-border bg-background"
              />
              <span className="text-sm text-foreground">Old Customer</span>
            </label>
          </div>

          {data.customerType !== "Old" && (
            <>
              <InputField label="Client Name & Address" required>
                <input value={data.clientName} onChange={e => update("clientName", e.target.value)}
                  className={inputCls} placeholder="Full name" />
              </InputField>
              <InputField label="Street Address">
                <input value={data.clientAddress} onChange={e => update("clientAddress", e.target.value)}
                  className={inputCls} placeholder="123 Main St, Suburb VIC 3000" />
              </InputField>
              <InputField label="Contact Number" required>
                <input type="tel" value={data.contactNumber} onChange={e => update("contactNumber", e.target.value)}
                  className={inputCls} placeholder="+61 4xx xxx xxx" />
              </InputField>
            </>
          )}
          <InputField label="Customer / Account">
            <input value={data.customer} onChange={e => update("customer", e.target.value)}
              className={inputCls} placeholder="Account name or reference" />
          </InputField>
          <InputField label="Email Address">
            <input type="email" value={data.email} onChange={e => update("email", e.target.value)}
              className={inputCls} placeholder="client@email.com" />
          </InputField>
          {/* Job ID — auto-generated after deposit paid */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className={`rounded-xl border-2 p-4 transition-colors ${
              data.depositPaid
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-dashed border-border bg-muted/20"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Job ID
                  </p>
                  {data.depositPaid && data.jobId ? (
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="font-mono font-bold text-sm tracking-wider text-emerald-600 dark:text-emerald-400">
                        {data.jobId}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="text-sm italic">Generated after deposit is marked as paid</span>
                    </div>
                  )}
                </div>
                {/* Deposit Paid toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-semibold ${
                    data.depositPaid ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                  }`}>
                    {data.depositPaid ? "Deposit Paid" : "Mark Deposit Paid"}
                  </span>
                  <button
                    type="button"
                    onClick={handleDepositToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                      data.depositPaid ? "bg-emerald-500" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                        data.depositPaid ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <InputField label="Date" required>
            <input type="date" value={data.date} onChange={e => update("date", e.target.value)}
              className={inputCls} />
          </InputField>
          <InputField label="Appointment Date & Time">
            <input type="datetime-local" value={data.dateTime} onChange={e => update("dateTime", e.target.value)}
              className={inputCls} />
          </InputField>
        </div>
      </SectionCard>

      {/* SITE & PROPERTY */}
      <SectionCard icon={Home} title="Property & Site Details" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField label="House Type">
            <select value={data.houseType} onChange={e => update("houseType", e.target.value)} className={selectCls}>
              {houseTypeOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Parking Flexibility">
            <input value={data.parkingFlexibility} onChange={e => update("parkingFlexibility", e.target.value)}
              className={inputCls} placeholder="Street, driveway, tight access…" />
          </InputField>
          <InputField label="Pets">
            <input value={data.pets} onChange={e => update("pets", e.target.value)}
              className={inputCls} placeholder="Dogs, cats, none…" />
          </InputField>
          <InputField label="Floor States">
            <select value={data.floorStates} onChange={e => update("floorStates", e.target.value)} className={selectCls}>
              {floorOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Clearances Around Windows">
            <input value={data.clearances} onChange={e => update("clearances", e.target.value)}
              className={inputCls} placeholder="Note any obstructions" />
          </InputField>
          <InputField label="Damage or Holes">
            <input value={data.damageHoles} onChange={e => update("damageHoles", e.target.value)}
              className={inputCls} placeholder="Describe any damage" />
          </InputField>
          <div className="md:col-span-2 lg:col-span-3">
            <InputField label="Existing Covering">
              <input value={data.existingCovering} onChange={e => update("existingCovering", e.target.value)}
                className={inputCls} placeholder="Describe what is currently installed" />
            </InputField>
          </div>
        </div>
      </SectionCard>

      {/* CUSTOMER CONSULTATION */}
      <SectionCard icon={ClipboardList} title="Customer Consultation" color="purple">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField label="How Did They Find Us">
            <input value={data.findUs} onChange={e => update("findUs", e.target.value)}
              className={inputCls} placeholder="Google, referral, social media…" />
          </InputField>
          <InputField label="Customer Origin">
            <input value={data.customerOrigin} onChange={e => update("customerOrigin", e.target.value)}
              className={inputCls} placeholder="Nationality / background (optional)" />
          </InputField>
          <InputField label="Colour Theme">
            <input value={data.colourTheme} onChange={e => update("colourTheme", e.target.value)}
              className={inputCls} placeholder="e.g. White, Grey/White, Warm tones" />
          </InputField>
          <InputField label="Explain About Product">
            <input value={data.explainProduct} onChange={e => update("explainProduct", e.target.value)}
              className={inputCls} placeholder="Details explained to client" />
          </InputField>
          <InputField label="Client Understands Level">
            <input value={data.clientUnderstandsLevel} onChange={e => update("clientUnderstandsLevel", e.target.value)}
              className={inputCls} placeholder="e.g. Fully understands, Needs follow-up" />
          </InputField>
          <InputField label="Fabric Selection Notes">
            <input value={data.fabricSelection} onChange={e => update("fabricSelection", e.target.value)}
              className={inputCls} placeholder="Selected fabric groups / favourites" />
          </InputField>
          <InputField label="Components Selection">
            <input value={data.componentsSelection} onChange={e => update("componentsSelection", e.target.value)}
              className={inputCls} placeholder="Track types, motor preferences…" />
          </InputField>
          <div className="md:col-span-2">
            <InputField label="Changes Needed to Get Deposit">
              <input value={data.changesToGetDeposit} onChange={e => update("changesToGetDeposit", e.target.value)}
                className={inputCls} placeholder="What needs to happen before deposit is secured…" />
            </InputField>
          </div>
        </div>
      </SectionCard>

      {/* JOB DETAILS */}
      <SectionCard icon={Wrench} title="Job Details" color="orange">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <InputField label="Job Type">
            <select value={data.jobType} onChange={e => update("jobType", e.target.value)} className={selectCls}>
              {jobTypeOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Job Complexity">
            <select value={data.jobHardness} onChange={e => update("jobHardness", e.target.value)} className={selectCls}>
              {jobHardnessOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="No. of Installers">
            <select value={data.numberOfInstallers} onChange={e => update("numberOfInstallers", e.target.value)} className={selectCls}>
              {installersOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Installation Timeframe">
            <input value={data.installationTimeframe} onChange={e => update("installationTimeframe", e.target.value)}
              className={inputCls} placeholder="e.g. 2 weeks, ASAP" />
          </InputField>
          <InputField label="Measured Order">
            <select value={data.measuredOrder} onChange={e => update("measuredOrder", e.target.value)} className={selectCls}>
              {measuredOrderOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="No. of Check Measurements">
            <input value={data.checkMeasurements} onChange={e => update("checkMeasurements", e.target.value)}
              className={inputCls} placeholder="e.g. 3" />
          </InputField>
          <InputField label="Windows Stats">
            <input value={data.windowsStats} onChange={e => update("windowsStats", e.target.value)}
              className={inputCls} placeholder="Total count, types" />
          </InputField>
        </div>
      </SectionCard>

      {/* NOTES */}
      <SectionCard icon={FileText} title="General Notes" color="green">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField label="Measurements Note">
            <NoteTextarea value={data.measurementsNote} onChange={v => update("measurementsNote", v)} placeholder="General measurements notes…" />
          </InputField>
          <InputField label="Installation Note">
            <NoteTextarea value={data.installationNote} onChange={v => update("installationNote", v)} placeholder="Installation instructions…" />
          </InputField>
          <InputField label="Product Note">
            <NoteTextarea value={data.productNote} onChange={v => update("productNote", v)} placeholder="Product observations…" />
          </InputField>
          <InputField label="Photos">
            <NoteTextarea value={data.photos} onChange={v => update("photos", v)} placeholder="Photo references / locations…" />
          </InputField>
        </div>
      </SectionCard>

      {/* STEP NAVIGATION */}
      <div className="flex justify-end pt-2">
        <Button onClick={onNext} size="lg" className="px-8 gap-2">
          Continue to Window Measurements
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
