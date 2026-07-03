"use client";

import React from "react";

import { useState, useEffect } from "react";
import {
  Search, Filter, Plus, Edit, Trash2, Package, Ruler, Scissors, Box,
  Loader2, Layers, Link2, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProducts, deleteProduct, createProduct, updateProduct } from "@/lib/db/products";
import { getCategories } from "@/lib/db/categories";
import { ProductCatalog, Category } from "@/lib/db/types";
import { ProductForm } from "./ProductForm";

const categoryIcons: Record<string, React.ReactNode> = {
  Curtains: <Scissors className="h-3.5 w-3.5" />,
  Blinds: <Ruler className="h-3.5 w-3.5" />,
  Hardware: <Box className="h-3.5 w-3.5" />,
  Fabrics: <Package className="h-3.5 w-3.5" />,
};

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400",
  Inactive: "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400",
};

/** Derive a compact price label from pricing groups */
function getPriceLabel(product: ProductCatalog): string {
  if (!product.pricing_groups || product.pricing_groups.length === 0) return "—";
  const allPrices: number[] = [];
  for (const g of product.pricing_groups) {
    if (g.price != null) allPrices.push(g.price);
    for (const item of g.items) {
      if (item.price != null) allPrices.push(item.price);
    }
  }
  if (allPrices.length === 0) return "Group Priced";
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} – $${max.toFixed(2)}`;
}

export function ProductList() {
  const [products, setProducts] = useState<ProductCatalog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductCatalog | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "—";

  const getSubCategoryName = (id?: string | null) =>
    id ? (categories.find((c) => c.id === id)?.name || "—") : "—";

  const getComponentNames = (ids: string[]) =>
    ids.map((id) => products.find((p) => p.products_catalog_id === id)?.item_name || id);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.products_catalog_id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleSaveProduct = async (
    productData: Omit<ProductCatalog, "products_catalog_id" | "created_at">
  ) => {
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.products_catalog_id, productData);
        setProducts((prev) =>
          prev.map((p) => (p.products_catalog_id === updated.products_catalog_id ? updated : p))
        );
      } else {
        const newProd = await createProduct(productData);
        setProducts((prev) => [newProd, ...prev]);
      }
    } catch (err: any) {
      alert("Failed to save product: " + err.message);
      throw err;
    }
  };

  const handleEdit = (product: ProductCatalog) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const catName = getCategoryName(p.category_id);
    const matchesSearch = p.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || catName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-1.5 p-1 bg-muted rounded-xl w-full sm:w-auto overflow-x-auto">
          {["All", "Curtains", "Blinds", "Hardware", "Fabrics"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent transition shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-border bg-card shadow-sm h-10 w-10 p-0 hidden sm:flex items-center justify-center"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="rounded-xl shadow-sm h-10 px-4">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="w-full py-20 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
          <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold">No products found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-8"></th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">M. Unit</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sub Category</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">IsComp</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Components</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredProducts.map((product) => {
                  const catName = getCategoryName(product.category_id);
                  const subCatName = getSubCategoryName(product.sub_category_id);
                  const compNames = getComponentNames(product.components || []);
                  const isExpanded = expandedRow === product.products_catalog_id;
                  const priceLabel = getPriceLabel(product);

                  return (
                    <React.Fragment key={product.products_catalog_id}>
                      <tr
                        key={product.products_catalog_id}
                        className="hover:bg-muted/20 transition-colors group"
                      >
                        {/* Expand toggle */}
                        <td className="px-4 py-3">
                          {(product.pricing_groups?.length > 0) && (
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : product.products_catalog_id)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-accent/5 text-accent flex items-center justify-center shrink-0">
                              {categoryIcons[catName] || <Box className="h-3.5 w-3.5" />}
                            </div>
                            <span className="font-semibold">{product.item_name}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest ring-1 ring-inset font-bold ${statusStyles[product.status] || statusStyles.Inactive}`}>
                            {product.status}
                          </span>
                        </td>

                        {/* Unit */}
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {product.unit}
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-xs text-muted-foreground">{catName}</td>

                        {/* Sub Category */}
                        <td className="px-4 py-3 text-xs text-muted-foreground">{subCatName}</td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono font-semibold">{priceLabel}</span>
                        </td>

                        {/* IsComp */}
                        <td className="px-4 py-3">
                          {product.is_component ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                              <Layers className="h-3 w-3" /> Component
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Composite</span>
                          )}
                        </td>

                        {/* Components */}
                        <td className="px-4 py-3">
                          {compNames.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                {compNames.length} linked
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(product)}
                              className="h-8 w-8 bg-accent/5 text-accent hover:bg-accent/10 rounded-lg"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(product.products_catalog_id)}
                              className="h-8 w-8 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded pricing groups */}
                      {isExpanded && (
                        <tr key={`${product.products_catalog_id}-expanded`}>
                          <td colSpan={10} className="px-4 py-0 bg-muted/10">
                            <div className="py-3 pl-12 space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Pricing Groups</p>
                              {product.pricing_groups.map((group) => (
                                <div key={group.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                                  <div className="flex items-center gap-3 px-4 py-2 bg-muted/20 border-b border-border/30">
                                    <span className="text-xs font-bold">{group.group_name || "Unnamed Group"}</span>
                                    {group.price != null && (
                                      <span className="text-xs font-mono text-accent ml-auto">${group.price.toFixed(2)}</span>
                                    )}
                                  </div>
                                  {group.items.length > 0 && (
                                    <div className="divide-y divide-border/30">
                                      {group.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between px-4 py-1.5">
                                          <span className="text-xs text-muted-foreground pl-3 border-l-2 border-accent/20">{item.name}</span>
                                          {item.price != null && (
                                            <span className="text-xs font-mono">${item.price.toFixed(2)}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {compNames.length > 0 && (
                                <div className="pt-1">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Components</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {compNames.map((name, i) => (
                                      <span key={i} className="text-[11px] px-2.5 py-1 bg-accent/5 text-accent rounded-lg border border-accent/10 font-semibold">
                                        {name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
          categories={categories}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}
