import { StoredMarkerType } from "../types";

export function toggleReportSelection(
  current: StoredMarkerType[],
  report: StoredMarkerType
): StoredMarkerType[] {
  const exists = current.find((r) => r.id === report.id);
  if (exists) return current.filter((r) => r.id !== report.id);
  return current.length < 2 ? [...current, report] : [current[1], report];
}