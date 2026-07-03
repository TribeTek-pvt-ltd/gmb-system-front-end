"use server";

import { revalidatePath } from "next/cache";

export async function revalidateEmployees() {
  revalidatePath("/employees");
  revalidatePath("/employees/[id]", "page");
}
