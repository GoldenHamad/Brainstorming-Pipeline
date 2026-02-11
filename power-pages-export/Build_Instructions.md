# Advisory AI Ideas — Power Pages Build Instructions

Step-by-step guide to deploy the application as a Microsoft Power Pages site.

**Estimated effort**: 4–7 working days depending on experience.

---

## Prerequisites

- [ ] Power Platform environment with Dataverse enabled
- [ ] Power Pages license (or trial — 30-day trial available)
- [ ] System Administrator or System Customizer role
- [ ] Portal Management model-driven app installed
- [ ] Modern browser for testing

---

## Day 1: Dataverse Foundation

### 1.1 Create Tables

Open [make.powerapps.com](https://make.powerapps.com) → **Tables** → **+ New table**.

Create the four tables described in `Dataverse_Tables.md`:

1. **AI_Idea** (`cr7b4_AI_Idea`) — 10 columns
2. **AI_IdeaAssessment** (`cr7b4_AI_IdeaAssessment`) — 14 columns
3. **AI_Prompt** (`cr7b4_AI_Prompt`) — 17 columns
4. **AI_PromptRating** (`cr7b4_AI_PromptRating`) — 3 columns

> **Tip**: Replace `cr7b4_` with your own publisher prefix.
> All choice column values and relationships are documented in
> `Dataverse_Tables.md`.

### 1.2 Create Relationships

| Parent | Child | Type |
|---|---|---|
| AI_Idea | AI_IdeaAssessment | 1:N via `cr7b4_IdeaId` lookup |
| AI_Prompt | AI_PromptRating | 1:N via `cr7b4_PromptId` lookup |

### 1.3 Import Mock Data

1. Convert each CSV in `data/` to `.xlsx` (Excel).
2. In Power Apps → **Tables** → select table → **Import data** → upload.
3. Map columns and complete import.

**Import order**:
1. `AI_Ideas.csv` → AI_Idea
2. `AI_IdeaAssessments.csv` → AI_IdeaAssessment
3. `AI_Prompts.csv` → AI_Prompt
4. AI_PromptRating starts empty.

### 1.4 Verify

Open each table in Power Apps and confirm row counts:
- AI_Idea: 8 rows
- AI_IdeaAssessment: 5 rows
- AI_Prompt: 16 rows
- AI_PromptRating: 0 rows

---

## Day 2: Power Pages Site & Security

### 2.1 Provision the Site

1. Go to [make.powerpages.microsoft.com](https://make.powerpages.microsoft.com).
2. **+ Create a site** → **Start from blank** (or Starter layout).
3. Name: `Advisory AI Ideas`
4. Select your environment → **Done**.
5. Wait ~10–15 minutes for provisioning.

### 2.2 Open Portal Management

1. In Power Pages studio, click **...** → **Portal Management**.
2. This opens the model-driven app where you configure everything
   (Web Templates, Web Pages, Table Permissions, etc.).

### 2.3 Configure Site Settings (Web API)

In Portal Management → **Site Settings**, create these records:

```
Webapi/cr7b4_AI_Idea/enabled              = true
Webapi/cr7b4_AI_Idea/fields               = *
Webapi/cr7b4_AI_IdeaAssessment/enabled     = true
Webapi/cr7b4_AI_IdeaAssessment/fields      = *
Webapi/cr7b4_AI_Prompt/enabled             = true
Webapi/cr7b4_AI_Prompt/fields              = *
Webapi/cr7b4_AI_PromptRating/enabled       = true
Webapi/cr7b4_AI_PromptRating/fields        = *
```

### 2.4 Create Web Roles

In Portal Management → **Web Roles**, create:

| Web Role | Default for Authenticated? |
|---|---|
| AI Ideas Submitter | Yes |
| AI Ideas Assessor | No |
| AI Ideas Admin | No |

### 2.5 Configure Table Permissions

In Portal Management → **Table Permissions**, create the permissions
listed in `Site_Configuration.md` § 3. For each permission:

1. Set Table name → e.g. `cr7b4_AI_Idea`
2. Set Scope → `Global`
3. Set Privileges → e.g. Read, Create
4. Associate Web Roles

### 2.6 Configure Authentication

In Power Pages design studio → **Set up** → **Identity providers**:

- For internal users: Add **Azure Active Directory**.
- For external users: Add **Azure AD B2C** or **Local Authentication**.

Refer to `Site_Configuration.md` § 10 for details.

---

## Day 3: Web Templates & Layout

### 3.1 Create the Layout Template

1. Portal Management → **Web Templates** → **+ New**.
2. Name: `Layout`
3. Paste the contents of `web-templates/layout.html` into the **Source** field.
4. Save.

### 3.2 Create Page Templates

For each page, create a **Web Template** record:

| Web Template Name | Source File |
|---|---|
| `home` | `web-templates/home.html` |
| `ideas-dashboard` | `web-templates/ideas-dashboard.html` |
| `submit-idea` | `web-templates/submit-idea.html` |
| `idea-detail` | `web-templates/idea-detail.html` |
| `pipeline` | `web-templates/pipeline.html` |
| `ideas-analytics` | `web-templates/ideas-analytics.html` |
| `prompt-library` | `web-templates/prompt-library.html` |
| `prompt-detail` | `web-templates/prompt-detail.html` |
| `submit-prompt` | `web-templates/submit-prompt.html` |
| `review-queue` | `web-templates/review-queue.html` |
| `prompt-analytics` | `web-templates/prompt-analytics.html` |

For each:
1. **+ New** Web Template.
2. Paste the HTML source from the corresponding file.
3. Save.

### 3.3 Create Page Templates (Connectors)

For each Web Template above, create a matching **Page Template**:

1. Portal Management → **Page Templates** → **+ New**.
2. Name: same as the Web Template (e.g. `home`).
3. Type: `Web Template`
4. Web Template: select the matching Web Template.
5. Save.

### 3.4 Create Web Pages

Create the page hierarchy listed in `Site_Configuration.md` § 5.

For each Web Page:
1. Portal Management → **Web Pages** → **+ New**.
2. Set Name, Partial URL, Parent Page, and Page Template.
3. Set Publishing State → `Published`.
4. Save.

**Example for Ideas Dashboard**:
- Name: `Ideas Dashboard`
- Partial URL: `ideas`
- Parent Page: `Home`
- Page Template: `ideas-dashboard`
- Publishing State: Published

---

## Day 4: Static Assets & Navigation

### 4.1 Upload Web Files

1. Portal Management → **Web Files** → **+ New**.
2. Upload `web-files/styles.css`:
   - Name: `styles.css`
   - Partial URL: `styles.css`
   - Parent Page: Home
   - MIME Type: `text/css`
3. Upload `web-files/app.js`:
   - Name: `app.js`
   - Partial URL: `app.js`
   - Parent Page: Home
   - MIME Type: `application/javascript`

### 4.2 Configure Navigation

1. Portal Management → **Web Link Sets** → find or create `Primary Navigation`.
2. Add Web Links as listed in `Site_Configuration.md` § 8.

### 4.3 Create Content Snippets

1. Portal Management → **Content Snippets** → **+ New**.
2. Create:
   - `Site/Title` → "Advisory AI Ideas"
   - `Site/Footer` → "&copy; 2026 Advisory AI Ideas. All rights reserved."

---

## Day 5: Testing & Refinement

### 5.1 Functional Testing Checklist

Test each feature end-to-end:

**Ideas Module**:
- [ ] Home page loads with stats and recent ideas
- [ ] Ideas Dashboard shows priority matrix and list view
- [ ] Search and filters work (text, status, business function)
- [ ] Submit Idea form validates required fields
- [ ] Submit Idea creates a new row in Dataverse
- [ ] Idea Detail page displays all metadata
- [ ] Assessment form calculates scores correctly
- [ ] Pipeline board shows correct columns and card counts
- [ ] Advance and status-change buttons update Dataverse
- [ ] Ideas Analytics shows correct KPIs and charts

**Prompts Module**:
- [ ] Prompt Library lists only approved prompts
- [ ] Search and category/complexity filters work
- [ ] Prompt Detail shows full text, metadata, and tags
- [ ] Copy button copies text to clipboard
- [ ] Star rating submits to Dataverse and updates average
- [ ] Submit Prompt form validates and creates Pending row
- [ ] Review Queue lists pending submissions (admin only)
- [ ] Approve/Reject updates prompt status
- [ ] Prompt Analytics shows correct KPIs and charts

**General**:
- [ ] Navigation works on desktop and mobile
- [ ] Toast notifications appear and auto-dismiss
- [ ] Responsive layout at 768px and 480px breakpoints
- [ ] Authentication flow works (sign in/out)
- [ ] Non-admin users cannot see Review Queue link

### 5.2 Common Issues & Fixes

| Issue | Fix |
|---|---|
| "403 Forbidden" on Web API | Verify Site Settings are published and Table Permissions are correct |
| CSRF token errors on POST | Ensure layout.html includes `__RequestVerificationToken` — Power Pages adds this automatically to authenticated pages |
| Data not appearing | Check that Table Permissions have the correct Web Roles assigned and scope is Global |
| Charts not rendering | Ensure Chart.js CDN is loading (check browser console) |
| Icons not showing | Ensure Lucide CDN is loading and `lucide.createIcons()` is called after dynamic HTML insertion |
| Styles not loading | Verify `styles.css` Web File Partial URL matches `/styles.css` |

### 5.3 Performance Tips

- Enable **CDN** in Power Pages admin (Settings → Site Visibility → CDN).
- Use `$select` in OData queries to fetch only needed columns.
- Add `$top=N` to limit result sets on dashboards.
- Cache the CSRF token per page load (already done in `app.js`).

### 5.4 Security Hardening

- [ ] Remove `fields = *` from Site Settings; replace with explicit column lists.
- [ ] Add row-level security (Contact-scoped permissions) for user-owned records.
- [ ] Enable HTTPS-only in Power Pages admin.
- [ ] Set `HTTP/X-Frame-Options` site setting to `SAMEORIGIN`.
- [ ] Review Web Roles and ensure least-privilege access.

---

## Day 6–7 (Optional): Power Automate Flows

### Idea Submission Notification

1. Create a Power Automate flow triggered by **When a row is added** on AI_Idea.
2. Send an email/Teams notification to the assessor team.
3. Optionally auto-set status to "Screening" after N days.

### Prompt Approval Workflow

1. Trigger: **When a row is added** on AI_Prompt where Status = Pending.
2. Start an **Approval** action.
3. On Approve → set status to Approved.
4. On Reject → set status to Rejected, send feedback email.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Power Pages Site                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Layout   │  │ Web      │  │  Web Files        │  │
│  │  Template │  │ Templates│  │  (CSS + JS)       │  │
│  │  (Liquid) │  │ (Liquid  │  │                   │  │
│  │           │  │  + HTML) │  │  styles.css       │  │
│  │  Header   │  │          │  │  app.js           │  │
│  │  Nav      │  │ 11 pages │  │  (AppApi/AppData/ │  │
│  │  Footer   │  │          │  │   AppUI)          │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│                       │                              │
│              Dataverse Web API (/_api/)               │
│                       │                              │
└───────────────────────┼──────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          │         Dataverse         │
          │  ┌──────────────────────┐ │
          │  │  AI_Idea (8 rows)    │ │
          │  │  AI_IdeaAssessment   │ │
          │  │  AI_Prompt (16 rows) │ │
          │  │  AI_PromptRating     │ │
          │  └──────────────────────┘ │
          │                           │
          │  Power Automate Flows     │
          │  (notifications, approvals)│
          └───────────────────────────┘
```

---

## Summary

| Day | Tasks |
|---|---|
| 1 | Create Dataverse tables, relationships, import data |
| 2 | Provision site, configure security (roles, permissions, auth) |
| 3 | Create all Web Templates, Page Templates, Web Pages |
| 4 | Upload static assets, configure navigation, content snippets |
| 5 | End-to-end testing, bug fixes, security hardening |
| 6–7 | (Optional) Power Automate flows, polish, go-live |
