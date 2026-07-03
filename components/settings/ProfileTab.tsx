import React from "react";
import { User, Lock } from "lucide-react";

export function ProfileTab() {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-accent" /> Personal Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
            <input 
              className="w-full h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
              defaultValue="Admin User" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Login Email</label>
            <input 
              className="w-full h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none disabled:opacity-50" 
              disabled
              defaultValue="admin@gmb.com" 
            />
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" /> Change Password
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="password"
              className="w-full h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
              placeholder="Current Password" 
            />
            <input 
              type="password"
              className="w-full h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none" 
              placeholder="New Password" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
