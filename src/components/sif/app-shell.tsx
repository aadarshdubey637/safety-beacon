import { Bell, ChevronDown, ClipboardCheck, FileText, Gauge, GitBranch, HelpCircle, LayoutDashboard, LifeBuoy, Menu, Search, Settings, ShieldAlert, Upload, Users, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSifData } from "@/lib/sif-context";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Analyze Report", to: "/analyze", icon: Upload },
  { label: "Patterns", to: "/patterns", icon: GitBranch },
  { label: "Life-Saving Rules", to: "/rules", icon: LifeBuoy },
  { label: "Sites & Activities", to: "/sites", icon: Gauge },
  { label: "Alerts", to: "/alerts", icon: ShieldAlert },
  { label: "HSE Review", to: "/review", icon: ClipboardCheck },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { reports, loadDemo } = useSifData();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const reviewCount = reports.filter((report) => report.review_status === "REVIEW_REQUIRED").length;
  const alertCount = reports.filter((report) => report.ai.risk_level === "CRITICAL").length;
  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[248px] -translate-x-full flex-col border-r border-ink/10 bg-background/80 backdrop-blur-xl transition-transform lg:translate-x-0", mobileOpen && "translate-x-0")}>
        <div className="flex items-center gap-3 px-5 pb-4 pt-5">
          <div className="grid size-9 place-items-center rounded-xl bg-amber/15 ring-1 ring-amber/30"><span className="size-3 rounded-full bg-amber animate-soft-pulse" /></div>
          <div><div className="font-display text-[16px] font-semibold leading-none">OIL SIF Sentinel</div><div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink/45">Oil India · HSE</div></div>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X /></Button>
        </div>
        <div className="mx-5 mb-4 rounded-xl bg-navy/5 px-3 py-2 text-[10px] leading-relaxed text-navy/70 ring-1 ring-navy/10"><span className="font-semibold text-navy/90">Prototype AI Engine</span><br />Replace with production NLP / LLM model</div>
        <nav className="flex-1 space-y-0.5 px-3 text-sm">
          {navigation.map(({ label, to, icon: Icon }) => {
            const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            const count = label === "Alerts" ? alertCount : label === "HSE Review" ? reviewCount : label === "Reports" ? reports.length : undefined;
            return <Link key={to} to={to} onClick={() => setMobileOpen(false)} className={cn("flex items-center justify-between rounded-lg px-3 py-2.5 font-medium text-ink/55 transition-colors hover:bg-navy/5 hover:text-ink", active && "bg-amber/10 font-semibold text-ink ring-1 ring-amber/25")}><span className="flex items-center gap-3"><Icon className="size-4" />{label}</span>{count !== undefined && <span className={cn("text-[10px] tabular-nums", label === "Alerts" ? "font-semibold text-critical/80" : "text-ink/30")}>{count}</span>}</Link>;
          })}
        </nav>
        <div className="border-t border-ink/10 px-4 py-4"><div className="flex items-center gap-3"><div className="grid size-8 place-items-center rounded-full bg-sky/20 text-[11px] font-semibold text-sky ring-1 ring-sky/30">RK</div><div className="min-w-0"><div className="truncate text-[12px] font-semibold">R. Kadam</div><div className="text-[10px] text-ink/45">HSE Officer</div></div><ChevronDown className="ml-auto size-4 text-ink/35" /></div></div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-navy/20 lg:hidden" aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} />}
      <div className="min-w-0 lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex min-h-16 items-center gap-4 border-b border-ink/10 bg-paper/75 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu /></Button>
          <div className="min-w-0"><h1 className="font-display text-[17px] font-semibold leading-none">SIF Precursor Command Center</h1><p className="mt-1 truncate text-[11px] text-ink/45">AI-Powered Serious Injury &amp; Fatality Precursor Intelligence</p></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3"><div className="hidden h-9 w-64 items-center gap-2 rounded-lg bg-background/75 px-3 ring-1 ring-ink/10 md:flex"><Search className="size-4 text-ink/35" /><span className="text-xs text-ink/35">Search reports, sites, rules…</span></div><span className="flex h-8 items-center gap-1.5 rounded-full bg-amber/15 px-2.5 text-[10px] font-semibold text-amber ring-1 ring-amber/30"><span className="size-1.5 rounded-full bg-amber" />DEMO MODE</span><Button variant="outline" size="sm" className="hidden border-navy/20 bg-navy text-primary-foreground hover:bg-navy/90 sm:inline-flex" onClick={loadDemo}>Load Demo Dataset</Button><Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="size-4" /></Button><div className="grid size-8 place-items-center rounded-full bg-navy text-[11px] font-semibold text-primary-foreground">RK</div></div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

export function PageFrame({ eyebrow, title, description, children, actions }: { eyebrow?: string; title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return <div className="min-h-[calc(100vh-4rem)] px-4 py-5 sm:px-6 sm:py-6 lg:px-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div>{eyebrow && <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">{eyebrow}</div>}<h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>{description && <p className="mt-2 max-w-3xl text-sm text-ink/55">{description}</p>}</div>{actions}</div>{children}</div>;
}

export function SectionTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) { return <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">{title}</h3>{detail && <p className="mt-1 text-[11px] text-ink/45">{detail}</p>}</div>{action}</div>; }