import React from "react";
import { Palette, DollarSign, Globe, Bell, Mail, Cloud } from "lucide-react";

export function PreferencesTab() {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent" /> System Localization
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Currency</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select className="w-full h-10 rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none appearance-none">
                  <option value="AUD">Australian Dollar (AUD)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="LKR">Sri Lankan Rupee (LKR)</option>
                </select>
              </div>
           </div>
           <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Timezone</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select className="w-full h-10 rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none appearance-none">
                  <option value="SYD">(GMT+10:00) Sydney</option>
                  <option value="MEL">(GMT+10:00) Melbourne</option>
                  <option value="COL">(GMT+05:30) Colombo</option>
                </select>
              </div>
           </div>
        </div>

        <div className="pt-6 border-t border-border">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" /> Notifications
          </h4>
          <div className="space-y-4">
             <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/30 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email Alerts</p>
                  <p className="text-xs text-muted-foreground">Receive daily job summaries via email</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 bg-accent focus:outline-none">
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </div>
             </label>
             <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/30 flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Auto-Sync Data</p>
                  <p className="text-xs text-muted-foreground">Sync orders with suppliers automatically</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 bg-muted focus:outline-none">
                  <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </div>
             </label>
          </div>
        </div>
      </div>
    </section>
  );
}
