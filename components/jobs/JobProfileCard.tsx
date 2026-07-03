"use client";

import { Tag, MapPin, Calendar, FileText, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface JobProfileCardProps {
  job: {
    id: string;
    customer_id: string;
    status: string;
    created_at: string;
    total_amount: number;
    paid_amount: number;
    customer: {
      name: string;
      email: string | null;
      phone: string | null;
      address: string | null;
    } | null;
    payment_history?: any[];
    invoices?: any[];
  };
  onGeneratePaperwork: (jobId: string) => void;
}

const stageColors: Record<string, string> = {
  "Lead": "bg-gray-50 text-gray-700 ring-gray-600/10",
  "Enquired": "bg-gray-50 text-gray-700 ring-gray-600/10",
  "Quote Sent": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  "Job Created": "bg-blue-50 text-blue-700 ring-blue-700/10",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Completed": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Installed": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export function JobProfileCard({ job, onGeneratePaperwork }: JobProfileCardProps) {
  const router = useRouter();
  const customer = job.customer;
  const initials = customer?.name ? customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "??";
  
  const paymentProgress = job.total_amount > 0 ? (job.paid_amount / job.total_amount) * 100 : 0;

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-base font-bold text-accent">
            {initials}
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
              {customer?.name || "Unknown Customer"}
            </h3>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              Job ID: {job.customer_id.substring(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${stageColors[job.status] || stageColors["Job Created"]}`}>
          {job.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 mb-5">
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent/60" />
          <span className="truncate">{customer?.address || "No Address Provided"}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-accent/60" />
          <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
        </div>
        
        {/* Payment Summary */}
        <div className="mt-2 pt-3 border-t border-border/50">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider">Payment Status</span>
            <span className="font-bold text-foreground">
              ${job.paid_amount.toFixed(2)} / ${job.total_amount.toFixed(2)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
              style={{ width: `${Math.min(paymentProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-8 text-[11px] font-bold uppercase tracking-wider"
          onClick={() => router.push(`/customer-profile/${job.customer_id}?from=job`)}
        >
          View Profile
        </Button>
        <Button 
          size="sm" 
          className="flex-1 h-8 text-[11px] font-bold uppercase tracking-wider"
          onClick={() => onGeneratePaperwork(job.id)}
        >
          <FileText className="mr-1.5 h-3 w-3" />
          Paperwork
        </Button>
      </div>
    </div>
  );
}
