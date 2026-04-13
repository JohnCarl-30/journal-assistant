import { NextResponse } from "next/server";

import { getDashboardData } from "@/modules/dashboard/models/dashboard";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 120));

  return NextResponse.json(getDashboardData());
}
