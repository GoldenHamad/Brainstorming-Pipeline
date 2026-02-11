# Advisory AI Ideas — Power Pages Export Package

This folder contains everything needed to rebuild the **Advisory AI Ideas** application
as a Microsoft Power Pages site backed by Dataverse.

## What Is Power Pages?

Power Pages (formerly Power Apps Portals) creates **external-facing websites** using
HTML, CSS, JavaScript, and Liquid templates with Dataverse as the data store.
Unlike Power Apps Canvas Apps (low-code, internal), Power Pages gives you **near-pixel-perfect
design fidelity** (95-100%) with full control over layout, styling, and interactivity.

## Package Contents

```
power-pages-export/
├── README.md                          ← You are here
├── Build_Instructions.md              ← Day-by-day implementation guide
├── Dataverse_Tables.md                ← Table schemas & relationships
├── Site_Configuration.md              ← Web roles, table permissions, site settings
├── data/                              ← Seed data (shared with Power Apps export)
│   ├── AI_Ideas.csv
│   ├── AI_IdeaAssessments.csv
│   ├── AI_Prompts.csv
│   └── Choice_Values.csv
├── web-templates/                     ← Liquid + HTML page templates
│   ├── layout.html                    ← Master layout (header, nav, footer)
│   ├── home.html                      ← Landing page
│   ├── ideas-dashboard.html           ← Ideas list with filters & priority matrix
│   ├── submit-idea.html               ← New idea submission form
│   ├── idea-detail.html               ← Single idea view + assessment panel
│   ├── pipeline.html                  ← Kanban pipeline board
│   ├── ideas-analytics.html           ← Ideas KPIs & charts
│   ├── prompt-library.html            ← Prompt catalogue with search
│   ├── prompt-detail.html             ← Single prompt view + rating
│   ├── submit-prompt.html             ← New prompt submission form
│   ├── review-queue.html              ← Admin approval queue
│   └── prompt-analytics.html          ← Prompt usage KPIs & charts
└── web-files/                         ← Static assets
    ├── styles.css                     ← Full KPMG-branded stylesheet
    └── app.js                         ← Web API helper + page controllers
```

## How to Use This Package

1. **Create Dataverse tables** — follow `Dataverse_Tables.md` (same tables as the
   Power Apps export, so skip if they already exist).
2. **Import seed data** — upload the CSVs from `data/` in the order specified.
3. **Provision a Power Pages site** in your Power Platform environment.
4. **Configure security** — follow `Site_Configuration.md` to set up web roles,
   table permissions, and site settings.
5. **Create web pages & templates** — copy each file from `web-templates/` into
   the Portal Management app as Web Templates, then wire them to Web Pages.
6. **Upload web files** — add `styles.css` and `app.js` as Web Files.
7. **Follow** `Build_Instructions.md` for a detailed day-by-day walkthrough.

## Data Import Order

1. `AI_Ideas.csv` → cr7b4_AI_Idea table
2. `AI_IdeaAssessments.csv` → cr7b4_AI_IdeaAssessment table
3. `AI_Prompts.csv` → cr7b4_AI_Prompt table
4. `AI_PromptRating` table starts empty (ratings are collected at runtime)

## Key Differences from Power Apps Export

| Aspect | Power Apps (Canvas) | Power Pages |
|---|---|---|
| Design fidelity | 70-80% | 95-100% |
| Rendering engine | Power Fx + controls | HTML / CSS / JS + Liquid |
| Data access | Native Dataverse connector | Dataverse Web API |
| Authentication | Azure AD (internal) | Azure AD B2C / Azure AD |
| Hosting | Power Platform | Power Pages (own URL) |
| External users | Not supported | Fully supported |

## Prerequisites

- Microsoft Power Platform environment with Dataverse
- Power Pages license (or trial)
- Portal Management model-driven app (installed automatically)
- Maker or System Administrator security role
