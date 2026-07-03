"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, File, X, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { getQuotationsByCustomerId, updateQuotation } from "@/lib/db/quotations";
import { getEnquiries, updateEnquiry } from "@/lib/db/enquiries";
import { createJob, addPayment } from "@/lib/db/jobs";

type ModalMode = "quote" | "paperwork" | "payment" | null;

interface CustomerActionButtonsProps {
  customerId: string;
  hasJob: boolean;
}

export function CustomerActionButtons({ customerId, hasJob }: CustomerActionButtonsProps) {
  const router = useRouter();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [loading, setLoading] = useState(false);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [selectedQuote, setSelectedQuote] = useState("");
  const [fetchingQuotes, setFetchingQuotes] = useState(false);

  useEffect(() => {
    if (modalMode === "payment") {
      fetchData();
    }
  }, [modalMode]);

  const fetchData = async () => {
    setFetchingQuotes(true);
    try {
      const quotes = await getQuotationsByCustomerId(customerId);
      setQuotations(quotes || []);
    } catch (err) {
      console.error("Failed to fetch quotations", err);
    } finally {
      setFetchingQuotes(false);
    }
  };

  const handleMakePayment = async () => {
    if (!selectedQuote) {
      alert("Please select a quotation first.");
      return;
    }

    setLoading(true);
    try {
      const quote = quotations.find(q => q.id === selectedQuote);
      if (!quote) throw new Error("Quotation not found");

      // 1. Create the Job
      const newJob = await createJob({
        customer_id: customerId,
        enquiry_id: quote.enquiry_id,
        quotation_id: quote.id,
        measurement_id: null, // Could link from quote later
        status: 'Job Created',
        total_amount: quote.grand_total,
        paid_amount: 0 // Will be updated by addPayment
      });

      // 2. Add the Payment
      await addPayment({
        job_id: newJob.id,
        amount: quote.grand_total, // Assuming full payment for now
        payment_date: new Date().toISOString(),
        payment_method: 'Credit Card',
        reference_number: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        notes: `Initial payment for Quote #${quote.id.substring(0, 8).toUpperCase()}`
      });

      // 3. Mark quotation as Accepted
      await updateQuotation(selectedQuote, { status: 'Accepted' });

      // 4. Update the enquiry status
      if (quote.enquiry_id) {
        await updateEnquiry(quote.enquiry_id, { 
          is_job: true, 
          status: 'Job Created' 
        });
      }

      alert("Payment successful! Job created and payment recorded.");
      setModalMode(null);
      router.refresh(); 
    } catch (err: any) {
      alert("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center sm:justify-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/measurements/new")}>
          <File className="mr-2 h-4 w-4" />
          Create Measurement Sheet
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setModalMode("quote")}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Quote
        </Button>
        
        {!hasJob && (
          <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setModalMode("payment")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
        )}

        {hasJob && (
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setModalMode("paperwork")}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Paperwork
          </Button>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {modalMode === "quote" ? "Generate Quote" : 
                 modalMode === "paperwork" ? "Generate Paperwork" : 
                 "Select Quotation for Payment"}
              </h2>
              <button onClick={() => setModalMode(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(modalMode === "paperwork" || modalMode === "payment") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Quotation</label>
                  {fetchingQuotes ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading quotes...
                    </div>
                  ) : (
                    <select 
                      value={selectedQuote}
                      onChange={(e) => setSelectedQuote(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none"
                    >
                      <option value="">Select a quotation...</option>
                      {quotations.map((q, index) => (
                        <option key={q.id} value={q.id}>
                          Quotation {index + 1} - ${q.grand_total.toFixed(2)}
                        </option>
                      ))}
                      {quotations.length === 0 && modalMode === "payment" && (
                         <option value="dummy" disabled>No quotations found for this customer</option>
                      )}
                    </select>
                  )}
                </div>
              )}

              {modalMode !== "payment" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Measurement Sheet</label>
                  <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-accent outline-none">
                    <option value="">Select a measurement sheet...</option>
                    <option value="m1">Sheet v1 (Oct 14, 2026)</option>
                    <option value="m2">Sheet v2 (Oct 16, 2026)</option>
                  </select>
                </div>
              )}

              {modalMode === "payment" && quotations.length === 0 && !fetchingQuotes && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  This customer has no quotations. Please generate a quote first.
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalMode(null)}>Cancel</Button>
              <Button 
                disabled={loading || (modalMode === "payment" && (!selectedQuote || quotations.length === 0))} 
                onClick={modalMode === "payment" ? handleMakePayment : () => {
                  alert(`Successfully generated!`);
                  setModalMode(null);
                }}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {modalMode === "payment" ? "Confirm Payment" : "Generate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
