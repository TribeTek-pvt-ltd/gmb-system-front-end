import React from "react";
import { X, MonitorPlay, Mail, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function EmployeeModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}: EmployeeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h3 className="font-semibold text-lg text-foreground">Add New Employee</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <MonitorPlay className="w-4 h-4" /> Position / Job Title
            </label>
            <input
              required
              type="text"
              value={formData.position}
              onChange={e => setFormData({ ...formData, position: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="e.g. Senior Outbound Sales"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Email Address (Login ID)
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="jane@gmb.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Set Password
            </label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Access Role
            </label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Receptionist">Receptionist (Enquiries & Jobs)</option>
              <option value="Sales">Sales (+ Paperworks, Quotes)</option>
              <option value="Installer">Installer (+ Measurements, View Paperwork)</option>
              <option value="Accountant">Accountant (View Orders, Jobs)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
