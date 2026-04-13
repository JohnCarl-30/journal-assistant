import { redirect } from "next/navigation";

import { WEEKLY_ROUTE } from "@/shared/lib/routes";

export default function LegacyWeeklyPage() {
  redirect(WEEKLY_ROUTE);
}
