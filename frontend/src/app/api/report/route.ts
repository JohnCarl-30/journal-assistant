// Temporary mock route until final report generation is wired to the FastAPI backend.
import { NextResponse } from "next/server";

import { getFinalReportData } from "@/modules/final-report/models/final-report";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 160));

  return NextResponse.json(getFinalReportData());
}
