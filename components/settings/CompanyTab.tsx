import React from "react";
import { Building2, Camera, Mail, Phone, MapPin } from "lucide-react";

export function CompanyTab() {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-accent" /> Company Identity
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-8 mb-8 items-start sm:items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border group-hover:border-accent transition-colors overflow-hidden">
              <Building2 className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-accent text-white shadow-lg shadow-accent/30 hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-medium text-foreground text-center sm:text-left">Company Logo</h4>
            <p className="text-xs text-muted-foreground text-center sm:text-left">Recommended format: PNG, JPG (max 2MB)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Business Name</label>
            <input 
              className="w-full h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
              defaultValue="GMB Curtain & Blind" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Registration Number (ABN)</label>
            <input 
              className="w-full h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
              defaultValue="45 125 456 789" 
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                className="w-full h-10 rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
                defaultValue="office@gmb.com" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                className="w-full h-10 rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
                defaultValue="+61 280 123 456" 
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Office Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                className="w-full h-10 rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
                defaultValue="Suite 24, Level 5, 201 Miller St, North Sydney" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
