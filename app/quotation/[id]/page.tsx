import { getQuotationById } from "@/lib/db/quotations";
import { QuotationDetailClient } from "@/components/quotations/QuotationDetailClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function QuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let dbQuotation;

  try {
    dbQuotation = await getQuotationById(id);
  } catch (err) {
    console.error("Failed to fetch quotation", err);
  }

  if (!dbQuotation) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Quotation not found</h1>
        <p className="text-muted-foreground mb-4">
          No quotation exists with ID <code className="font-mono text-accent">{id}</code>.
        </p>
        <Link href="/quotations" className="text-accent hover:underline">
          ← Back to Quotations
        </Link>
      </div>
    );
  }

  // Map DB model → Quotation UI model
  const quotationUiModel = {
    id: dbQuotation.id,
    quoteNumber: `Q-${dbQuotation.id.substring(0, 6).toUpperCase()}`,
    customerId: dbQuotation.customer_id,
    customerName: dbQuotation.customer?.name || "Unknown",
    customerAddress: dbQuotation.customer?.address || "",
    customerEmail: dbQuotation.customer?.email || "",
    customerPhone: dbQuotation.customer?.phone || "",
    date: new Date(dbQuotation.created_at).toLocaleDateString("en-AU", {
      month: "short", day: "numeric", year: "numeric",
    }),
    expiryDate: dbQuotation.valid_until
      ? new Date(dbQuotation.valid_until).toLocaleDateString("en-AU", {
          month: "short", day: "numeric", year: "numeric",
        })
      : "",
    items: (dbQuotation.items ?? []).map((item: any) => ({
      id: item.id,
      name: item.product?.item_name || "Custom Item",
      location: item.description?.split("-")[0] || "Window",
      description: item.description,
      qty: item.quantity,
      unitPrice: item.unit_price,
      total: item.total_price,
      measurements: {
        label: item.description?.split("-")[0] || "",
        width: 0,
        height: 0,
        unit: item.product?.unit || "mm",
      },
    })),
    subtotal: dbQuotation.total_amount,
    tax: dbQuotation.tax,
    installationFee: 150,
    total: dbQuotation.grand_total,
    status: dbQuotation.status,
    notes: dbQuotation.notes || "",
    terms: "Quotation valid for 30 days. 50% deposit required to commence manufacturing.",
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Secondary back link to customer profile */}
      <div className="mb-4 no-print">
        <Link
          href={`/customer-profile/${quotationUiModel.customerId}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Customer Profile
        </Link>
      </div>

      {/* Client component handles save/send via Supabase */}
      <QuotationDetailClient quotation={quotationUiModel as any} />
    </div>
  );
}
