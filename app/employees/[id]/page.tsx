import { notFound } from "next/navigation";
import { getEmployeeById } from "@/lib/db/employees";
import EmployeeProfileClient from "./EmployeeProfileClient";

// Removed force-dynamic to enable Next.js caching and fast page loads

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee = await getEmployeeById(id);
    if (!employee) {
      return notFound();
    }
    return <EmployeeProfileClient employee={employee} />;
  } catch (error) {
    console.error("Error fetching employee:", error);
    return notFound();
  }
}
