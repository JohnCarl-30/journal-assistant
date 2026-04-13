import { NextResponse } from "next/server";

import { getDailyLogData } from "@/modules/daily-log/models/daily-log";

export async function GET(
  _request: Request,
  { params }: { params: { date: string } },
) {
  await new Promise((resolve) => setTimeout(resolve, 140));

  return NextResponse.json(getDailyLogData(params.date));
}
