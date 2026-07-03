import React from "react";
import { Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Quotation, QuotationItem } from "@/lib/quotations";
import { QuotationHeader } from "./QuotationHeader";

interface QuotationPricePageProps {
  quote: Quotation;
  isEditing: boolean;
  setQuote: (q: Quotation) => void;
  updateItem: (id: string, updates: Partial<QuotationItem>) => void;
  removeItem: (id: string) => void;
  addItem: () => void;
  subtotal: number;
  tax: number;
  total: number;
}

export function QuotationPricePage({
  quote,
  isEditing,
  setQuote,
  updateItem,
  removeItem,
  addItem,
  subtotal,
  tax,
  total
}: QuotationPricePageProps) {
  return (
    <div className={`printable-a4 mx-auto bg-white text-black shadow-2xl transition-all duration-300 ${
      isEditing ? 'w-full' : 'w-[210mm] min-h-[297mm]'
    } p-12 lg:p-16 border border-border/50 rounded-sm overflow-hidden relative`}>
      
      <QuotationHeader title="QUOTATION" quoteNumber={quote.quoteNumber} date={quote.date} />

      {/* Client Info */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Client Details</h3>
          <div className="space-y-1">
            {isEditing ? (
              <input 
                className="w-full font-bold text-lg bg-gray-50 p-2 rounded-lg border border-transparent focus:border-primary outline-none transition-all"
                value={quote.customerName}
                onChange={e => setQuote({...quote, customerName: e.target.value})}
                placeholder="Customer Name"
              />
            ) : (
              <p className="font-bold text-lg text-gray-900">{quote.customerName}</p>
            )}
            <p className="text-sm text-gray-600">{quote.customerEmail}</p>
            <p className="text-sm text-gray-600">{quote.customerPhone}</p>
            <p className="text-sm text-gray-600 mt-2 max-w-[250px]">{quote.customerAddress}</p>
          </div>
        </div>
        <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 relative group">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Service Address</h3>
          <p className="text-sm text-gray-700 italic">Same as billing address unless specified otherwise.</p>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="mb-12">
        <div className="grid grid-cols-12 gap-4 border-b-2 border-gray-900 px-2 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <div className="col-span-1">QTY</div>
          <div className="col-span-6">DESCRIPTION & SPECIFICATIONS</div>
          <div className="col-span-2 text-right">UNIT PRICE</div>
          <div className="col-span-3 text-right">TOTAL</div>
        </div>

        <div className="divide-y divide-gray-100">
          {quote.items.map((item) => (
            <div key={item.id} className="group relative">
              <div className="grid grid-cols-12 gap-4 px-2 py-8 items-start hover:bg-gray-50/30 transition-colors rounded-sm">
                <div className="col-span-1 font-mono text-lg font-bold text-gray-900">
                  {isEditing ? (
                    <input 
                      type="number"
                      className="w-full bg-gray-50 rounded-lg p-2 text-center outline-none border border-transparent focus:border-primary"
                      value={item.qty}
                      onChange={e => updateItem(item.id, { qty: parseFloat(e.target.value) || 0 })}
                    />
                  ) : item.qty}
                </div>
                <div className="col-span-6">
                  {isEditing ? (
                    <div className="space-y-3">
                       <input 
                        className="w-full font-bold text-sm bg-gray-50 p-2 rounded-lg outline-none border border-transparent focus:border-primary"
                        value={item.name}
                        onChange={e => updateItem(item.id, { name: e.target.value })}
                        placeholder="Product Name"
                      />
                      <input 
                        className="w-full text-xs text-primary font-bold bg-blue-50/50 p-2 rounded-lg outline-none border border-transparent focus:border-primary uppercase tracking-tighter"
                        value={item.location}
                        onChange={e => updateItem(item.id, { location: e.target.value })}
                        placeholder="Location"
                      />
                       <textarea 
                        className="w-full text-xs text-gray-500 bg-gray-50 p-2 rounded-lg outline-none resize-none border border-transparent focus:border-primary"
                        rows={2}
                        value={item.description}
                        onChange={e => updateItem(item.id, { description: e.target.value })}
                        placeholder="Item description..."
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{item.name}</p>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 skew-x-[-10deg] border-l-2 border-primary pl-2">{item.location}</p>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-md">{item.description}</p>
                    </>
                  )}
                </div>
                <div className="col-span-2 text-right font-mono text-sm pt-2 text-gray-600">
                  {isEditing ? (
                    <input 
                      type="number"
                      className="w-full bg-gray-50 rounded-lg p-2 text-right outline-none border border-transparent focus:border-primary"
                      value={item.unitPrice}
                      onChange={e => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    />
                  ) : `$${item.unitPrice.toFixed(2)}`}
                </div>
                <div className="col-span-3 text-right font-mono text-xl font-black pt-1.5 text-gray-900">
                  ${(item.qty * item.unitPrice).toFixed(2)}
                </div>

                {isEditing && (
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 transition-all no-print"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isEditing && (
            <div className="py-6 no-print">
              <Button variant="ghost" className="w-full border-2 border-dashed border-gray-200 text-gray-400 hover:border-accent hover:text-accent hover:bg-accent/5 rounded-xl transition-all h-20" onClick={addItem}>
                <Plus className="mr-2 h-5 w-5" /> Add New Quote Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Footer */}
      <div className="grid grid-cols-12 gap-8 pt-12 border-t-2 border-primary/10 mb-12">
        <div className="col-span-7">
          <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-[11px] text-gray-500 italic leading-relaxed">
              This quotation is valid for 30 days. Please refer to the **Measurement & Specification Sheet** on the following page for technical details, fabric selections, and installation requirements.
            </p>
          </div>
        </div>
        <div className="col-span-5">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="font-mono text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>GST (10%)</span>
              <span className="font-mono text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Installation</span>
              <span className="font-mono text-gray-900">
                {isEditing ? (
                  <input 
                    type="number"
                    className="bg-gray-50 rounded-lg px-2 w-24 text-right outline-none border border-transparent focus:border-primary"
                    value={quote.installationFee}
                    onChange={e => setQuote({...quote, installationFee: parseFloat(e.target.value) || 0})}
                  />
                ) : `$${(quote.installationFee || 0).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t-4 border-gray-900 pt-6 mt-6">
              <span className="text-xl font-black uppercase tracking-tighter text-gray-900">GRAND TOTAL</span>
              <span className="text-4xl font-black text-primary font-mono tracking-tighter">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Area */}
      <div className="mt-24 grid grid-cols-2 gap-32">
        <div className="border-t-2 border-gray-200 pt-6 group">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Client Authorization</p>
          <div className="h-20 flex items-end">
             <p className="text-[10px] text-gray-300 italic mb-2">Sign here or provide digital confirmation</p>
          </div>
          <div className="h-0.5 bg-gray-100 w-full"></div>
        </div>
        <div className="border-t-2 border-gray-200 pt-6 text-right group">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Acceptance Date</p>
          <p className="text-2xl font-mono text-gray-100 mt-4 leading-none">____ / ____ / 2026</p>
        </div>
      </div>
    </div>
  );
}
