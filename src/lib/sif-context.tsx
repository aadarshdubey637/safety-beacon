import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { createDemoReports, type ReviewStatus, type SafetyReport, analyzeSafetyReport } from "./sif-data";

type SifContextValue = {
  reports: SafetyReport[];
  filters: { site: string; activity: string; rule: string; risk: string; classification: string; search: string };
  setFilter: (key: keyof SifContextValue["filters"], value: string) => void;
  resetFilters: () => void;
  reviewReport: (id: string, status: ReviewStatus, reason?: string) => void;
  addReports: (rows: SafetyReport[]) => void;
  loadDemo: () => void;
};

const defaultFilters = { site: "All", activity: "All", rule: "All", risk: "All", classification: "All", search: "" };
const SifContext = createContext<SifContextValue | null>(null);

export function SifProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<SafetyReport[]>(() => createDemoReports());
  const [filters, setFilters] = useState(defaultFilters);
  const value = useMemo<SifContextValue>(() => ({
    reports,
    filters,
    setFilter: (key, value) => setFilters((current) => ({ ...current, [key]: value })),
    resetFilters: () => setFilters(defaultFilters),
    reviewReport: (id, status, reason) => setReports((current) => current.map((report) => report.id === id ? { ...report, review_status: status, reviewer: "R. Kadam", reviewed_at: new Date().toISOString(), review_reason: reason } : report)),
    addReports: (rows) => setReports((current) => [...rows, ...current]),
    loadDemo: () => { setReports(createDemoReports()); setFilters(defaultFilters); },
  }), [reports, filters]);
  return <SifContext.Provider value={value}>{children}</SifContext.Provider>;
}

export function useSifData() {
  const value = useContext(SifContext);
  if (!value) throw new Error("useSifData must be used inside SifProvider");
  return value;
}

export function parseCsvReports(csv: string): SafetyReport[] {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((header) => header.trim().toLowerCase());
  return lines.slice(1).map((line, index) => {
    const cells = line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""));
    const row = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] ?? ""]));
    const description = row.description || "Safety observation submitted for analysis.";
    return {
      id: row.report_id || `CSV-${String(index + 1).padStart(3, "0")}`,
      date: row.date || new Date().toISOString().slice(0, 10),
      site: row.site || "Unassigned site",
      asset: row.asset || "Unassigned asset",
      report_type: (row.report_type || "Near Miss") as SafetyReport["report_type"],
      activity: row.activity || "General",
      description,
      ai: analyzeSafetyReport(description, row.activity, row.site),
      review_status: "REVIEW_REQUIRED",
    };
  });
}