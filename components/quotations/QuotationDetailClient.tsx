"use client";

import { QuotationEditor } from "./QuotationEditor";
import type { Quotation } from "@/lib/quotations";
import { updateQuotation } from "@/lib/db/quotations";

interface QuotationDetailClientProps {
  quotation: Quotation;
}

/**
 * Client wrapper around QuotationEditor that wires the onSaveToDb callback
 * to the Supabase updateQuotation function.
 *
 * Split into its own file so the parent route can remain a server component.
 */
export function QuotationDetailClient({ quotation }: QuotationDetailClientProps) {
  const handleSaveToDb = async (q: Quotation) => {
    // Map UI model → DB model fields
    await updateQuotation(q.id, {
      status: q.status as "Draft" | "Sent" | "Accepted" | "Rejected",
      notes: q.notes,
      // total_amount / grand_total will be managed by items in a full implementation
    });
  };

  return <QuotationEditor initialQuotation={quotation} onSaveToDb={handleSaveToDb} />;
}
