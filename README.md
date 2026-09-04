# Safety Beacon

Build a production-quality prototype web application for Oil India Limited (OIL) based on the following SIH problem statement:

TITLE:
AI/NLP Engine to Detect Serious Injury & Fatality (SIF) Precursors in OIL's Unsafe-Act/Unsafe-Condition and Near-Miss Reports

1. PRODUCT OBJECTIVE

Build an AI-powered SIF Precursor Intelligence Platform for OIL's HSE/HSSE teams.

The platform should ingest free-text safety reports such as:

Unsafe Act (UA)

Unsafe Condition (UC)

Near Miss

Incident

The system should automatically:

Classify every report as:

SIF Potential

Non-SIF Potential

Generate a SIF Potential Score from 0–100.

Explain WHY the report was classified as SIF Potential.

Identify the relevant IOGP Life-Saving Rule(s), such as:

Energy Isolation

Hot Work

Confined Space

Line of Fire

Working at Height

Driving

Lifting Operations

Electrical Safety

Other relevant rules

Extract important precursor information:

Activity

Hazard

Location/Site

Barrier failure

Unsafe act/condition

Potential consequence

Severity indicators

Recommended intervention

Detect recurring patterns across reports.

Provide an interactive dashboard that helps HSE officers identify sites, activities and hazards with the highest concentration of SIF precursors.

IMPORTANT DESIGN PRINCIPLE:
Optimize the system for RECALL over precision.

A false positive is acceptable because an HSE officer can review an extra report, while missing a genuine fatal-potential precursor can have severe consequences.

Do NOT present the AI prediction as a confirmed safety determination. Clearly label it as "AI Assessment" and allow HSE personnel to review/override the classification.

2. APPLICATION NAME

Use the product name:

"OIL SIF Sentinel"

Subtitle:

"AI-Powered Serious Injury & Fatality Precursor Intelligence"

Create a professional industrial safety visual identity suitable for Oil India Limited.

The application should look like an enterprise HSE/HSSE platform rather than a generic AI website.

3. MAIN USER FLOW

Create the following workflow:

REPORT INPUT
↓
TEXT PREPROCESSING
↓
AI/NLP ANALYSIS
↓
SIF POTENTIAL CLASSIFICATION
↓
SIF SCORE
↓
LIFE-SAVING RULE MAPPING
↓
PRECURSOR EXTRACTION
↓
PATTERN DETECTION
↓
HSE DASHBOARD
↓
HSE REVIEW / ACTION

4. DASHBOARD

Create a main dashboard with a clean enterprise interface.

Top KPI cards:

Total Reports

SIF Potential Reports

SIF Potential %

Critical Reports

Reports Requiring HSE Review

Example data can be used for the prototype.

Include:

SIF Risk Distribution

Donut/pie chart:

Critical

High

Medium

Low / Non-SIF

SIF Precursors Over Time

Line chart showing weekly/monthly SIF-potential trends.

Site Risk Ranking

Bar chart/table:

Site | Total Reports | SIF Reports | SIF Density | Risk Level

Example sites:

Duliajan

Digboi

Naharkatiya

Moran

Assam Asset

Rajasthan Asset

Activity Risk Ranking

Activity | Reports | SIF Potential | SIF %

Example:

Maintenance

Drilling

Well Intervention

Electrical Work

Hot Work

Lifting

Transportation

Confined Space Entry

Life-Saving Rule Distribution

Show which Life-Saving Rules are appearing most frequently.

Example:
Energy Isolation — 28%
Line of Fire — 21%
Working at Height — 17%
Hot Work — 13%
Confined Space — 9%

Use charts and cards that update when filters change.

5. REPORT EXPLORER

Create a dedicated "Reports" page.

Display reports in a searchable/filterable table.

Columns:

Report ID

Date

Site

Report Type

Activity

Short Description

SIF Score

Classification

Life-Saving Rule

AI Confidence

HSE Review Status

Use visual badges:

SIF POTENTIAL → red/orange
NON-SIF → green/neutral
REVIEW REQUIRED → yellow

Filters:

Site

Activity

Report Type

SIF Classification

Risk Level

Life-Saving Rule

Date Range

Review Status

Add sorting by:

Highest SIF Score

Most Recent

Site

Activity

6. REPORT DETAIL PAGE

When a user clicks a report, open a detailed analysis view.

Show:

Original Report

Display the complete free-text safety observation.

AI Assessment

Example:

SIF Potential: YES

SIF Potential Score: 87/100

Risk Level: CRITICAL

AI Confidence: 91%

WHY?

Show explainable reasons extracted from the report.

Example:

"Worker was performing maintenance on energized equipment without verified isolation."

Highlight important phrases in the original report.

Example highlighted entities:

ENERGIZED EQUIPMENT
NO ISOLATION
MAINTENANCE
WORKER EXPOSURE

Detected Precursors

Cards:

Activity:
Equipment Maintenance

Hazard:
Unexpected Energy Release

Barrier Failure:
Energy isolation / LOTO not verified

Potential Consequence:
Fatal injury

Exposure:
Worker directly exposed

IOGP Life-Saving Rule

Primary:
Energy Isolation

Secondary:
Line of Fire

Recommended HSE Action

Example:

"Immediately verify isolation/LOTO procedure and prohibit maintenance until zero-energy state is confirmed."

7. AI ANALYSIS ENGINE

Implement a prototype AI/NLP pipeline.

The frontend should behave as if a real NLP engine is processing the report.

Create a modular service architecture so that the prototype can later connect to:

OpenAI API

Local LLM

Hugging Face model

Python NLP backend

OIL's HSSE platform/API

Create an abstraction such as:

analyzeSafetyReport(text)

It should return structured JSON similar to:

{
"classification": "SIF_POTENTIAL",
"sif_score": 87,
"confidence": 0.91,
"risk_level": "CRITICAL",
"life_saving_rules": [
"Energy Isolation",
"Line of Fire"
],
"activity": "Equipment Maintenance",
"hazard": "Unexpected Energy Release",
"barrier_failure": "Energy isolation not verified",
"potential_consequence": "Fatal injury",
"exposure": "Worker",
"reasoning": [
"Work was performed on energized equipment",
"Energy isolation was not verified",
"Worker was directly exposed to hazardous energy"
],
"recommended_action": "Stop work and verify LOTO/zero-energy state before maintenance."
}

For the prototype, if no real AI API is configured, use a realistic mock NLP engine based on keyword/entity/rule matching.

DO NOT claim that mock classification is real machine learning.

Clearly label the prototype:

"Prototype AI Engine — Replace with production NLP/LLM model"

8. SIF SCORING

Create a transparent scoring mechanism.

Score should consider signals such as:

Fatal consequence potential

Energy exposure

Worker exposure

Barrier failure

High-risk activity

Life-Saving Rule violation

Multiple hazard indicators

Lack of critical control

Example:

0–29 → Low
30–59 → Medium
60–79 → High
80–100 → Critical

The score should NOT depend only on incident severity.

IMPORTANT:
A report describing a low-consequence near miss can still receive a high SIF score if the underlying scenario had credible fatal potential.

Example:

"Worker entered confined space without gas testing. No injury occurred."

Should potentially be classified as:

SIF Potential = YES
SIF Score = 92
Life-Saving Rule = Confined Space

This demonstrates the difference between actual outcome and potential consequence.

9. LIFE-SAVING RULE MAPPING

Create a rule mapping engine.

Map safety reports to relevant IOGP Life-Saving Rules.

Include at least:

Energy Isolation

Hot Work

Confined Space

Line of Fire

Working at Height

Driving

Lifting Operations

Electrical Safety

Allow multiple rules to be assigned to one report.

Example:

"Technician entered a vessel without gas testing and without isolation."

→ Confined Space
→ Energy Isolation

10. PRECURSOR PATTERN ANALYSIS

Create a "Patterns" page.

The goal is to identify recurring SIF precursor patterns.

Show:

Top Recurring Precursors

Example:

Energy isolation failures

Line-of-fire exposure

Inadequate gas testing

Working at height without fall protection

Unauthorized lifting-zone entry

Barrier Failure Analysis

Show:

Barrier | Failure Count | SIF %

Examples:

LOTO

Permit to Work

Gas Testing

PPE

Barricading

Fall Protection

Toolbox Talk

Activity × Hazard Matrix

Create a heatmap:

Activity vs Hazard

Example:

Maintenance × Energy → HIGH
Lifting × Line of Fire → HIGH
Confined Space × Toxic Gas → CRITICAL

Site × SIF Density

Show which sites have the highest concentration of SIF-potential reports.

Use:

SIF Density = SIF Potential Reports / Total Reports

Clearly explain this metric in the UI.

11. INTERACTIVE FILTERING

Dashboard charts must be interactive.

When the user selects:

Site = Duliajan

all charts and tables should update to show Duliajan-specific data.

When the user selects:

Life-Saving Rule = Energy Isolation

show only related reports and patterns.

Filters should include:

Date

Site

Asset

Activity

Report Type

Life-Saving Rule

Risk Level

SIF Classification

Add a "Reset Filters" button.

12. REPORT UPLOAD

Create an "Analyze Report" page.

Allow users to:

Paste safety report text

Upload CSV

Upload Excel

For the prototype, CSV upload should be functional.

CSV fields can include:

report_id
date
site
asset
report_type
activity
description

After upload:

Parse reports

Run analysis

Calculate SIF score

Map Life-Saving Rules

Extract precursor fields

Add results to dashboard

Show a processing indicator:

"Analyzing safety reports..."

Then show:

"Analysis completed — 128 reports processed."

13. HSE REVIEW WORKFLOW

Every AI classification should be reviewable.

Add buttons:

Confirm SIF

Mark Non-SIF

Needs Review

Override AI Classification

When HSE officer overrides the AI:

store:

Original AI Result
Human Result
Reviewer
Timestamp
Reason

Create a "Human vs AI Decisions" metric.

This will make the prototype more realistic for enterprise deployment.

14. ALERTS

Create an Alerts page.

Examples:

"Critical SIF precursor spike detected at Duliajan."

"Energy Isolation failures increased 32% this month."

"Line-of-Fire precursors are recurring across 4 sites."

"12 high-risk reports require HSE review."

Use alert severity levels.

15. NAVIGATION

Create sidebar navigation:

Dashboard
Reports
Analyze Report
Patterns
Life-Saving Rules
Sites & Activities
Alerts
HSE Review
Settings

Top navigation:

OIL SIF Sentinel
Search
Notifications
User Profile

16. DESIGN

Use a modern enterprise dashboard.

Design characteristics:

Clean

Professional

Industrial

Safety-focused

Data-rich but not cluttered

Responsive

Desktop-first

Use a light professional interface with dark navy/charcoal text and safety-oriented accent colors.

Do not make it look like a consumer AI chatbot.

Use:

Cards

Tables

Charts

Risk badges

Progress bars

Heatmaps

Timeline components

Expandable report analysis sections

Use accessible contrast and clear typography.

17. LANDING / LOGIN

Create a simple login screen:

"OIL SIF Sentinel"

"Serious Injury & Fatality Precursor Intelligence"

Role selector:

HSE Officer

Site Manager

Corporate HSE

Administrator

For prototype purposes, authentication can be mocked.

18. DEMO DATA

Generate realistic synthetic safety reports for demonstration.

Create at least 50–100 reports covering:

Unsafe Acts

Unsafe Conditions

Near Misses

Incidents

Include examples involving:

Energy Isolation
Hot Work
Confined Space
Line of Fire
Working at Height
Lifting
Driving
Electrical hazards

Make sure some reports are clearly SIF Potential and some are Non-SIF Potential.

IMPORTANT:
Use synthetic/demo data only. Do not imply that the sample records are real OIL incidents.

19. KEY DEMO SCENARIOS

Make sure these scenarios work:

Scenario 1:

"During maintenance, technician opened equipment without confirming isolation. Equipment was still energized. No injury occurred."

Expected:
SIF Potential
High/Critical score
Energy Isolation
Potential fatal energy release

Scenario 2:

"Worker entered a confined space without gas testing. Supervisor stopped the job before entry was completed."

Expected:
SIF Potential
Critical score
Confined Space
Energy/Atmospheric hazard

Scenario 3:

"Worker was not wearing safety gloves while handling a small cardboard box."

Expected:
Non-SIF Potential
Low score

Scenario 4:

"Worker walked underneath a suspended load during crane operation."

Expected:
SIF Potential
Critical score
Line of Fire / Lifting Operations

20. IMPORTANT PRODUCT PRINCIPLE

The platform should focus on:

"Fatal Potential, not just Past Severity."

Make this concept visible on the dashboard.

Add a small explanatory card:

"Traditional safety systems often prioritize what actually happened. SIF Sentinel prioritizes what COULD have happened — identifying low-severity events that contained credible fatal potential."

21. DATA PRIVACY

Add a note in Settings:

"Prototype environment. Safety reports shown in this demonstration are synthetic. Production deployment must comply with OIL data governance, access control, security and privacy requirements."

22. TECHNICAL REQUIREMENTS

Build the frontend with:

React

TypeScript

Tailwind CSS

Modern component library

Recharts or equivalent charting library

Use clean component architecture.

Create reusable components for:

KPI cards

Risk badges

Charts

Report tables

Report detail

AI assessment

Rule mapping

Filters

Heatmaps

Alerts

Keep AI analysis logic separated from UI so a real backend/model can be integrated later.

23. DEMO MODE

Add a "Demo Mode" indicator.

Provide a button:

"Load Demo Dataset"

This should populate the application with synthetic safety reports and immediately demonstrate:

SIF classification

Risk scores

Life-Saving Rule mapping

Site ranking

Activity ranking

Precursor patterns

Alerts

The first dashboard view after loading demo data should look impressive enough for an SIH presentation/demo.

24. FINAL DEMO EXPERIENCE

The ideal user journey should be:

Login
→ Dashboard
→ See SIF risk overview
→ Click "Critical SIF Reports"
→ Open a report
→ See AI reasoning
→ See detected precursor
→ See IOGP Life-Saving Rule
→ See recommended intervention
→ Go to Patterns
→ Identify recurring barrier failure
→ Filter by site/activity
→ HSE officer reviews/overrides AI classification

Build the complete prototype with functional navigation, realistic synthetic data, interactive charts, filters, report analysis, SIF scoring and explainable AI results.

Prioritize a polished, functional prototype over unnecessary features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7f12af15-79e9-4ba8-9925-1da3c1de3737).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
