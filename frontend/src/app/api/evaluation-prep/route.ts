// Temporary mock route until evaluation-prep generation is wired to the FastAPI backend.
import { NextResponse } from "next/server";

import { getEvaluationPrepData } from "@/modules/evaluation-prep/models/evaluation-prep";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 120));

  return NextResponse.json(getEvaluationPrepData());
}
