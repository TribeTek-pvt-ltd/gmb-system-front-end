"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Quotation, QuotationItem } from "@/lib/quotations";
import { QuotationToolbar } from "./QuotationToolbar";
import { QuotationPricePage } from "./QuotationPricePage";
import { QuotationTechnicalPage } from "./QuotationTechnicalPage";

type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Rejected";

interface QuotationEditorProps {
  initialQuotation: Quotation;
  /** Pass true when creating a brand-new quotation (hides back-to-customer link) */
  isNewQuotation?: boolean;
  /** Called after a successful save/send from the parent server component */
  onSaveToDb?: (q: Quotation) => Promise<void>;
}

export function QuotationEditor({
  initialQuotation,
  isNewQuotation = false,
  onSaveToDb,
}: QuotationEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(isNewQuotation); // new quotes start in edit mode
  const [quote, setQuote] = useState<Quotation>(initialQuotation);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // ── Item helpers ──────────────────────────────────────────────────────────
  const updateItem = (itemId: string, updates: Partial<QuotationItem>) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Item",
      location: "Room / Window",
      description: "Description of the product…",
      qty: 1,
      unitPrice: 0,
      total: 0,
    };
    setQuote((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (itemId: string) => {
    setQuote((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== itemId) }));
  };

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = quote.items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax + (quote.installationFee || 0);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showMsg = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 3000);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = { ...quote, subtotal, tax, total };
      if (onSaveToDb) {
        await onSaveToDb(updated);
      }
      setQuote(updated);
      showMsg("✅ Saved as draft");
      setIsEditing(false);
    } catch {
      showMsg("❌ Save failed — please try again");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    setIsSaving(true);
    try {
      const updated: Quotation = { ...quote, subtotal, tax, total, status: "Sent" };
      if (onSaveToDb) {
        await onSaveToDb(updated);
      }
      setQuote(updated);
      showMsg("📤 Quotation marked as Sent");
      setIsEditing(false);
    } catch {
      showMsg("❌ Send failed — please try again");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Status change ─────────────────────────────────────────────────────────
  const handleStatusChange = async (newStatus: QuotationStatus) => {
    const updated: Quotation = { ...quote, status: newStatus };
    setQuote(updated);
    if (onSaveToDb) {
      try {
        await onSaveToDb(updated);
        showMsg(`✅ Status updated to ${newStatus}`);
      } catch {
        showMsg("❌ Status update failed");
      }
    } else {
      showMsg(`✅ Status updated to ${newStatus}`);
    }
  };

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col gap-6 w-full">
      <QuotationToolbar
        quoteNumber={quote.quoteNumber}
        customerName={quote.customerName}
        date={quote.date}
        status={quote.status as QuotationStatus}
        isEditing={isEditing}
        isSaving={isSaving}
        onToggleEdit={() => setIsEditing((v) => !v)}
        onPrint={handlePrint}
        onSave={handleSave}
        onSend={handleSend}
        onStatusChange={handleStatusChange}
        backHref="/quotations"
      />

      {/* Toast */}
      {savedMsg && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-card border border-border shadow-xl text-sm font-medium text-foreground transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          {savedMsg}
        </div>
      )}

      <div className="flex flex-col gap-12 py-8 bg-background/50 rounded-3xl overflow-hidden transition-colors duration-300">
        <div className="flex flex-col gap-12 max-w-7xl mx-auto px-4 lg:px-0">
          <QuotationPricePage
            quote={quote}
            isEditing={isEditing}
            setQuote={setQuote}
            updateItem={updateItem}
            removeItem={removeItem}
            addItem={addItem}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />

          <QuotationTechnicalPage
            quote={quote}
            isEditing={isEditing}
            setQuote={setQuote}
            updateItem={updateItem}
          />
        </div>
      </div>
    </div>
  );
}
