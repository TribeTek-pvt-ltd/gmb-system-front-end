"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getInventory, createInventory } from "@/lib/db/inventory";
import { getProducts } from "@/lib/db/products";
import { InventoryForm } from "@/components/stocks/InventoryForm";

const badge: Record<string, string> = {
  "In Stock":    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400",
  "Low Stock":   "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400",
  "Out of Stock":"bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400",
};

export default function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [alertCollapsed, setAlertCollapsed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inv, prods] = await Promise.all([
        getInventory().catch(() => []),
        getProducts().catch(() => []),
      ]);
      setStocks(inv);
      setProducts(prods);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
      setStocks([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      await createInventory(data);
      await fetchData();
    } catch (err: any) {
      alert("Failed to save inventory: " + err.message);
    }
  };

  const filtered = stocks.filter(s =>
    s.product?.item_name?.toLowerCase().includes(search.toLowerCase()) || ""
  );

  // Items below reorder level (quantity < reorder_level)
  const lowStockItems = stocks.filter(
    (s) => s.quantity_on_hand < s.reorder_level
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory &amp; Stocks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your fabrics, hardware, and components.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
      </div>

      {/* ── Low Stock Alert Panel ── */}
      {!loading && lowStockItems.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-300/60 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/5 overflow-hidden shadow-sm">
          {/* Panel header */}
          <button
            type="button"
            onClick={() => setAlertCollapsed((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Low Stock Alerts
              </span>
              <span className="rounded-full bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 leading-none">
                {lowStockItems.length}
              </span>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium select-none">
              {alertCollapsed ? "Show ▾" : "Hide ▴"}
            </span>
          </button>

          {/* Item list */}
          {!alertCollapsed && (
            <ul className="divide-y divide-amber-200/60 dark:divide-amber-500/20">
              {lowStockItems.map((item) => {
                const isOut = item.quantity_on_hand === 0;
                const status = isOut ? "Out of Stock" : "Low Stock";
                const pct = item.reorder_level > 0
                  ? Math.min(100, Math.round((item.quantity_on_hand / item.reorder_level) * 100))
                  : 0;
                const barColor = isOut ? "bg-red-500" : "bg-amber-500";

                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-amber-100/40 dark:hover:bg-amber-500/10 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-white text-xs font-bold ${isOut ? "bg-red-500" : "bg-amber-500"}`}>
                      {isOut ? "0" : item.quantity_on_hand}
                    </div>

                    {/* Name + bar */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {item.product?.item_name || "Unknown Product"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-amber-200 dark:bg-amber-900/40 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColor} transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                          {item.quantity_on_hand} / {item.reorder_level} {item.product?.unit || "qty"}
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <span className="hidden sm:inline-block text-xs text-muted-foreground shrink-0">
                      {item.product?.category?.name || "N/A"}
                    </span>

                    {/* Status badge */}
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset shrink-0 ${badge[status]}`}>
                      {status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent transition"
          />
        </div>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Level</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reorder At</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => {
                let status = "In Stock";
                if (item.quantity_on_hand === 0) status = "Out of Stock";
                else if (item.quantity_on_hand < item.reorder_level) status = "Low Stock";

                return (
                  <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4 pl-6 pr-3">
                      <p className="text-sm font-medium text-foreground">{item.product?.item_name || "Unknown Product"}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{item.product_id?.substring(0, 8)}</p>
                    </td>
                    <td className="px-3 py-4 hidden sm:table-cell text-sm text-muted-foreground">{item.product?.category?.name || "N/A"}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground">{item.quantity_on_hand}</span>
                        <span className="text-xs text-muted-foreground">{item.product?.unit || "qty"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-muted-foreground">{item.reorder_level} {item.product?.unit || "qty"}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badge[status]}`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No stock items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <InventoryForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          products={products}
        />
      )}
    </div>
  );
}
