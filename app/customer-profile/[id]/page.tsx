import { FileText, Plus, File, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/db/customers";
import { getEnquiries } from "@/lib/db/enquiries";
import { getActivities } from "@/lib/db/activities";
import { ContactDetailsCard } from "@/components/customers/ContactDetailsCard";
import { ActivityCard } from "@/components/customers/ActivityCard";
import { ActiveJobCard } from "@/components/customers/ActiveJobCard";
import { GeneratedFilesList } from "@/components/customers/GeneratedFilesList";
import { UploadSection } from "@/components/customers/UploadSection";
import { CustomerActionButtons } from "@/components/customers/CustomerActionButtons";

export default async function CustomerProfilePage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ from?: string }> }) {
  const { id } = await params;
  const { from } = await searchParams;
  const fromJob = from === "job";
  
  let customer;
  let enquiries: any[] = [];
  let activities: any[] = [];
  
  try {
    customer = await getCustomerById(id);
    enquiries = await getEnquiries(id);
    activities = await getActivities(id);
  } catch (error) {
    console.error("Error fetching customer profile data:", error);
  }

  if (!customer) {
    notFound();
  }
  
  // Transform DB model to match existing UI properties
  const jobs = enquiries.filter(e => e.is_job).map(e => ({
    id: e.id,
    customerId: e.customer_id,
    status: e.status,
    date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: "Various", // Could map from connected products
    location: "Default"
  }));

  const customerUiModel = {
    ...customer,
    initials: customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    hasJob: jobs.length > 0,
    jobId: jobs.length > 0 ? jobs[0].id : undefined
  };

  const generatedFiles = [
    { id: "f1", name: "Measurement_Sheet_v1.pdf", type: "PDF", date: "Oct 14, 2026", size: "2.4 MB" },
    { id: "f2", name: "Quote_Q-0042.pdf", type: "PDF", date: "Oct 15, 2026", size: "1.1 MB" },
    { id: "f3", name: "Invoice_INV-0042.pdf", type: "PDF", date: "Oct 18, 2026", size: "0.8 MB" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto gap-8 flex flex-col">
      {/* Header and Back Link */}
      <div>
        <Link href="/customers" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Customers
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xl font-bold text-accent">
              {customerUiModel.initials}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{customerUiModel.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                  {customerUiModel.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  ID: {fromJob && customerUiModel.hasJob ? customerUiModel.jobId.substring(0, 8) : `CUST-${customerUiModel.customer_id.substring(0, 8)}`}
                </span>
              </div>
            </div>
          </div>

          <CustomerActionButtons 
            customerId={customerUiModel.customer_id} 
            hasJob={customerUiModel.hasJob} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <ActiveJobCard jobs={jobs} />
          <ContactDetailsCard customer={customerUiModel} />
          <ActivityCard customer={customerUiModel} activities={activities} />
        </div>

        {/* Right Column: Files & Jobs */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <GeneratedFilesList customer={customerUiModel} generatedFiles={generatedFiles} />
          <UploadSection />
        </div>
      </div>
    </div>
  );
}
