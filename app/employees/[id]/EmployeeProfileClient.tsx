"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, User, Phone, Mail, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Employee } from "@/lib/db/types";
import { updateEmployee } from "@/lib/db/employees";
import { PrivilegeToggles } from "@/components/employees/PrivilegeToggles";

const TABS = [
  { id: "personal", label: "Personal Details" },
  { id: "enquiries", label: "Enquiries" },
  { id: "jobs", label: "Jobs" },
  { id: "products", label: "Products" },
  { id: "stocks", label: "Stocks" },
  { id: "suppliers", label: "Suppliers" },
  { id: "orders", label: "Orders" },
];

const defaultPrivilege = { create: false, read: false, update: false, delete: false, all: false };

export default function EmployeeProfileClient({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for personal details
  const [personalData, setPersonalData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone || "",
    designation: employee.designation || "",
    role: employee.role,
  });

  // Initialize privileges from DB or defaults
  const [privileges, setPrivileges] = useState<Record<string, any>>(
    employee.privileges || {}
  );

  const handlePrivilegeChange = (newPrivilege: any) => {
    setPrivileges(prev => ({
      ...prev,
      [activeTab]: newPrivilege
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateEmployee(employee.id, { 
        privileges,
        name: personalData.name,
        email: personalData.email,
        phone: personalData.phone,
        designation: personalData.designation,
        role: personalData.role
      });
      
      // Import revalidateEmployees dynamically to avoid top-level import issues or just use standard import
      const { revalidateEmployees } = await import('@/app/actions/employeeActions');
      await revalidateEmployees();
      
      alert("Employee profile updated successfully.");
    } catch (err) {
      console.error("Failed to update employee", err);
      alert("Failed to update employee. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentPrivilege = privileges[activeTab] || defaultPrivilege;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" onClick={() => router.push('/employees')} className="p-2 h-auto">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-muted-foreground" />
            {personalData.name}'s Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Role: <span className="font-medium text-foreground">{personalData.role}</span> | Email: {personalData.email}
          </p>
        </div>
        <div className="ml-auto">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sidebar */}
        <div className="bg-card border border-border rounded-xl p-2 flex flex-row md:flex-col gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-accent text-white shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-card border border-border rounded-xl p-6">
          <div className="mb-6 pb-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "personal" 
                ? "Update personal information and contact details."
                : `Configure access rights for the ${activeTab} module.`
              }
            </p>
          </div>
          
          {activeTab === "personal" ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={personalData.name}
                    onChange={e => setPersonalData({ ...personalData, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={e => setPersonalData({ ...personalData, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={personalData.phone}
                    onChange={e => setPersonalData({ ...personalData, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="e.g. +61 412 345 678"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Designation / Title
                  </label>
                  <input
                    type="text"
                    value={personalData.designation}
                    onChange={e => setPersonalData({ ...personalData, designation: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="e.g. Senior Technician"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Access Role (Preset)</label>
                  <select
                    value={personalData.role}
                    onChange={e => setPersonalData({ ...personalData, role: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  >
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="Receptionist">Receptionist (Enquiries & Jobs)</option>
                    <option value="Sales">Sales (+ Paperworks, Quotes)</option>
                    <option value="Installer">Installer (+ Measurements, View Paperwork)</option>
                    <option value="Accountant">Accountant (View Orders, Jobs)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Changing this will not automatically override the specific privileges set in the other tabs. It only updates the label.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <PrivilegeToggles 
              privileges={currentPrivilege} 
              onChange={handlePrivilegeChange} 
              disabled={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
