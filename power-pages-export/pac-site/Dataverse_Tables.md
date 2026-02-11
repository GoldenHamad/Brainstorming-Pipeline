# Dataverse Table Definitions

These are the Dataverse tables required by the Advisory AI Ideas Power Pages site.

> **Publisher prefix used**: `cr7b4_` — replace with your own publisher prefix.
> If you change the prefix, update references in `site-settings/` YAML files and `web-files/app-js/app.js`.

---

## Table 1: AI_Idea (`cr7b4_AI_Idea`)

| Column Display Name | Schema Name | Type | Required | Notes |
|---|---|---|---|---|
| Idea ID | `cr7b4_IdeaId` | Single line of text (20) | Yes | Business key, e.g. IDEA-001 |
| Title | `cr7b4_Title` | Single line of text (200) | Yes | |
| Description | `cr7b4_Description` | Multiline text (2000) | Yes | |
| AI Capability Area | `cr7b4_AICapabilityArea` | Choice | Yes | See choice values below |
| Business Function | `cr7b4_BusinessFunction` | Choice | Yes | See choice values below |
| Expected Benefits | `cr7b4_ExpectedBenefits` | Multiline text (2000) | Yes | |
| Submitter Name | `cr7b4_SubmitterName` | Single line of text (100) | Yes | |
| Submitter Email | `cr7b4_SubmitterEmail` | Single line of text (200) | Yes | |
| Status | `cr7b4_Status` | Choice | Yes | See choice values below |
| Created At | `cr7b4_CreatedAt` | Date and Time | Yes | Date Only format |

### Choice: AI Capability Area

| Value | Label |
|---|---|
| 100000000 | Generative AI |
| 100000001 | Machine Learning |
| 100000002 | Natural Language Processing |
| 100000003 | Computer Vision |
| 100000004 | Robotic Process Automation |
| 100000005 | Predictive Analytics |
| 100000006 | Conversational AI |
| 100000007 | Document Intelligence |

### Choice: Business Function

| Value | Label |
|---|---|
| 100000000 | Audit |
| 100000001 | Tax |
| 100000002 | Advisory |
| 100000003 | Deal Advisory |
| 100000004 | IT |
| 100000005 | Operations |
| 100000006 | Human Resources |
| 100000007 | Finance |
| 100000008 | Marketing |
| 100000009 | Legal |
| 100000010 | Risk & Compliance |

### Choice: Idea Status

| Value | Label |
|---|---|
| 100000000 | Submitted |
| 100000001 | Screening |
| 100000002 | Assessment |
| 100000003 | Prioritized |
| 100000004 | Development |
| 100000005 | Pilot |
| 100000006 | Deployed |
| 100000007 | Scaling |
| 100000008 | On Hold |
| 100000009 | Rejected |
| 100000010 | Archived |

---

## Table 2: AI_IdeaAssessment (`cr7b4_AI_IdeaAssessment`)

| Column Display Name | Schema Name | Type | Required | Notes |
|---|---|---|---|---|
| Assessment ID | `cr7b4_AssessmentId` | Single line of text (20) | Yes | Business key |
| Idea | `cr7b4_IdeaId` | Lookup -> AI_Idea | Yes | N:1 relationship |
| Business Growth | `cr7b4_BusinessGrowth` | Choice (ScoreLevel) | Yes | |
| Cost Efficiency | `cr7b4_CostEfficiency` | Choice (ScoreLevel) | Yes | |
| Business Resilience | `cr7b4_BusinessResilience` | Choice (ScoreLevel) | Yes | |
| Business Agility | `cr7b4_BusinessAgility` | Choice (ScoreLevel) | Yes | |
| Technical Feasibility | `cr7b4_TechnicalFeasibility` | Choice (ScoreLevel) | Yes | |
| Internal Readiness | `cr7b4_InternalReadiness` | Choice (ScoreLevel) | Yes | |
| External Readiness | `cr7b4_ExternalReadiness` | Choice (ScoreLevel) | Yes | |
| Value Score | `cr7b4_ValueScore` | Decimal (2 places) | No | Calculated client-side |
| Feasibility Score | `cr7b4_FeasibilityScore` | Decimal (2 places) | No | Calculated client-side |
| Quadrant | `cr7b4_Quadrant` | Choice | No | Calculated client-side |
| Assessed By | `cr7b4_AssessedBy` | Single line of text (100) | Yes | |
| Assessed At | `cr7b4_AssessedAt` | Date and Time | Yes | |

### Choice: Score Level

| Value | Label |
|---|---|
| 1 | Low |
| 2 | Medium |
| 3 | High |

### Choice: Quadrant

| Value | Label |
|---|---|
| 100000000 | Likely Wins |
| 100000001 | Calculated Risks |
| 100000002 | Marginal Gains |
| 100000003 | Avoid |

---

## Table 3: AI_Prompt (`cr7b4_AI_Prompt`)

| Column Display Name | Schema Name | Type | Required | Notes |
|---|---|---|---|---|
| Prompt ID | `cr7b4_PromptId` | Single line of text (20) | Yes | Business key |
| Title | `cr7b4_Title` | Single line of text (200) | Yes | |
| Category | `cr7b4_Category` | Choice | Yes | See below |
| Prompt Text | `cr7b4_PromptText` | Multiline text (4000) | Yes | |
| Output Format | `cr7b4_OutputFormat` | Choice | No | |
| Complexity Level | `cr7b4_ComplexityLevel` | Choice | Yes | |
| Best Practices | `cr7b4_BestPractices` | Multiline text (2000) | No | |
| Owner Name | `cr7b4_OwnerName` | Single line of text (200) | Yes | |
| Tags | `cr7b4_Tags` | Single line of text (500) | No | Semicolon-separated |
| AI Tools | `cr7b4_AITools` | Multi-select Choice | Yes | |
| Version | `cr7b4_Version` | Single line of text (20) | No | e.g. 1.2.0 |
| Usage Count | `cr7b4_UsageCount` | Whole Number | No | Default 0 |
| Rating | `cr7b4_Rating` | Decimal (1 place) | No | Average, 0.0-5.0 |
| Rating Count | `cr7b4_RatingCount` | Whole Number | No | Default 0 |
| Status | `cr7b4_PromptStatus` | Choice | Yes | |
| Submitter Name | `cr7b4_SubmitterName` | Single line of text (100) | No | |
| Submitter Email | `cr7b4_SubmitterEmail` | Single line of text (200) | No | |

### Choice: Prompt Category

| Value | Label |
|---|---|
| 100000000 | Client Deliverables |
| 100000001 | Internal Productivity |
| 100000002 | Research & Analysis |
| 100000003 | Data & Finance |
| 100000004 | Creative & Marketing |
| 100000005 | Technical |

### Choice: Complexity Level

| Value | Label |
|---|---|
| 100000000 | Beginner |
| 100000001 | Intermediate |
| 100000002 | Expert |

### Choice: AI Tool (multi-select)

| Value | Label |
|---|---|
| 100000000 | ChatGPT |
| 100000001 | Microsoft Copilot |
| 100000002 | Google Gemini |
| 100000003 | Claude |
| 100000004 | Internal AI |

### Choice: Output Format

| Value | Label |
|---|---|
| 100000000 | Bullet points |
| 100000001 | Table |
| 100000002 | Narrative |
| 100000003 | Structured narrative with bullet points |
| 100000004 | Code |
| 100000005 | JSON |
| 100000006 | Markdown |

### Choice: Prompt Status

| Value | Label |
|---|---|
| 100000000 | Draft |
| 100000001 | Pending |
| 100000002 | Approved |
| 100000003 | Rejected |
| 100000004 | Archived |

---

## Table 4: AI_PromptRating (`cr7b4_AI_PromptRating`)

| Column Display Name | Schema Name | Type | Required | Notes |
|---|---|---|---|---|
| Prompt | `cr7b4_PromptId` | Lookup -> AI_Prompt | Yes | N:1 relationship |
| Rating | `cr7b4_Rating` | Whole Number | Yes | 1-5 |
| Rated By | `cr7b4_RatedBy` | Single line of text (200) | Yes | |

---

## Relationships

| Parent Table | Child Table | Type | Relationship Name |
|---|---|---|---|
| AI_Idea | AI_IdeaAssessment | 1:N | `cr7b4_AI_Idea_Assessments` |
| AI_Prompt | AI_PromptRating | 1:N | `cr7b4_AI_Prompt_Ratings` |

---

## Scoring Formulas

Scores are computed in JavaScript (`web-files/app-js/app.js`) before saving to Dataverse.

### Value Score (1.0 - 3.0)

```
ValueScore = (BusinessGrowth x 0.20) + (CostEfficiency x 0.20)
           + (BusinessResilience x 0.30) + (BusinessAgility x 0.30)
```

### Feasibility Score (1.0 - 3.0)

```
FeasibilityScore = (TechnicalFeasibility x 0.50)
                 + (InternalReadiness x 0.30) + (ExternalReadiness x 0.20)
```

### Quadrant (threshold = 2.0)

| Condition | Quadrant |
|---|---|
| Value >= 2.0 AND Feasibility >= 2.0 | Likely Wins |
| Value >= 2.0 AND Feasibility < 2.0 | Calculated Risks |
| Value < 2.0 AND Feasibility >= 2.0 | Marginal Gains |
| Value < 2.0 AND Feasibility < 2.0 | Avoid |
