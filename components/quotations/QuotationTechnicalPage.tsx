import React from "react";
import { Ruler, Scissors, FileText } from "lucide-react";
import { Quotation, QuotationItem } from "@/lib/quotations";
import { QuotationHeader } from "./QuotationHeader";

interface QuotationTechnicalPageProps {
  quote: Quotation;
  isEditing: boolean;
  setQuote: (q: Quotation) => void;
  updateItem: (id: string, updates: Partial<QuotationItem>) => void;
}

export function QuotationTechnicalPage({
  quote,
  isEditing,
  setQuote,
  updateItem
}: QuotationTechnicalPageProps) {
  return (
    <div className={`printable-a4 page-break mx-auto bg-white text-black shadow-2xl transition-all duration-300 ${
      isEditing ? 'w-full' : 'w-[210mm] min-h-[297mm]'
    } p-12 lg:p-16 border border-border/50 rounded-sm overflow-hidden relative`}>
      
      <QuotationHeader title="SPECIFICATIONS" quoteNumber={quote.quoteNumber} date={quote.date} />

      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black bg-gray-900 text-white inline-block px-6 py-2 skew-x-[-10deg] shadow-lg shadow-gray-900/10">
            TECHNICAL SHEET
          </h2>
          <div className="text-[10px] font-black uppercase text-gray-300 tracking-tighter text-right leading-none no-print">
            <p>Page 02 / 02</p>
            <p className="mt-1">Technical Specs</p>
          </div>
        </div>
        
        <div className="divide-y-4 divide-gray-900/5 border-y-4 border-gray-900/5">
          {quote.items.map((item, idx) => (
            <div key={item.id} className="py-12 grid grid-cols-12 gap-12 items-start hover:bg-gray-50/20 transition-colors">
              <div className="col-span-1 text-5xl font-black text-gray-100 drop-shadow-sm select-none">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="col-span-5">
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">{item.location}</p>
                <p className="font-black text-xl leading-tight mb-2 text-gray-900 uppercase tracking-tighter">{item.name}</p>
                <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-gray-100 pl-4">{item.description}</p>
              </div>
              <div className="col-span-6 grid grid-cols-2 gap-6">
                {/* Measurement Box */}
                <div className="bg-white p-5 rounded-2xl border-2 border-gray-50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 p-1.5 rounded-lg w-fit">
                    <Ruler className="h-3 w-3" /> Measurements
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Width</span>
                      {isEditing ? (
                        <input 
                          className="w-full font-mono font-bold bg-gray-50 border border-transparent focus:border-primary p-2 rounded-lg outline-none"
                          value={item.measurements?.width}
                          onChange={e => updateItem(item.id, { measurements: { ...item.measurements!, width: parseFloat(e.target.value) || 0 }})}
                        />
                      ) : <span className="font-mono font-black text-lg block text-gray-900 border-b-2 border-primary/10 pb-1">{item.measurements?.width || "---"} <small className="text-[10px] font-medium text-gray-400">{item.measurements?.unit}</small></span>}
                    </div>
                    <div className="relative">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Height</span>
                      {isEditing ? (
                        <input 
                          className="w-full font-mono font-bold bg-gray-50 border border-transparent focus:border-primary p-2 rounded-lg outline-none"
                          value={item.measurements?.height}
                          onChange={e => updateItem(item.id, { measurements: { ...item.measurements!, height: parseFloat(e.target.value) || 0 }})}
                        />
                      ) : <span className="font-mono font-black text-lg block text-gray-900 border-b-2 border-primary/10 pb-1">{item.measurements?.height || "---"} <small className="text-[10px] font-medium text-gray-400">{item.measurements?.unit}</small></span>}
                    </div>
                  </div>
                </div>
                {/* Material Box */}
                <div className="bg-blue-50/50 p-5 rounded-2xl border-2 border-blue-100/30 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100/50 p-1.5 rounded-lg w-fit">
                    <Scissors className="h-3 w-3" /> Material
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input 
                        placeholder="Fabric Name"
                        className="w-full text-xs bg-white border border-gray-200 p-2 rounded-lg outline-none focus:border-blue-500 transition-all font-bold"
                        value={item.fabric?.name}
                        onChange={e => updateItem(item.id, { fabric: { ...item.fabric!, name: e.target.value }})}
                      />
                      <input 
                        placeholder="Color / Shade"
                        className="w-full text-xs bg-white border border-gray-200 p-2 rounded-lg outline-none focus:border-blue-500 transition-all"
                        value={item.fabric?.color}
                        onChange={e => updateItem(item.id, { fabric: { ...item.fabric!, color: e.target.value }})}
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tighter line-clamp-1">{item.fabric?.name || "TBD SPEC"}</p>
                      <p className="text-xs text-blue-600/70 font-bold mt-1">{item.fabric?.color || "Pending Selection"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="mt-12 pt-16 border-t-2 border-gray-100 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-8 no-print">
           <FileText className="h-8 w-8 text-gray-100" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px bg-gray-100 flex-1"></div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Terms & Conditions</h3>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>
        
        {isEditing ? (
          <textarea 
            className="w-full text-[11px] text-gray-500 bg-gray-50 p-6 rounded-3xl outline-none leading-relaxed border border-gray-100 transition-all focus:bg-white focus:ring-4 focus:ring-primary/5"
            rows={10}
            value={quote.terms}
            onChange={e => setQuote({...quote, terms: e.target.value})}
            placeholder="Terms and conditions content..."
          />
        ) : (
          <div className="columns-2 gap-16 text-[10px] text-gray-400 leading-relaxed text-justify opacity-80">
            {quote.terms?.split('\n').map((para, i) => (
              <p key={i} className="mb-6 first:font-bold first:text-gray-500">{para}</p>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer Footer */}
      <div className="mt-auto pt-16 flex items-center justify-between border-t-2 border-gray-50">
        <div className="text-[9px] text-gray-300 font-bold uppercase tracking-widest flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary/20"></div>
          GMB Paperwork • Precision Manufacturing
        </div>
        <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
          E&OE • All quoted dimensions are subject to final check measure
        </div>
      </div>
    </div>
  );
}
