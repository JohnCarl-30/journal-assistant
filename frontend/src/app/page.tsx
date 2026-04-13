import { redirect } from "next/navigation";

import { DASHBOARD_ROUTE } from "@/shared/lib/routes";

export default function RootPage() {
  redirect(DASHBOARD_ROUTE);
}
