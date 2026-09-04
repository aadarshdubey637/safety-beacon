import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/sif/pages";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard | OIL SIF Sentinel" }, { name: "description", content: "SIF precursor overview, risk distribution, site ranking, and HSE review queue." }, { property: "og:title", content: "Dashboard | OIL SIF Sentinel" }, { property: "og:description", content: "SIF precursor overview for Oil India HSE teams." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: DashboardPage,
});
