"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuotationEditor } from "@/components/quotations/QuotationEditor";
import type { Quotation } from "@/lib/quotations";

// ─── Mock measurement sheet data ────────────────────────────────────────────
// Mirrors the structure in /measurements and /quotations/new
const mockSheets: Record<string, {
  jobNo: string;
  customerName: string;
  address: string;
  phoneNo: string;
  date: string;
  locations: { locationName: string; coverings: { coveringType: string; qty: number; inWidth: number; inDrop: number; outWidth: number; outDrop: number; productNote: string }[] }[];
}> = {
  "1": {
    jobNo: "J-1001", customerName: "John & Sarah Doe",
    address: "42 Oakwood Drive, Glen Waverley VIC 3150", phoneNo: "+61 412 345 678",
    date: "2024-03-20",
    locations: [
      { locationName: "Master Bedroom", coverings: [{ coveringType: "Roller Blinds", qty: 2, inWidth: 1800, inDrop: 2100, outWidth: 1850, outDrop: 2150, productNote: "Blockout fabric" }] },
      { locationName: "Living Room",    coverings: [{ coveringType: "Curtain",       qty: 1, inWidth: 3200, inDrop: 2700, outWidth: 3300, outDrop: 2750, productNote: "S-Fold sheer" }] },
    ],
  },
  "2": {
    jobNo: "J-1002", customerName: "Jane Smith",
    address: "15 Harbour View Rd, Brighton VIC 3186", phoneNo: "+61 403 987 654",
    date: "2024-03-21",
    locations: [
      { locationName: "Bedroom 1", coverings: [{ coveringType: "Venetian", qty: 1, inWidth: 1200, inDrop: 1600, outWidth: 1250, outDrop: 1650, productNote: "" }] },
      { locationName: "Study",     coverings: [{ coveringType: "Roman Blind", qty: 2, inWidth: 900, inDrop: 1200, outWidth: 950, outDrop: 1250, productNote: "Double-sided" }] },
    ],
  },
  "3": {
    jobNo: "J-1003", customerName: "Michael Johnson",
    address: "8 Balmoral Court, Hawthorn VIC 3122", phoneNo: "+61 432 111 222",
    date: "2024-03-22",
    locations: [
      { locationName: "Lounge", coverings: [{ coveringType: "Plantation Shutter", qty: 3, inWidth: 2400, inDrop: 2200, outWidth: 2450, outDrop: 2250, productNote: "" }] },
    ],
  },
  "4": {
    jobNo: "J-1004", customerName: "Emily Chen",
    address: "23 Rosewood Ave, Balwyn VIC 3103", phoneNo: "+61 455 678 901",
    date: "2024-03-24",
    locations: [
      { locationName: "Kitchen", coverings: [{ coveringType: "Roller Blinds", qty: 1, inWidth: 1000, inDrop: 900, outWidth: 1050, outDrop: 950, productNote: "" }] },
    ],
  },
  "5": {
    jobNo: "J-1005", customerName: "Carlos & Ana Rivera",
    address: "101 Federation Blvd, Doncaster VIC 3108", phoneNo: "+61 499 234 567",
    date: "2024-03-25",
    locations: [
      { locationName: "Dining Room", coverings: [{ coveringType: "Curtain",  qty: 2, inWidth: 2800, inDrop: 2500, outWidth: 2900, outDrop: 2550, productNote: "" }] },
      { locationName: "Bedroom 2",   coverings: [{ coveringType: "Venetian", qty: 1, inWidth: 1100, inDrop: 1400, outWidth: 1150, outDrop: 1450, productNote: "" }] },
    ],
  },
};

// ─── Build a Quotation UI model from measurement sheet ───────────────────────
function buildQuotationFromSheet(sheetId: string): Quotation | null {
  const sheet = mockSheets[sheetId];
  if (!sheet) return null;

  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + 30);

  const quoteNumber = `Q-DRAFT-${sheetId}`;

  const items = sheet.locations.flatMap((loc) =>
    loc.coverings.map((cov, idx) => {
      const id = `${loc.locationName}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
      return {
        id,
        name: cov.coveringType,
        location: loc.locationName,
        description: [
          cov.productNote,
          `In-frame: ${cov.inWidth}×${cov.inDrop}mm`,
          `Out-frame: ${cov.outWidth}×${cov.outDrop}mm`,
        ].filter(Boolean).join(" · "),
        qty: cov.qty,
        unitPrice: 0, // to be filled by user
        total: 0,
        measurements: {
          label: loc.locationName,
          width: cov.outWidth,
          height: cov.outDrop,
          unit: "mm" as const,
        },
      };
    })
  );

  return {
    id: quoteNumber,
    quoteNumber,
    customerId: sheetId,
    customerName: sheet.customerName,
    customerAddress: sheet.address,
    customerEmail: "",
    customerPhone: sheet.phoneNo,
    date: today.toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" }),
    expiryDate: expiry.toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" }),
    items,
    subtotal: 0,
    tax: 0,
    installationFee: 0,
    total: 0,
    status: "Draft",
    notes: `Generated from measurement sheet ${sheet.jobNo}.`,
    terms: "Quotation valid for 30 days. 50% deposit required to commence manufacturing.",
  };
}

// ─── Inner page (uses hook) ───────────────────────────────────────────────────
function GenerateQuotationInner() {
  const params = useSearchParams();
  const measurementId = params.get("measurementId") ?? "";

  const quotation = buildQuotationFromSheet(measurementId);

  if (!quotation) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Sheet not found</h1>
        <p className="text-muted-foreground mb-6">
          The measurement sheet with ID <code className="font-mono text-accent">{measurementId}</code> could not be loaded.
        </p>
        <Link href="/quotations/new">
          <Button>← Pick another sheet</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Back nav */}
      <div className="mb-6 no-print">
        <Link
          href="/quotations/new"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to sheet picker
        </Link>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-600 dark:text-amber-400 no-print">
        ✏️ <strong>Draft quotation</strong> — all unit prices are set to $0. Fill them in and click{" "}
        <strong>Save as Draft</strong> to store, or <strong>Send to Client</strong> when ready.
      </div>

      <QuotationEditor initialQuotation={quotation} isNewQuotation />
    </div>
  );
}

// ─── Page export (wraps in Suspense for useSearchParams) ─────────────────────
export default function GenerateQuotationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-sm animate-pulse">Preparing quotation…</div>
      </div>
    }>
      <GenerateQuotationInner />
    </Suspense>
  );
}
