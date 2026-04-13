import { NextResponse } from "next/server";

import { getWeeklySummaryData } from "@/modules/weekly-summary/models/weekly-summary";

export async function GET(
  _request: Request,
  { params }: { params: { weekStart: string } },
) {
  await new Promise((resolve) => setTimeout(resolve, 140));

  return NextResponse.json(getWeeklySummaryData(params.weekStart));
}
