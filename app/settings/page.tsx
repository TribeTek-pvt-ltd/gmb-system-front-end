"use client";

import { useState } from "react";
import { 
  Building2, User, Palette, ShieldCheck, Save
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CompanyTab } from "@/components/settings/CompanyTab";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { PreferencesTab } from "@/components/settings/PreferencesTab";
import { SecurityTab } from "@/components/settings/SecurityTab";

type TabType = "company" | "profile" | "preferences" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("company");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const tabs = [
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "profile", label: "My Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your company information and personal preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? "bg-accent text-white shadow-md shadow-accent/20" 
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "company" && <CompanyTab />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "preferences" && <PreferencesTab />}
          {activeTab === "security" && <SecurityTab />}

          {/* Save Action */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-card p-5 border border-border rounded-2xl shadow-sm gap-4 transition-all hover:shadow-md">
            <div>
              <p className="text-sm font-semibold text-foreground">Unsaved Changes</p>
              <p className="text-xs text-muted-foreground">Make sure to save your work before leaving.</p>
            </div>
            <Button 
               className="w-full sm:w-auto h-11 px-8 relative overflow-hidden" 
               onClick={handleSave}
               disabled={isSaving}
            >
              <div className={`flex items-center gap-2 transition-transform duration-300 ${isSaving ? "-translate-y-12" : "translate-y-0"}`}>
                <Save className="w-4 h-4" /> Save Preferences
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isSaving ? "translate-y-0" : "translate-y-12"}`}>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
