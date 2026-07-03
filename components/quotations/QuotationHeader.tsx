import React from "react";

interface QuotationHeaderProps {
  title: string;
  quoteNumber: string;
  date: string;
}

export function QuotationHeader({ title, quoteNumber, date }: QuotationHeaderProps) {
  return (
    <div className="flex justify-between items-start border-b-2 border-primary/10 pb-8 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 bg-primary flex items-center justify-center rounded-lg text-primary-foreground font-bold text-xl">
            G
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary">GMB PAPERWORK</span>
        </div>
        <div className="text-sm text-gray-500 space-y-0.5">
          <p>123 Business Avenue, Suite 100</p>
          <p>Sydney, NSW 2000</p>
          <p>Phone: (02) 9876 5432</p>
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-4xl font-black text-primary/20 mb-4 uppercase tracking-widest">{title}</h1>
        <div className="space-y-1">
          <div className="flex justify-end gap-4 text-sm">
            <span className="font-bold text-gray-400 uppercase tracking-tighter">Quote #</span>
            <span className="font-mono text-gray-900">{quoteNumber}</span>
          </div>
          <div className="flex justify-end gap-4 text-sm">
            <span className="font-bold text-gray-400 uppercase tracking-tighter">Date</span>
            <span className="text-gray-900">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
