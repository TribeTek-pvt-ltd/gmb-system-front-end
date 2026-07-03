import { JobsList } from "@/components/jobs/JobsList";
import { getJobs } from "@/lib/db/jobs";

export default async function JobsPage() {
  let jobs = [];
  try {
    jobs = await getJobs();
  } catch (error) {
    console.error("Failed to load jobs", error);
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Jobs Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Track jobs from measure to install.</p>
        </div>
      </div>

      <JobsList jobs={jobs} />
    </div>
  );
}
