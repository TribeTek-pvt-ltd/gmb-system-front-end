import { getEmployees } from "@/lib/db/employees";
import EmployeesClient from "./EmployeesClient";

// Removed force-dynamic to enable Next.js caching and fast page loads

export default async function EmployeesPage() {
  const initialEmployees = await getEmployees();
  
  return <EmployeesClient initialEmployees={initialEmployees} />;
}
