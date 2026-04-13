// Temporary mock route until weekly generation is wired to the FastAPI backend.
import { NextResponse } from "next/server";

import { getWeeklySummaryData } from "@/modules/weekly-summary/models/weekly-summary";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 140));

  return NextResponse.json(getWeeklySummaryData("2026-03-30"));
}
