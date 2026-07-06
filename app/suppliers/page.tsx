"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EntityCard } from "@/components/shared/EntityCard";
import { getSuppliers, updateSupplier, createSupplier } from "@/lib/db/suppliers";
import { Supplier } from "@/lib/db/types";
import { SupplierForm, SupplierFormData } from "@/components/suppliers/SupplierForm";
import { createProductSupplier } from "@/lib/db/product_suppliers";

const statusColors: Record<string, string> = {
  Active:     "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  Inactive:   "bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20",
};

const statusOptions = ["Active", "Inactive"];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to load suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setSuppliers(prev => prev.map(s => s.supplier_id === id ? { ...s, status: newStatus as any } : s));
      await updateSupplier(id, { status: newStatus as any });
    } catch (err) {
      console.error("Failed to update status", err);
      fetchSuppliers();
    }
  };

  const handleSave = async (data: SupplierFormData) => {
    try {
      const { linked_product_ids, ...supplierData } = data;
      const created = await createSupplier(supplierData as Omit<Supplier, 'supplier_id' | 'created_at'>);
      // Link selected products
      if (linked_product_ids.length > 0) {
        await Promise.all(
          linked_product_ids.map((pid) =>
            createProductSupplier({ products_catalog_id: pid, supplier_id: created.supplier_id })
          )
        );
      }
      await fetchSuppliers();
    } catch (err: any) {
      alert("Failed to save supplier: " + err.message);
    }
  };

  const visibleSuppliers = suppliers.filter(s => {
    const matchesFilter = filter === "All" ? true : s.status === filter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your suppliers, manufacturers, and component vendors.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> Add Supplier</Button>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6 md:items-center">
        <div className="flex flex-wrap gap-2">
          {["All", "Active", "Inactive"].map((f) => (
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
            placeholder="Search suppliers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full md:w-64 rounded-full border border-border bg-card pl-8 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent transition"
          />
        </div>
      </div>

      {loading ? (
         <div className="w-full py-20 flex justify-center items-center">
           <Loader2 className="h-8 w-8 animate-spin text-accent" />
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleSuppliers.map((s) => {
            const initials = s.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
            return (
            <EntityCard
              key={s.supplier_id}
              initials={initials}
              title={s.name}
              subtitle={s.address || "No Address Provided"}
              badge={{ 
                label: s.status, 
                color: statusColors[s.status] || "bg-gray-50 text-gray-700 ring-gray-600/20",
                options: statusOptions,
                onValueChange: (val) => updateStatus(s.supplier_id, val)
              }}
              meta={[
                { icon: Phone, label: s.phone || "No Phone" },
                { icon: Mail,  label: s.email || "No Email" },
              ]}
              onClick={() => {}}
            />
          )})}
          {visibleSuppliers.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No suppliers found.
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <SupplierForm onClose={() => setIsFormOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}
