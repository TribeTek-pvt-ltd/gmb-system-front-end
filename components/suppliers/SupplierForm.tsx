"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Store, Package, Plus, X, Mail, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProducts } from "@/lib/db/products";
import { ProductCatalog } from "@/lib/db/types";

export type SupplierFormData = {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive";
  order_placement_method: "Email" | "Manual";
  linked_product_ids: string[];
};

export function SupplierForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: SupplierFormData) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
    order_placement_method: "Email",
    linked_product_ids: [],
  });

  // Product picker state
  const [products, setProducts] = useState<ProductCatalog[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    if (showProductPicker && products.length === 0) {
      setProductsLoading(true);
      getProducts()
        .then(setProducts)
        .catch(console.error)
        .finally(() => setProductsLoading(false));
    }
  }, [showProductPicker]);

  const filteredProducts = products.filter((p) =>
    p.item_name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      linked_product_ids: prev.linked_product_ids.includes(id)
        ? prev.linked_product_ids.filter((x) => x !== id)
        : [...prev.linked_product_ids, id],
    }));
  };

  const linkedProductNames = products
    .filter((p) => formData.linked_product_ids.includes(p.products_catalog_id))
    .map((p) => p.item_name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      alert("Failed to save supplier");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Store className="h-5 w-5 text-accent" /> Add Supplier
        </h2>

        {/* Company Name */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase">Company Name</label>
          <input
            required
            className="w-full h-10 border rounded-lg px-3 mt-1 text-sm bg-muted/30"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Contact + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase">Contact Name</label>
            <input
              className="w-full h-10 border rounded-lg px-3 mt-1 text-sm bg-muted/30"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase">Phone</label>
            <input
              type="tel"
              className="w-full h-10 border rounded-lg px-3 mt-1 text-sm bg-muted/30"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
          <input
            type="email"
            className="w-full h-10 border rounded-lg px-3 mt-1 text-sm bg-muted/30"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase">Address</label>
          <input
            className="w-full h-10 border rounded-lg px-3 mt-1 text-sm bg-muted/30"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        {/* ── Order Placement Method ── */}
        <div className="border rounded-xl p-4 space-y-2 bg-muted/20">
          <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <ClipboardList className="h-3.5 w-3.5" /> Order Placement Method
          </label>
          <div className="flex gap-3 mt-1">
            {(["Email", "Manual"] as const).map((method) => (
              <label
                key={method}
                className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-lg border py-2.5 text-sm font-medium transition-all ${
                  formData.order_placement_method === method
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  name="order_placement_method"
                  value={method}
                  checked={formData.order_placement_method === method}
                  onChange={() => setFormData({ ...formData, order_placement_method: method })}
                  className="sr-only"
                />
                {method === "Email" ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <ClipboardList className="h-4 w-4" />
                )}
                {method}
              </label>
            ))}
          </div>
        </div>

        {/* ── Linked Products ── */}
        <div className="border rounded-xl p-4 space-y-3 bg-muted/20">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" /> Linked Products
              {formData.linked_product_ids.length > 0 && (
                <span className="ml-1 rounded-full bg-accent/20 text-accent px-1.5 py-0.5 text-[10px] font-bold">
                  {formData.linked_product_ids.length}
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={() => setShowProductPicker((v) => !v)}
              className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              {showProductPicker ? (
                <><X className="h-3.5 w-3.5" /> Close</>
              ) : (
                <><Plus className="h-3.5 w-3.5" /> Add Product</>
              )}
            </button>
          </div>

          {/* Selected product tags */}
          {linkedProductNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {linkedProductNames.map((name, i) => {
                const id = formData.linked_product_ids[i];
                return (
                  <span
                    key={id}
                    className="flex items-center gap-1 rounded-full bg-accent/10 text-accent text-xs px-2 py-0.5 font-medium"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => toggleProduct(id)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Product picker dropdown */}
          {showProductPicker && (
            <div className="border rounded-xl bg-card shadow-lg overflow-hidden">
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Search products…"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full h-8 px-3 text-xs rounded-lg bg-muted/30 border outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="max-h-44 overflow-y-auto divide-y divide-border">
                {productsLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">No products found.</p>
                ) : (
                  filteredProducts.map((product) => {
                    const checked = formData.linked_product_ids.includes(product.products_catalog_id);
                    return (
                      <label
                        key={product.products_catalog_id}
                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                          checked ? "bg-accent/5" : "hover:bg-muted/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProduct(product.products_catalog_id)}
                          className="accent-accent h-4 w-4 rounded"
                        />
                        <span className="flex-1 font-medium">{product.item_name}</span>
                        <span className="text-xs text-muted-foreground">{product.unit}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={saving} type="submit">
            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
