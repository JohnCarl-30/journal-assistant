export const DASHBOARD_ROUTE = "/dashboard";
export const LOGIN_ROUTE = "/login";
export const TODAY_LOG_ROUTE = "/journal/2026-04-02";
export const WEEKLY_ROUTE = "/weeks/2026-03-30";
export const REPORT_ROUTE = "/report";
export const EVALUATION_ROUTE = "/evaluation-prep";

export function weekRoute(weekStart: string) {
  return `/weeks/${weekStart}`;
}

export function reportPrintRoute(documentId: string) {
  return `/report/print/${documentId}`;
}
