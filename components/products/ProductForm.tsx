"use client";

import { useState, useEffect } from "react";
import { X, Save, Package, Info, Loader2, Plus, Trash2, ChevronDown, ChevronRight, Layers, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Category, ProductCatalog, PricingGroup, PricingItem } from "@/lib/db/types";
import { getProducts } from "@/lib/db/products";

interface ProductFormProps {
  onClose: () => void;
  onSave: (product: Omit<ProductCatalog, 'products_catalog_id' | 'created_at'>) => Promise<void>;
  categories: Category[];
  initialData?: ProductCatalog | null;
}

const generateId = () => `id_${Math.random().toString(36).slice(2, 9)}`;

// ─── Pricing Item Row ────────────────────────────────────────────────────────
function PricingItemRow({
  item,
  onChange,
  onDelete,
}: {
  item: PricingItem;
  onChange: (updated: PricingItem) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2 pl-4 border-l-2 border-accent/20">
      <input
        className="flex-1 h-9 bg-muted/30 border border-border rounded-lg px-3 text-sm outline-none focus:ring-1 focus:ring-accent transition"
        placeholder="Item name (e.g. Fabric 1, SubCat 1)"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
      />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          className="w-28 h-9 bg-muted/30 border border-border rounded-lg pl-6 pr-3 text-sm font-mono outline-none focus:ring-1 focus:ring-accent transition"
          placeholder="Price"
          value={item.price ?? ""}
          onChange={(e) => onChange({ ...item, price: e.target.value === "" ? null : parseFloat(e.target.value) })}
        />
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Pricing Group Card ──────────────────────────────────────────────────────
function PricingGroupCard({
  group,
  onChange,
  onDelete,
}: {
  group: PricingGroup;
  onChange: (updated: PricingGroup) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const addItem = () => {
    onChange({
      ...group,
      items: [...group.items, { id: generateId(), name: "", price: null }],
    });
  };

  const updateItem = (idx: number, updated: PricingItem) => {
    const items = [...group.items];
    items[idx] = updated;
    onChange({ ...group, items });
  };

  const deleteItem = (idx: number) => {
    onChange({ ...group, items: group.items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-muted/10">
      {/* Group Header */}
      <div className="flex items-center gap-2 p-3 bg-muted/20">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <input
          className="flex-1 h-9 bg-card border border-border rounded-lg px-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-accent transition"
          placeholder="Group name (e.g. Category 1, Group 2)"
          value={group.group_name}
          onChange={(e) => onChange({ ...group, group_name: e.target.value })}
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-32 h-9 bg-card border border-border rounded-lg pl-6 pr-3 text-sm font-mono outline-none focus:ring-1 focus:ring-accent transition"
            placeholder="Group price"
            value={group.price ?? ""}
            onChange={(e) => onChange({ ...group, price: e.target.value === "" ? null : parseFloat(e.target.value) })}
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Group Items */}
      {expanded && (
        <div className="p-3 space-y-2">
          {group.items.map((item, idx) => (
            <PricingItemRow
              key={item.id}
              item={item}
              onChange={(u) => updateItem(idx, u)}
              onDelete={() => deleteItem(idx)}
            />
          ))}
          <button
            type="button"
            onClick={addItem}
            className="ml-4 flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 font-semibold transition-colors py-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Form ───────────────────────────────────────────────────────────────
export function ProductForm({ onClose, onSave, categories, initialData }: ProductFormProps) {
  const parentCategories = categories.filter((c) => !c.parent);
  const subCategories = categories.filter((c) => !!c.parent);

  const [formData, setFormData] = useState({
    item_name: initialData?.item_name || "",
    category_id: initialData?.category_id || parentCategories[0]?.id || "",
    sub_category_id: initialData?.sub_category_id || "",
    unit: initialData?.unit || "m",
    description: initialData?.description || "",
    status: initialData?.status || "Active",
    is_component: initialData?.is_component ?? false,
    components: initialData?.components || [] as string[],
    pricing_groups: initialData?.pricing_groups || [] as PricingGroup[],
  });

  const [componentProducts, setComponentProducts] = useState<ProductCatalog[]>([]);
  const [loadingComps, setLoadingComps] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Load component-type products for the selector
  useEffect(() => {
    if (!formData.is_component) {
      setLoadingComps(true);
      getProducts()
        .then((all) => setComponentProducts(all.filter((p) => p.is_component && p.products_catalog_id !== initialData?.products_catalog_id)))
        .catch(console.error)
        .finally(() => setLoadingComps(false));
    }
  }, [formData.is_component]);

  const addGroup = () => {
    setFormData((f) => ({
      ...f,
      pricing_groups: [
        ...f.pricing_groups,
        { id: generateId(), group_name: "", price: null, items: [] },
      ],
    }));
  };

  const updateGroup = (idx: number, updated: PricingGroup) => {
    const groups = [...formData.pricing_groups];
    groups[idx] = updated;
    setFormData((f) => ({ ...f, pricing_groups: groups }));
  };

  const deleteGroup = (idx: number) => {
    setFormData((f) => ({
      ...f,
      pricing_groups: f.pricing_groups.filter((_, i) => i !== idx),
    }));
  };

  const toggleComponent = (productId: string) => {
    setFormData((f) => ({
      ...f,
      components: f.components.includes(productId)
        ? f.components.filter((id) => id !== productId)
        : [...f.components, productId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_name.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      await onSave({
        item_name: formData.item_name,
        category_id: formData.category_id,
        sub_category_id: formData.sub_category_id || null,
        pricing_groups: formData.pricing_groups,
        unit: formData.unit as 'm' | 'mm' | 'cm' | 'count',
        description: formData.description,
        status: formData.status as 'Active' | 'Inactive',
        is_component: formData.is_component,
        components: formData.components,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent/10 text-accent flex items-center justify-center rounded-xl">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">
                {initialData ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-muted-foreground">Configure product details, pricing groups, and components</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                {errorMsg}
              </div>
            )}

            {/* ── Row 1: Name + Status ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Name</label>
                <input
                  required
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-accent transition"
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  placeholder="e.g. Roller Blind — RB"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
                <select
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-accent transition appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* ── Row 2: Category + Sub Category + Unit ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                <select
                  required
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-accent transition appearance-none"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value, sub_category_id: "" })}
                >
                  <option value="" disabled>Select category…</option>
                  {parentCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sub Category</label>
                <select
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-accent transition appearance-none"
                  value={formData.sub_category_id}
                  onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })}
                >
                  <option value="">— None —</option>
                  {subCategories
                    .filter((sc) => !formData.category_id || sc.parent === formData.category_id)
                    .map((sc) => (
                      <option key={sc.id} value={sc.id}>{sc.name}</option>
                    ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Meas. Unit</label>
                <select
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-accent transition appearance-none"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="m">Meter (m)</option>
                  <option value="mm">Millimeter (mm)</option>
                  <option value="cm">Centimeter (cm)</option>
                  <option value="count">Item Count</option>
                </select>
              </div>
            </div>

            {/* ── Is Component Toggle ── */}
            <div className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/10">
              <div>
                <p className="text-sm font-bold">Is Component</p>
                <p className="text-xs text-muted-foreground mt-0.5">Enable if this product is used as a component inside other products (e.g. Bottom Rail)</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_component: !formData.is_component, components: [] })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${formData.is_component ? "bg-accent" : "bg-muted"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${formData.is_component ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>

            {/* ── Components Multi-Select (only when not a component itself) ── */}
            {!formData.is_component && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-accent" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Components
                  </label>
                  {formData.components.length > 0 && (
                    <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">
                      {formData.components.length} selected
                    </span>
                  )}
                </div>
                {loadingComps ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading components…
                  </div>
                ) : componentProducts.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl">
                    No component products found. Create a product with "Is Component" enabled first.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-muted/20 rounded-xl border border-border/50 max-h-36 overflow-y-auto">
                    {componentProducts.map((p) => {
                      const selected = formData.components.includes(p.products_catalog_id);
                      return (
                        <button
                          key={p.products_catalog_id}
                          type="button"
                          onClick={() => toggleComponent(p.products_catalog_id)}
                          className={`text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${selected
                            ? "bg-accent/10 border-accent text-accent"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-accent/50"
                          }`}
                        >
                          {p.item_name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Pricing Groups ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Pricing Groups
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addGroup}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-xl border border-accent/40 text-accent bg-accent/5 hover:bg-accent/15 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Group
                </button>
              </div>

              {formData.pricing_groups.length === 0 ? (
                <div className="p-4 bg-muted/20 rounded-xl border border-dashed border-border text-center">
                  <p className="text-xs text-muted-foreground">No pricing groups yet. Click "Add Group" to create one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.pricing_groups.map((group, idx) => (
                    <PricingGroupCard
                      key={group.id}
                      group={group}
                      onChange={(u) => updateGroup(idx, u)}
                      onDelete={() => deleteGroup(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Description ── */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
              <textarea
                className="w-full min-h-[80px] bg-muted/30 border border-border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-accent transition resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the product features and usage…"
              />
            </div>

            <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-start gap-3">
              <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Group-level prices apply to all items in the group unless an item has its own price. Both group and item prices are optional.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-border/50 bg-muted/20 flex gap-3 justify-end uppercase tracking-widest text-[10px] font-black">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl h-11 px-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? "Saving…" : initialData ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
