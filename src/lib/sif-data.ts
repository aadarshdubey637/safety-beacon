export type Classification = "SIF_POTENTIAL" | "NON_SIF";
export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ReviewStatus = "REVIEW_REQUIRED" | "CONFIRMED_SIF" | "MARKED_NON_SIF";

export type Analysis = {
  classification: Classification;
  sif_score: number;
  confidence: number;
  risk_level: RiskLevel;
  life_saving_rules: string[];
  activity: string;
  hazard: string;
  location: string;
  barrier_failure: string;
  potential_consequence: string;
  exposure: string;
  reasoning: string[];
  recommended_action: string;
  highlights: string[];
};

export type SafetyReport = {
  id: string;
  date: string;
  site: string;
  asset: string;
  report_type: "Unsafe Act" | "Unsafe Condition" | "Near Miss" | "Incident";
  activity: string;
  description: string;
  ai: Analysis;
  review_status: ReviewStatus;
  reviewer?: string;
  reviewed_at?: string;
  review_reason?: string;
};

export const sites = ["Duliajan", "Digboi", "Naharkatiya", "Moran", "Assam Asset", "Rajasthan Asset"];
export const activities = ["Maintenance", "Drilling", "Well Intervention", "Electrical Work", "Hot Work", "Lifting", "Transportation", "Confined Space Entry"];
export const lifeSavingRules = ["Energy Isolation", "Hot Work", "Confined Space", "Line of Fire", "Working at Height", "Driving", "Lifting Operations", "Electrical Safety"];

const rulePatterns: Array<{ rules: string[]; words: string[]; activity: string; hazard: string; barrier: string; consequence: string; action: string }> = [
  { rules: ["Energy Isolation", "Line of Fire"], words: ["energized", "isolation", "loto", "zero-energy", "electrical"], activity: "Maintenance", hazard: "Unexpected energy release", barrier: "Energy isolation / LOTO not verified", consequence: "Fatal contact with hazardous energy", action: "Stop work and verify LOTO / zero-energy state before maintenance." },
  { rules: ["Confined Space", "Energy Isolation"], words: ["confined", "vessel", "gas testing", "gas test", "atmosphere"], activity: "Confined Space Entry", hazard: "Toxic or oxygen-deficient atmosphere", barrier: "Gas testing and entry permit not confirmed", consequence: "Asphyxiation or toxic exposure", action: "Suspend entry, test the atmosphere, and verify the permit and rescue plan." },
  { rules: ["Line of Fire", "Lifting Operations"], words: ["suspended", "crane", "load", "underneath", "lifting"], activity: "Lifting", hazard: "Struck-by / dropped object", barrier: "Exclusion zone and line-of-fire controls failed", consequence: "Fatal struck-by or crush injury", action: "Establish the lifting exclusion zone and prohibit people under suspended loads." },
  { rules: ["Working at Height"], words: ["height", "scaffold", "edge", "fall", "harness"], activity: "Maintenance", hazard: "Fall from elevation", barrier: "Fall protection or edge protection missing", consequence: "Fatal fall from height", action: "Stop work and install compliant edge protection / fall arrest controls." },
  { rules: ["Hot Work", "Energy Isolation"], words: ["welding", "hot work", "grinding", "spark", "flammable"], activity: "Hot Work", hazard: "Ignition of flammable material", barrier: "Hot work permit and gas monitoring incomplete", consequence: "Fire, explosion, and fatal burns", action: "Suspend hot work until permit, gas test, and fire watch are verified." },
  { rules: ["Driving"], words: ["driving", "vehicle", "seat belt", "reversing", "road"], activity: "Transportation", hazard: "Vehicle collision", barrier: "Journey management or seat belt control failed", consequence: "Fatal vehicle collision", action: "Pause the journey and confirm driver, vehicle, and journey controls." },
  { rules: ["Electrical Safety"], words: ["cable", "panel", "electrical", "live", "temporary power"], activity: "Electrical Work", hazard: "Electric shock or arc flash", barrier: "Electrical isolation and guarding not assured", consequence: "Fatal shock or arc flash burns", action: "De-energize, isolate, and inspect the electrical installation before work." },
];

const genericSafe = [
  { activity: "Housekeeping", hazard: "Minor trip hazard", barrier: "Routine housekeeping opportunity", consequence: "Minor slip or trip", action: "Clear the area and close the housekeeping observation." },
  { activity: "PPE Check", hazard: "Inadequate hand protection", barrier: "PPE selection not optimal", consequence: "Minor hand irritation", action: "Provide task-appropriate gloves and reinforce the PPE standard." },
];

function scoreFor(text: string, pattern: typeof rulePatterns[number] | undefined) {
  const lower = text.toLowerCase();
  if (!pattern) return 18 + (lower.includes("injury") ? 8 : 0);
  const matched = pattern.words.filter((word) => lower.includes(word)).length;
  const directExposure = /worker|technician|person|entered|underneath|opened|handled/.test(lower);
  const noControl = /without|not verified|missing|failed|no gas|no isolation|unprotected/.test(lower);
  const noInjury = /no injury|no harm|stopped before/.test(lower);
  return Math.min(99, 42 + matched * 8 + (directExposure ? 10 : 0) + (noControl ? 18 : 0) + (noInjury ? 8 : 0));
}

function levelFor(score: number): RiskLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export function analyzeSafetyReport(text: string, activityHint?: string, location = "") : Analysis {
  const normalized = text.toLowerCase();
  const pattern = rulePatterns.find((candidate) => candidate.words.some((word) => normalized.includes(word)));
  const safe = genericSafe[normalized.includes("glove") ? 1 : 0];
  const score = scoreFor(text, pattern);
  const isSif = Boolean(pattern) && score >= 60;
  const activity = activityHint ?? pattern?.activity ?? safe.activity;
  const analysis = pattern ? {
    classification: isSif ? "SIF_POTENTIAL" as const : "NON_SIF" as const,
    sif_score: score,
    confidence: Math.min(0.97, 0.74 + (pattern.words.filter((word) => normalized.includes(word)).length * 0.04)),
    risk_level: levelFor(score),
    life_saving_rules: pattern.rules,
    activity,
    hazard: pattern.hazard,
    location,
    barrier_failure: pattern.barrier,
    potential_consequence: pattern.consequence,
    exposure: /worker|technician|person/.test(normalized) ? "Worker directly exposed" : "Potential exposure",
    reasoning: [
      `High-risk signal detected in ${activity.toLowerCase()}.`,
      pattern.barrier,
      pattern.consequence,
    ],
    recommended_action: pattern.action,
    highlights: pattern.words.filter((word) => normalized.includes(word)).slice(0, 4),
  } : {
    classification: "NON_SIF" as const,
    sif_score: score,
    confidence: 0.88,
    risk_level: levelFor(score),
    life_saving_rules: [],
    activity,
    hazard: safe.hazard,
    location,
    barrier_failure: safe.barrier,
    potential_consequence: safe.consequence,
    exposure: "Limited exposure",
    reasoning: ["No credible fatal-potential precursor signal detected.", "Observed condition is suitable for routine correction."],
    recommended_action: safe.action,
    highlights: normalized.includes("glove") ? ["gloves"] : [],
  };
  return analysis;
}

const seedScenarios = [
  ["R-2481", "2026-08-29", "Duliajan", "Central Workshop", "Near Miss", "Maintenance", "During maintenance, technician opened equipment without confirming isolation. Equipment was still energized. No injury occurred."],
  ["R-2474", "2026-08-27", "Naharkatiya", "Well Pad 4", "Near Miss", "Confined Space Entry", "Worker entered a confined space without gas testing. Supervisor stopped the job before entry was completed."],
  ["R-2468", "2026-08-24", "Digboi", "Rig 12", "Unsafe Act", "Lifting", "Worker walked underneath a suspended load during crane operation."],
  ["R-2462", "2026-08-22", "Moran", "Process Area", "Unsafe Condition", "Hot Work", "Hot work started near a flammable line before gas testing and permit verification."],
  ["R-2455", "2026-08-19", "Assam Asset", "Production Block B", "Unsafe Condition", "Maintenance", "Technician worked at height on an unprotected scaffold edge; harness was not connected."],
  ["R-2448", "2026-08-16", "Rajasthan Asset", "Field Station 7", "Unsafe Act", "Transportation", "Driver began reversing without a spotter; seat belt was not worn."],
  ["R-2441", "2026-08-14", "Duliajan", "Substation 2", "Unsafe Condition", "Electrical Work", "Temporary cable was damaged near a live electrical panel with no guarding."],
  ["R-2435", "2026-08-10", "Moran", "Warehouse", "Unsafe Act", "PPE Check", "Worker was not wearing safety gloves while handling a small cardboard box."],
];

const ordinaryObservations = [
  "Loose packaging was found beside the walkway and removed by the observer.",
  "Worker paused to correct a small housekeeping issue around the tool store.",
  "Small cardboard box handled without safety gloves; no injury or exposure occurred.",
  "Tools were returned to the designated rack after routine maintenance preparation.",
  "Minor water mark observed near a wash point and reported for housekeeping.",
];

export function createDemoReports(): SafetyReport[] {
  const rows = [...seedScenarios];
  for (let i = rows.length; i < 68; i += 1) {
    const site = sites[i % sites.length];
    const asset = ["Central Workshop", "Well Pad 4", "Rig 12", "Process Area", "Field Station 7"][i % 5];
    const pattern = rulePatterns[(i * 3) % rulePatterns.length];
    const elevated = i % 3 !== 0;
    const description = elevated
      ? `${pattern.activity} observation at ${asset}: ${pattern.words[i % pattern.words.length]} control was not verified before work. No injury occurred and the supervisor intervened.`
      : ordinaryObservations[i % ordinaryObservations.length];
    rows.push([`R-${2400 - i}`, `2026-${String(6 + Math.floor(i / 28)).padStart(2, "0")}-${String((i % 26) + 1).padStart(2, "0")}`, site, asset, i % 4 === 0 ? "Incident" : i % 4 === 1 ? "Unsafe Condition" : "Near Miss", elevated ? pattern.activity : "PPE Check", description]);
  }
  return rows.map(([id, date, site, asset, report_type, activity, description]) => ({
    id, date, site, asset, report_type: report_type as SafetyReport["report_type"], activity,
    description, ai: analyzeSafetyReport(description, activity, site), review_status: "REVIEW_REQUIRED" as const,
  }));
}