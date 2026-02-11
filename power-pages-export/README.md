# Advisory AI Ideas — Power Pages Deployment Package

Everything needed to deploy the **Advisory AI Ideas** application as a Microsoft Power Pages site backed by Dataverse.

## Package Structure

```
power-pages-export/
├── README.md                    <- You are here
├── deploy.ps1                   <- PAC CLI deployment automation script
└── pac-site/                    <- PAC CLI-compatible site folder
    ├── website.yml              <- Site manifest
    ├── Dataverse_Tables.md      <- Table schemas, columns, choice values
    ├── web-templates/           <- 12 Liquid + HTML templates (Layout + 11 pages)
    ├── page-templates/          <- 11 page-to-template connectors
    ├── web-pages/               <- 11 web page definitions with content
    ├── web-files/               <- Static assets (styles.css + app.js)
    ├── content-snippets/        <- Reusable content snippets
    ├── site-settings/           <- 10 Dataverse Web API + security settings
    ├── web-roles/               <- 3 security roles (Submitter, Assessor, Admin)
    ├── table-permissions/       <- 10 CRUD permissions per table and role
    ├── weblink-sets/            <- Primary navigation links (7 links)
    └── data/                    <- Seed data CSVs (8 ideas, 16 prompts, 5 assessments)
```

## Prerequisites

- Microsoft Power Platform environment with **Dataverse** enabled
- **Power Pages** license (or 30-day trial)
- **Power Platform CLI** (PAC): `dotnet tool install --global Microsoft.PowerApps.CLI.Tool`
- System Administrator or System Customizer security role

## Quick Start (PAC CLI)

```powershell
# 1. Authenticate to your environment
pac auth create --url https://YOUR-ORG.crm.dynamics.com

# 2. Create Dataverse tables (see pac-site/Dataverse_Tables.md)
#    - AI_Idea, AI_IdeaAssessment, AI_Prompt, AI_PromptRating

# 3. Provision a Power Pages site at make.powerpages.microsoft.com

# 4. Find your website ID
pac powerpages list

# 5. Run the deployment script
cd power-pages-export
pwsh ./deploy.ps1 -WebsiteId "YOUR-WEBSITE-GUID"
```

## Deployment Steps (Detailed)

### Step 1: Create Dataverse Tables

Open [make.powerapps.com](https://make.powerapps.com) and create the 4 tables documented in `pac-site/Dataverse_Tables.md`:

| Table | Prefix | Columns | Notes |
|---|---|---|---|
| AI_Idea | cr7b4_ | 10 | Ideas with status pipeline |
| AI_IdeaAssessment | cr7b4_ | 14 | Value/feasibility scoring |
| AI_Prompt | cr7b4_ | 17 | Prompt library entries |
| AI_PromptRating | cr7b4_ | 3 | User ratings (starts empty) |

**Relationships:**
- AI_Idea 1:N AI_IdeaAssessment (via `cr7b4_IdeaId` lookup)
- AI_Prompt 1:N AI_PromptRating (via `cr7b4_PromptId` lookup)

> Replace `cr7b4_` with your own publisher prefix. Update `site-settings/` YAMLs and `web-files/app-js/app.js` accordingly.

### Step 2: Import Seed Data

Convert CSVs from `pac-site/data/` to `.xlsx` and import via Power Apps:

1. `AI_Ideas.csv` -> AI_Idea (8 rows)
2. `AI_IdeaAssessments.csv` -> AI_IdeaAssessment (5 rows)
3. `AI_Prompts.csv` -> AI_Prompt (16 rows)
4. AI_PromptRating starts empty

### Step 3: Provision Power Pages Site

1. Go to [make.powerpages.microsoft.com](https://make.powerpages.microsoft.com)
2. **+ Create a site** -> **Start from blank**
3. Name: `Advisory AI Ideas`
4. Select your environment -> **Done**
5. Wait ~10-15 minutes for provisioning

### Step 4: Deploy Site Content

**Option A — Automated (recommended):**
```powershell
pwsh ./deploy.ps1 -WebsiteId "YOUR-WEBSITE-GUID"
```

**Option B — Manual via Portal Management:**
1. Open Portal Management (in Power Pages studio: **...** -> **Portal Management**)
2. Create Web Templates: copy HTML from each `web-templates/*/` source file
3. Create Page Templates: link each to its Web Template (type = Web Template)
4. Create Web Pages: follow the hierarchy in `web-pages/` YAMLs
5. Upload Web Files: `styles.css` and `app.js`
6. Add Site Settings: one per YAML in `site-settings/`
7. Create Content Snippets: from `content-snippets/` YAMLs

### Step 5: Configure Security

**Web Roles** (create in Portal Management -> Web Roles):

| Web Role | Default? | Description |
|---|---|---|
| AI Ideas Submitter | Yes (authenticated) | Submit ideas and prompts, view dashboards |
| AI Ideas Assessor | No | Assess and update idea statuses |
| AI Ideas Admin | No | Full access including prompt review queue |

**Table Permissions** (create in Portal Management -> Table Permissions):
- See `pac-site/table-permissions/` for all 10 permission definitions
- Each YAML specifies the table, scope (Global), privileges, and associated roles

**Authentication** (Power Pages studio -> Set up -> Identity providers):
- Internal users: Azure Active Directory
- External users: Azure AD B2C or Local Authentication

### Step 6: Configure Navigation

Create a **Web Link Set** named `Primary Navigation` with the links defined in `pac-site/weblink-sets/Primary-Navigation/`.

### Step 7: Test

Verify each module works end-to-end:

**Ideas Module:**
- [ ] Home page loads with stats
- [ ] Ideas Dashboard shows list and priority matrix
- [ ] Submit Idea form creates records in Dataverse
- [ ] Idea Detail shows assessment scores
- [ ] Pipeline board displays correct columns
- [ ] Ideas Analytics renders charts

**Prompts Module:**
- [ ] Prompt Library lists approved prompts
- [ ] Prompt Detail shows full text with copy and rating
- [ ] Submit Prompt form creates pending records
- [ ] Review Queue (admin only) allows approve/reject
- [ ] Prompt Analytics shows usage metrics

**Common Issues:**

| Issue | Fix |
|---|---|
| 403 Forbidden on Web API | Verify Site Settings and Table Permissions |
| Data not appearing | Check Table Permissions have correct Web Roles |
| Charts not rendering | Ensure Chart.js CDN loads (check browser console) |
| Icons not showing | Ensure Lucide CDN loads, call `lucide.createIcons()` |
| Styles not loading | Verify `styles.css` Web File partial URL = `/styles.css` |

## Architecture

```
Power Pages Site
  Layout Template (Liquid) ── nav, header, footer
  11 Page Templates (Liquid + HTML + JS)
  Web Files: styles.css, app.js (AppApi, AppData, AppUI)
       |
  Dataverse Web API (/_api/)
       |
  Dataverse Tables
    AI_Idea ──< AI_IdeaAssessment
    AI_Prompt ──< AI_PromptRating
```

## Security Model

| Role | Ideas | Assessments | Prompts | Ratings | Review Queue |
|---|---|---|---|---|---|
| Submitter | Read + Create | Read | Read + Create | Read + Create | No access |
| Assessor | Read + Write | Read + Create | Read + Create | Read + Create | No access |
| Admin | Read + Write | Read + Create | Full CRUD | Read + Create | Full access |
