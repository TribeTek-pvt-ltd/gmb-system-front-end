import React from "react";
import { ShieldCheck, MonitorPlay } from "lucide-react";

export function SecurityTab() {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
          <ShieldCheck className="w-5 h-5 text-accent" /> Security Overview
        </h3>
        <p className="text-sm text-muted-foreground mb-6">Manage how you and your team access the GMB System.</p>

        <div className="space-y-4">
           <div className="p-4 rounded-2xl border border-green-500/10 bg-green-500/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-900 dark:text-green-400">Two-factor Authentication (2FA)</p>
                <p className="text-xs text-green-800/70 dark:text-green-500/70">Enabled via email authentication</p>
              </div>
              <button className="ml-auto text-xs font-bold text-green-700 hover:underline">Revoke</button>
           </div>
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="text-sm font-bold text-foreground">Active Sessions</h4>
          <div className="space-y-3">
             {[
               { browser: "Chrome on Windows", location: "Sydney, AU", current: true },
               { browser: "Safari on iPhone", location: "Colombo, LK", current: false },
             ].map((session, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                 <div className="flex items-center gap-3">
                   <MonitorPlay className="w-4 h-4 text-muted-foreground" />
                   <div>
                     <p className="text-sm font-medium">{session.browser}</p>
                     <p className="text-xs text-muted-foreground">{session.location} {session.current && "• Active Now"}</p>
                   </div>
                 </div>
                 {!session.current && <button className="text-xs font-bold text-red-500 hover:underline">Log out</button>}
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

