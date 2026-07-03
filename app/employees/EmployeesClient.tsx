"use client";

import { useState } from "react";
import { Plus, Search, Mail, ShieldAlert, MonitorPlay, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EntityCard } from "@/components/shared/EntityCard";
import { createEmployee, updateEmployee } from "@/lib/db/employees";
import { Employee } from "@/lib/db/types";
import { EmployeeModal } from "@/components/employees/EmployeeModal";

const roleColors: Record<string, string> = {
  Admin:        "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
  Manager:      "bg-violet-50 text-violet-700 ring-violet-700/10 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/30",
  Sales:        "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30",
  Installer:    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  Receptionist: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:ring-fuchsia-500/20",
  Accountant:   "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
};

const roleOptions = ["Admin", "Manager", "Sales", "Installer", "Receptionist", "Accountant"];

import { useRouter } from "next/navigation";
import { revalidateEmployees } from "@/app/actions/employeeActions";

export default function EmployeesClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees || []);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Sales", position: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRole = async (id: string, newRole: string) => {
    try {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, role: newRole } : e));
      await updateEmployee(id, { role: newRole });
      await revalidateEmployees();
    } catch (err) {
      console.error("Failed to update role", err);
      // Optionally rollback state or show error
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const newEmp = await createEmployee({
        name: formData.name,
        email: formData.email,
        password_hash: formData.password,
        role: formData.role,
        designation: formData.position || "Staff",
        phone: null,
        status: "Active",
        last_login: null
      });
      setEmployees([newEmp, ...employees]);
      await revalidateEmployees();
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "Sales", position: "" });
    } catch (err) {
      console.error("Failed to add employee", err);
      alert("Failed to create employee. Please ensure email is unique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleEmployees = employees.filter(e => {
    const matchesFilter = filter === "All" ? true : e.role === filter;
    const matchesSearch = e.name?.toLowerCase().includes(search.toLowerCase()) || 
                          e.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Team & Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system access, roles, and employee credentials.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6 md:items-center">
        <div className="flex flex-wrap gap-2">
          {["All", "Admin", "Receptionist", "Sales", "Installer", "Accountant"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:bg-muted hover:text-foreground ${filter === f ? 'bg-accent text-white border-accent' : 'bg-card text-muted-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="md:ml-auto relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search team…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full md:w-64 rounded-full border border-border bg-card pl-8 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {visibleEmployees.map((emp) => {
          const initials = emp.name ? emp.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2) : "EM";
          return (
            <EntityCard
              key={emp.id}
              initials={initials}
              title={emp.name || "Unknown"}
              subtitle={emp.designation || "Staff"}
              badge={{ 
                label: emp.role, 
                color: roleColors[emp.role] || "bg-gray-50 text-gray-700 ring-gray-600/20",
                options: roleOptions,
                onValueChange: (val) => updateRole(emp.id, val)
              }}
              meta={[
                { icon: Mail,         label: emp.email },
                { icon: ShieldAlert,  label: `Access: ${emp.role} Level` },
                { icon: MonitorPlay,  label: emp.last_login ? `Last Login: ${new Date(emp.last_login).toLocaleDateString()}` : "Last Login: Never" },
              ]}
              onClick={() => router.push(`/employees/${emp.id}`)}
            />
          )
        })}
        {visibleEmployees.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">No employees found.</div>
        )}
      </div>

      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddEmployee}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
