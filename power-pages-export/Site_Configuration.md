# Power Pages Site Configuration

This document describes the web roles, table permissions, site settings, and
page hierarchy required to run Advisory AI Ideas on Power Pages.

---

## 1. Provision the Site

1. Go to [make.powerpages.microsoft.com](https://make.powerpages.microsoft.com).
2. Click **+ Create a site** → choose **Start from blank**.
3. Name: `Advisory AI Ideas`
4. Web address: `advisory-ai-ideas` (or your preference).
5. Select your Dataverse environment → **Done**.

Wait for provisioning (~10-15 minutes).

---

## 2. Web Roles

Create three web roles via **Portal Management → Web Roles**.

| Web Role | Description | Notes |
|---|---|---|
| `AI Ideas Submitter` | Can submit ideas and prompts, view dashboards | Default for authenticated users |
| `AI Ideas Assessor` | Can view, assess, and update idea statuses | Assigned to assessors |
| `AI Ideas Admin` | Full access including prompt review queue | Assigned to administrators |

### Role Assignment

- **Authenticated Users** web role → mark as default for new registrations.
- Map `AI Ideas Submitter` to Authenticated Users.
- Manually assign `Assessor` and `Admin` roles to specific contacts.

---

## 3. Table Permissions

Create the following table permissions in **Portal Management → Table Permissions**.

### 3a. AI_Idea

| Permission Name | Table | Scope | Privileges | Web Roles |
|---|---|---|---|---|
| `AI Idea – Read All` | cr7b4_AI_Idea | Global | Read | Submitter, Assessor, Admin |
| `AI Idea – Create Own` | cr7b4_AI_Idea | Global | Create | Submitter, Assessor, Admin |
| `AI Idea – Update` | cr7b4_AI_Idea | Global | Read, Write | Assessor, Admin |

### 3b. AI_IdeaAssessment

| Permission Name | Table | Scope | Privileges | Web Roles |
|---|---|---|---|---|
| `AI Assessment – Read All` | cr7b4_AI_IdeaAssessment | Global | Read | Submitter, Assessor, Admin |
| `AI Assessment – Create` | cr7b4_AI_IdeaAssessment | Global | Create, Read | Assessor, Admin |

### 3c. AI_Prompt

| Permission Name | Table | Scope | Privileges | Web Roles |
|---|---|---|---|---|
| `AI Prompt – Read Approved` | cr7b4_AI_Prompt | Global | Read | Submitter, Assessor, Admin |
| `AI Prompt – Create Own` | cr7b4_AI_Prompt | Global | Create | Submitter, Assessor, Admin |
| `AI Prompt – Manage` | cr7b4_AI_Prompt | Global | Create, Read, Write | Admin |

### 3d. AI_PromptRating

| Permission Name | Table | Scope | Privileges | Web Roles |
|---|---|---|---|---|
| `AI Rating – Read All` | cr7b4_AI_PromptRating | Global | Read | Submitter, Assessor, Admin |
| `AI Rating – Create` | cr7b4_AI_PromptRating | Global | Create | Submitter, Assessor, Admin |

---

## 4. Site Settings

Add these in **Portal Management → Site Settings**.

| Name | Value | Purpose |
|---|---|---|
| `Webapi/cr7b4_AI_Idea/enabled` | `true` | Enable Web API for Ideas |
| `Webapi/cr7b4_AI_Idea/fields` | `*` | Expose all columns |
| `Webapi/cr7b4_AI_IdeaAssessment/enabled` | `true` | Enable Web API for Assessments |
| `Webapi/cr7b4_AI_IdeaAssessment/fields` | `*` | Expose all columns |
| `Webapi/cr7b4_AI_Prompt/enabled` | `true` | Enable Web API for Prompts |
| `Webapi/cr7b4_AI_Prompt/fields` | `*` | Expose all columns |
| `Webapi/cr7b4_AI_PromptRating/enabled` | `true` | Enable Web API for Ratings |
| `Webapi/cr7b4_AI_PromptRating/fields` | `*` | Expose all columns |
| `HTTP/X-Frame-Options` | `SAMEORIGIN` | Security header |
| `Authentication/Registration/Enabled` | `true` | Allow user registration |

---

## 5. Web Page Hierarchy

Create the following Web Pages in **Portal Management → Web Pages**.
Each page references a **Web Template** (files in `web-templates/`).

| Web Page Name | Partial URL | Parent | Web Template | Display Order |
|---|---|---|---|---|
| Home | `/` | (root) | `home` | 1 |
| Ideas Dashboard | `/ideas` | Home | `ideas-dashboard` | 2 |
| Submit Idea | `/ideas/submit` | Ideas Dashboard | `submit-idea` | 1 |
| Idea Detail | `/ideas/detail` | Ideas Dashboard | `idea-detail` | 2 |
| Pipeline | `/ideas/pipeline` | Ideas Dashboard | `pipeline` | 3 |
| Ideas Analytics | `/ideas/analytics` | Ideas Dashboard | `ideas-analytics` | 4 |
| Prompt Library | `/prompts` | Home | `prompt-library` | 3 |
| Prompt Detail | `/prompts/detail` | Prompt Library | `prompt-detail` | 1 |
| Submit Prompt | `/prompts/submit` | Prompt Library | `submit-prompt` | 2 |
| Review Queue | `/prompts/review` | Prompt Library | `review-queue` | 3 |
| Prompt Analytics | `/prompts/analytics` | Prompt Library | `prompt-analytics` | 4 |

### Page Template Configuration

For each Web Page:
1. Set **Type** = `Web Template`.
2. Choose the matching Web Template from the table above.
3. Ensure **Publishing State** = `Published`.

---

## 6. Web Templates

Create one Web Template per file in the `web-templates/` folder.

| Web Template Name | Source File | Type |
|---|---|---|
| `Layout` | `layout.html` | Layout template |
| `home` | `home.html` | Page template |
| `ideas-dashboard` | `ideas-dashboard.html` | Page template |
| `submit-idea` | `submit-idea.html` | Page template |
| `idea-detail` | `idea-detail.html` | Page template |
| `pipeline` | `pipeline.html` | Page template |
| `ideas-analytics` | `ideas-analytics.html` | Page template |
| `prompt-library` | `prompt-library.html` | Page template |
| `prompt-detail` | `prompt-detail.html` | Page template |
| `submit-prompt` | `submit-prompt.html` | Page template |
| `review-queue` | `review-queue.html` | Page template |
| `prompt-analytics` | `prompt-analytics.html` | Page template |

---

## 7. Web Files (Static Assets)

Upload these via **Portal Management → Web Files**.

| File Name | Source | MIME Type | Parent Page |
|---|---|---|---|
| `styles.css` | `web-files/styles.css` | `text/css` | Home |
| `app.js` | `web-files/app.js` | `application/javascript` | Home |

---

## 8. Navigation (Web Link Sets)

Create a **Web Link Set** named `Primary Navigation`.

| Web Link Name | URL | Display Order | Open in New Window |
|---|---|---|---|
| Home | `/` | 1 | No |
| Ideas Dashboard | `/ideas` | 2 | No |
| Pipeline | `/ideas/pipeline` | 3 | No |
| Ideas Analytics | `/ideas/analytics` | 4 | No |
| Prompt Library | `/prompts` | 5 | No |
| Prompt Analytics | `/prompts/analytics` | 6 | No |

For admin users, add:

| Web Link Name | URL | Display Order | Open in New Window |
|---|---|---|---|
| Review Queue | `/prompts/review` | 7 | No |

---

## 9. Content Snippets

Create these reusable content snippets.

| Name | Value |
|---|---|
| `Site/Title` | Advisory AI Ideas |
| `Site/Footer` | &copy; 2026 Advisory AI Ideas. All rights reserved. |
| `Ideas/ScoreThreshold` | 2.0 |

---

## 10. Authentication Setup

Power Pages supports multiple identity providers. Recommended:

### For Internal Users (Azure AD)
1. Go to **Set up** → **Identity providers** in Power Pages design studio.
2. Add **Azure Active Directory** as an OpenID Connect provider.
3. Register an app in Azure AD → note Client ID and Secret.
4. Configure redirect URI: `https://<your-site>.powerappsportals.com/signin-openid`.

### For External Users (Azure AD B2C)
1. Create an Azure AD B2C tenant.
2. Create a sign-up/sign-in user flow.
3. Register an application → note Client ID and Secret.
4. Add as Local Authentication provider in Power Pages.
