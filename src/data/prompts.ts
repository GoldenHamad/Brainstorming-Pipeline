// TypeScript interfaces matching PRD schema (Section 5.1)

export type Category =
    | 'Client Deliverables'
    | 'Internal Productivity'
    | 'Research & Analysis'
    | 'Data & Finance'
    | 'Creative & Marketing'
    | 'Technical';

export type OutputFormat =
    | 'Bullet points'
    | 'Table'
    | 'Narrative'
    | 'Structured narrative with bullet points'
    | 'Code'
    | 'JSON'
    | 'Markdown';

export type ComplexityLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type AITool =
    | 'ChatGPT'
    | 'Microsoft Copilot'
    | 'Google Gemini'
    | 'Claude'
    | 'Internal AI';

export type PromptStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export interface PromptEntry {
    prompt_id: string;
    title: string;
    category: Category;
    prompt_text: string;
    output_format: OutputFormat;
    example_input?: string;
    example_output?: string;
    complexity_level: ComplexityLevel;
    best_practices?: string;
    owner: string;
    tags: string[];
    ai_tools: AITool[];
    version: string;
    last_modified: string;
    usage_count: number;
    rating: number;
    rating_count: number;
    status: PromptStatus;
}

export interface PromptSubmission extends Omit<PromptEntry, 'prompt_id' | 'usage_count' | 'rating' | 'rating_count' | 'status' | 'version' | 'last_modified'> {
    submitter_name: string;
    submitter_email: string;
    submitted_at: string;
}

export interface UserRating {
    prompt_id: string;
    user_id: string;
    rating: number;
    feedback?: string;
    created_at: string;
}

export interface AnalyticsData {
    total_users: number;
    total_prompts: number;
    total_copies: number;
    total_submissions: number;
    average_rating: number;
    daily_usage: { date: string; copies: number; views: number }[];
    top_prompts: { prompt_id: string; title: string; copies: number }[];
    category_distribution: { category: Category; count: number }[];
}

// Category metadata for UI
export const categoryInfo: Record<Category, {
    icon: string;
    color: string;
    description: string;
}> = {
    'Client Deliverables': {
        icon: 'briefcase',
        color: '#00338D',
        description: 'Executive summaries, proposal outlines, market analysis reports, project roadmaps'
    },
    'Internal Productivity': {
        icon: 'mail',
        color: '#483698',
        description: 'Email drafting, meeting note summaries, project status updates, stakeholder communications'
    },
    'Research & Analysis': {
        icon: 'search',
        color: '#00A3A1',
        description: 'Competitive intelligence, industry trends, regulatory analysis, technology assessments'
    },
    'Data & Finance': {
        icon: 'chart',
        color: '#28A745',
        description: 'KPI analysis, risk assessment, scenario modeling, financial summaries'
    },
    'Creative & Marketing': {
        icon: 'palette',
        color: '#FF6B35',
        description: 'Tagline creation, content ideation, workshop design, presentation narratives'
    },
    'Technical': {
        icon: 'code',
        color: '#6C757D',
        description: 'Code documentation, architecture descriptions, API specifications, test case generation'
    }
};

// Sample prompts across all categories (15+ as per plan)
export const samplePrompts: PromptEntry[] = [
    // Client Deliverables
    {
        prompt_id: 'P001',
        title: 'Executive Summary Generator',
        category: 'Client Deliverables',
        prompt_text: `You are a senior management consultant at a Big Four firm. Summarize the following document into an executive summary for C-suite stakeholders. Include: key findings (3-5 bullet points), strategic recommendations, immediate next steps, and potential risks. Limit to 500 words. Use professional, authoritative tone.

Document to summarize:
[PASTE DOCUMENT HERE]`,
        output_format: 'Structured narrative with bullet points',
        example_input: 'Annual performance report with financial data and market analysis',
        example_output: 'Executive Overview: The FY2025 performance demonstrates strong growth... Key Findings: • Revenue increased by 15%...',
        complexity_level: 'Beginner',
        best_practices: 'Provide context about the audience. For board presentations, focus on strategic implications. For operational reviews, include more tactical details.',
        owner: 'Strategy & Operations Practice',
        tags: ['executive summary', 'client deliverable', 'board presentation', 'strategy'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot', 'Google Gemini'],
        version: '1.2.0',
        last_modified: '2026-01-15',
        usage_count: 1247,
        rating: 4.8,
        rating_count: 156,
        status: 'approved'
    },
    {
        prompt_id: 'P002',
        title: 'Proposal Outline Builder',
        category: 'Client Deliverables',
        prompt_text: `Create a comprehensive proposal outline for a consulting engagement. The proposal should include:

1. Executive Summary
2. Understanding of Client Needs
3. Our Approach & Methodology
4. Project Timeline & Milestones
5. Team & Resources
6. Investment Summary
7. Why Choose Us
8. Next Steps

Client Industry: [INDUSTRY]
Engagement Type: [TYPE - Strategy/Operations/Digital/Risk]
Estimated Duration: [DURATION]
Key Challenges: [CHALLENGES]`,
        output_format: 'Structured narrative with bullet points',
        complexity_level: 'Intermediate',
        best_practices: 'Tailor the tone to match client culture. Include specific deliverables for each phase.',
        owner: 'Business Development Team',
        tags: ['proposal', 'sales', 'client engagement', 'business development'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot'],
        version: '2.0.0',
        last_modified: '2026-01-10',
        usage_count: 892,
        rating: 4.6,
        rating_count: 98,
        status: 'approved'
    },
    {
        prompt_id: 'P003',
        title: 'Market Analysis Report',
        category: 'Client Deliverables',
        prompt_text: `Conduct a comprehensive market analysis for [INDUSTRY/MARKET]. Structure your analysis as follows:

1. Market Overview
   - Market size and growth rate
   - Key market segments

2. Competitive Landscape
   - Major players and market share
   - Competitive positioning matrix

3. Industry Trends
   - Technological disruptions
   - Regulatory changes
   - Consumer behavior shifts

4. Opportunities & Threats
   - Growth opportunities
   - Market challenges

5. Strategic Recommendations
   - Entry/expansion strategies
   - Risk mitigation approaches

Use data-driven language and cite industry benchmarks where applicable.`,
        output_format: 'Structured narrative with bullet points',
        complexity_level: 'Expert',
        best_practices: 'Request specific data sources or ranges. Validate AI outputs against recent industry reports.',
        owner: 'Strategy Practice',
        tags: ['market analysis', 'competitive intelligence', 'strategy', 'industry research'],
        ai_tools: ['ChatGPT', 'Google Gemini', 'Claude'],
        version: '1.1.0',
        last_modified: '2026-01-12',
        usage_count: 654,
        rating: 4.7,
        rating_count: 73,
        status: 'approved'
    },

    // Internal Productivity
    {
        prompt_id: 'P004',
        title: 'Professional Email Composer',
        category: 'Internal Productivity',
        prompt_text: `Draft a professional email with the following parameters:

Purpose: [REQUEST/UPDATE/FOLLOW-UP/ESCALATION]
Recipient: [NAME & ROLE]
Tone: [FORMAL/SEMI-FORMAL/CASUAL]
Key Message: [MAIN POINT]
Action Required: [SPECIFIC ASK]
Deadline (if any): [DATE]

The email should be concise (under 200 words), clear, and actionable. Include a compelling subject line.`,
        output_format: 'Narrative',
        complexity_level: 'Beginner',
        best_practices: 'Always review AI-generated emails for appropriate tone. Personalize greetings based on relationship.',
        owner: 'Corporate Communications',
        tags: ['email', 'communication', 'productivity', 'professional writing'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot', 'Google Gemini', 'Claude'],
        version: '1.0.0',
        last_modified: '2026-01-08',
        usage_count: 2156,
        rating: 4.5,
        rating_count: 234,
        status: 'approved'
    },
    {
        prompt_id: 'P005',
        title: 'Meeting Notes Summarizer',
        category: 'Internal Productivity',
        prompt_text: `Transform the following meeting notes/transcript into a structured summary:

Meeting Details:
- Date: [DATE]
- Attendees: [NAMES]
- Purpose: [MEETING OBJECTIVE]

Required Output:
1. Key Discussion Points (bullet format)
2. Decisions Made
3. Action Items (with owner and deadline)
4. Open Issues/Parking Lot Items
5. Next Steps

Meeting Notes/Transcript:
[PASTE CONTENT HERE]`,
        output_format: 'Bullet points',
        complexity_level: 'Beginner',
        best_practices: 'Include speaker attributions for accountability. Flag any unclear decisions for follow-up.',
        owner: 'Project Management Office',
        tags: ['meeting notes', 'productivity', 'action items', 'documentation'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot', 'Google Gemini'],
        version: '1.3.0',
        last_modified: '2026-01-14',
        usage_count: 1893,
        rating: 4.9,
        rating_count: 201,
        status: 'approved'
    },
    {
        prompt_id: 'P006',
        title: 'Status Report Generator',
        category: 'Internal Productivity',
        prompt_text: `Generate a weekly project status report using the following information:

Project Name: [NAME]
Reporting Period: [START DATE] - [END DATE]
Project Manager: [NAME]

Accomplishments This Week:
[LIST ACHIEVEMENTS]

Planned for Next Week:
[LIST PLANNED ACTIVITIES]

Risks/Issues:
[LIST ANY CONCERNS]

Format the report with:
- RAG Status (Red/Amber/Green) with justification
- Progress percentage
- Key milestones achieved
- Budget status (if applicable)
- Stakeholder communications needed`,
        output_format: 'Structured narrative with bullet points',
        complexity_level: 'Beginner',
        best_practices: 'Be honest about RAG status. Include quantifiable metrics where possible.',
        owner: 'Project Management Office',
        tags: ['status report', 'project management', 'reporting', 'weekly update'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot'],
        version: '1.0.0',
        last_modified: '2026-01-05',
        usage_count: 1432,
        rating: 4.4,
        rating_count: 167,
        status: 'approved'
    },

    // Research & Analysis
    {
        prompt_id: 'P007',
        title: 'Competitive Intelligence Analyzer',
        category: 'Research & Analysis',
        prompt_text: `Analyze the competitive landscape for [COMPANY/PRODUCT] in the [INDUSTRY] sector:

1. Direct Competitors
   - List top 5 competitors with brief profiles
   - Compare key differentiators

2. SWOT Analysis
   - Strengths, Weaknesses, Opportunities, Threats

3. Competitive Positioning
   - Price positioning
   - Feature comparison
   - Market perception

4. Strategic Recommendations
   - Competitive advantages to leverage
   - Gaps to address
   - Market opportunities

Focus on actionable insights rather than generic observations.`,
        output_format: 'Table',
        complexity_level: 'Intermediate',
        best_practices: 'Cross-reference with recent earnings calls and press releases. Note data freshness limitations.',
        owner: 'Strategy Practice',
        tags: ['competitive analysis', 'SWOT', 'market research', 'strategy'],
        ai_tools: ['ChatGPT', 'Google Gemini', 'Claude'],
        version: '1.0.0',
        last_modified: '2026-01-11',
        usage_count: 567,
        rating: 4.6,
        rating_count: 65,
        status: 'approved'
    },
    {
        prompt_id: 'P008',
        title: 'Regulatory Impact Assessment',
        category: 'Research & Analysis',
        prompt_text: `Assess the impact of [REGULATION/POLICY] on [INDUSTRY/COMPANY]:

Analysis Framework:
1. Regulatory Overview
   - Key provisions
   - Effective dates
   - Enforcement mechanisms

2. Compliance Requirements
   - Mandatory changes
   - Documentation requirements
   - Reporting obligations

3. Business Impact Assessment
   - Operational changes needed
   - Cost implications
   - Timeline for compliance

4. Risk Analysis
   - Non-compliance penalties
   - Reputational risks
   - Competitive implications

5. Recommended Action Plan
   - Immediate steps
   - Medium-term initiatives
   - Long-term strategy`,
        output_format: 'Structured narrative with bullet points',
        complexity_level: 'Expert',
        best_practices: 'Always verify regulatory details with legal counsel. Include jurisdiction-specific considerations.',
        owner: 'Risk & Compliance Practice',
        tags: ['regulatory', 'compliance', 'risk assessment', 'policy analysis'],
        ai_tools: ['ChatGPT', 'Claude'],
        version: '1.0.0',
        last_modified: '2026-01-09',
        usage_count: 234,
        rating: 4.3,
        rating_count: 28,
        status: 'approved'
    },

    // Data & Finance
    {
        prompt_id: 'P009',
        title: 'Financial Summary Narrator',
        category: 'Data & Finance',
        prompt_text: `Transform the following financial data into an executive narrative:

Financial Data:
[PASTE DATA - Revenue, Costs, Margins, YoY comparisons]

Generate a narrative that:
1. Highlights key performance trends
2. Explains significant variances (>5% YoY)
3. Identifies areas of concern
4. Provides forward-looking insights
5. Recommends focus areas for next quarter

Use CFO-appropriate language. Include specific numbers and percentages.`,
        output_format: 'Narrative',
        complexity_level: 'Intermediate',
        best_practices: 'Verify all calculations independently. Never rely solely on AI for financial reporting.',
        owner: 'Finance Transformation Practice',
        tags: ['financial analysis', 'CFO reporting', 'variance analysis', 'performance'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot'],
        version: '1.1.0',
        last_modified: '2026-01-13',
        usage_count: 445,
        rating: 4.5,
        rating_count: 52,
        status: 'approved'
    },
    {
        prompt_id: 'P010',
        title: 'KPI Dashboard Interpreter',
        category: 'Data & Finance',
        prompt_text: `Interpret the following KPI dashboard data and provide actionable insights:

Dashboard Metrics:
[LIST KPIS WITH VALUES AND TARGETS]

For each KPI, provide:
1. Status (On Track / At Risk / Off Track)
2. Root cause analysis for any deviations
3. Recommended corrective actions
4. Dependencies and risks

Conclude with:
- Top 3 priorities for leadership attention
- Quick wins that can be implemented immediately
- Metrics requiring further investigation`,
        output_format: 'Bullet points',
        complexity_level: 'Intermediate',
        best_practices: 'Combine quantitative insights with qualitative context from stakeholder conversations.',
        owner: 'Performance Improvement Team',
        tags: ['KPI', 'dashboard', 'performance metrics', 'analysis'],
        ai_tools: ['ChatGPT', 'Google Gemini'],
        version: '1.0.0',
        last_modified: '2026-01-07',
        usage_count: 389,
        rating: 4.4,
        rating_count: 41,
        status: 'approved'
    },

    // Creative & Marketing
    {
        prompt_id: 'P011',
        title: 'Thought Leadership Article Creator',
        category: 'Creative & Marketing',
        prompt_text: `Write a thought leadership article on [TOPIC] for publication on KPMG Insights:

Target Audience: [C-SUITE/INDUSTRY PROFESSIONALS/GENERAL BUSINESS]
Word Count: [800-1200]
Key Message: [MAIN TAKEAWAY]

Article Structure:
1. Compelling hook/opening
2. Industry context and challenges
3. KPMG perspective/unique insights
4. Case study or example (if available)
5. Actionable recommendations
6. Forward-looking conclusion

Tone: Authoritative yet accessible. Balance technical depth with readability.`,
        output_format: 'Narrative',
        complexity_level: 'Intermediate',
        best_practices: 'Include data points to support claims. Have subject matter experts review before publication.',
        owner: 'Marketing & Communications',
        tags: ['thought leadership', 'content marketing', 'article', 'brand'],
        ai_tools: ['ChatGPT', 'Claude', 'Google Gemini'],
        version: '1.0.0',
        last_modified: '2026-01-06',
        usage_count: 312,
        rating: 4.7,
        rating_count: 38,
        status: 'approved'
    },
    {
        prompt_id: 'P012',
        title: 'Presentation Narrative Builder',
        category: 'Creative & Marketing',
        prompt_text: `Create a narrative flow for a [TYPE] presentation:

Presentation Context:
- Audience: [WHO]
- Duration: [MINUTES]
- Objective: [WHAT YOU WANT AUDIENCE TO DO/FEEL/KNOW]
- Key Data Points: [LIST]

Generate:
1. Opening hook (30 seconds)
2. Agenda overview
3. Section transitions with storytelling elements
4. Key slide talking points (2-3 bullets each)
5. Memorable closing statement
6. Q&A preparation points

Make it conversational, not scripted.`,
        output_format: 'Structured narrative with bullet points',
        complexity_level: 'Beginner',
        best_practices: 'Practice the narrative out loud. Adjust for natural pauses and emphasis.',
        owner: 'Learning & Development',
        tags: ['presentation', 'storytelling', 'public speaking', 'communication'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot'],
        version: '1.0.0',
        last_modified: '2026-01-04',
        usage_count: 678,
        rating: 4.6,
        rating_count: 82,
        status: 'approved'
    },

    // Technical
    {
        prompt_id: 'P013',
        title: 'Code Documentation Generator',
        category: 'Technical',
        prompt_text: `Generate comprehensive documentation for the following code:

[PASTE CODE HERE]

Documentation should include:
1. Overview/Purpose
   - What the code does
   - When to use it

2. Function/Class Reference
   - Parameters with types and descriptions
   - Return values
   - Exceptions/errors

3. Usage Examples
   - Basic usage
   - Advanced scenarios

4. Dependencies
   - Required libraries
   - Environment requirements

5. Notes
   - Performance considerations
   - Known limitations

Format in Markdown with proper code blocks.`,
        output_format: 'Markdown',
        complexity_level: 'Beginner',
        best_practices: 'Review generated docs for accuracy. Include edge cases the AI might miss.',
        owner: 'Technology Practice',
        tags: ['documentation', 'code', 'developer', 'technical writing'],
        ai_tools: ['ChatGPT', 'Claude', 'Google Gemini'],
        version: '1.0.0',
        last_modified: '2026-01-10',
        usage_count: 523,
        rating: 4.5,
        rating_count: 64,
        status: 'approved'
    },
    {
        prompt_id: 'P014',
        title: 'API Specification Writer',
        category: 'Technical',
        prompt_text: `Create an OpenAPI/Swagger specification for the following API:

API Name: [NAME]
Base URL: [URL]
Authentication: [TYPE]

Endpoints:
[DESCRIBE ENDPOINTS WITH METHODS AND PURPOSES]

Generate a complete OpenAPI 3.0 specification including:
1. Info section with description and version
2. Server configuration
3. Security schemes
4. Path definitions with:
   - Request parameters
   - Request bodies (with examples)
   - Response schemas
   - Error responses
5. Component schemas for reusable objects`,
        output_format: 'JSON',
        complexity_level: 'Expert',
        best_practices: 'Validate generated spec with OpenAPI tools. Include realistic example values.',
        owner: 'Technology Practice',
        tags: ['API', 'OpenAPI', 'Swagger', 'specification', 'REST'],
        ai_tools: ['ChatGPT', 'Claude'],
        version: '1.0.0',
        last_modified: '2026-01-08',
        usage_count: 267,
        rating: 4.4,
        rating_count: 31,
        status: 'approved'
    },
    {
        prompt_id: 'P015',
        title: 'Test Case Generator',
        category: 'Technical',
        prompt_text: `Generate comprehensive test cases for the following feature/function:

Feature Description: [DESCRIBE FEATURE]
Acceptance Criteria: [LIST CRITERIA]
Technology Stack: [LANGUAGES/FRAMEWORKS]

Generate test cases covering:
1. Positive Test Cases
   - Happy path scenarios
   - Valid input combinations

2. Negative Test Cases
   - Invalid inputs
   - Boundary conditions
   - Error handling

3. Edge Cases
   - Empty/null values
   - Maximum limits
   - Concurrent operations

4. Integration Scenarios
   - Dependencies interaction
   - API contract validation

Format each test case with:
- Test ID
- Description
- Preconditions
- Steps
- Expected Result
- Priority (High/Medium/Low)`,
        output_format: 'Table',
        complexity_level: 'Intermediate',
        best_practices: 'Combine AI-generated cases with domain expertise. Prioritize based on risk.',
        owner: 'Quality Assurance Team',
        tags: ['testing', 'QA', 'test cases', 'quality assurance'],
        ai_tools: ['ChatGPT', 'Claude', 'Google Gemini'],
        version: '1.0.0',
        last_modified: '2026-01-12',
        usage_count: 356,
        rating: 4.6,
        rating_count: 42,
        status: 'approved'
    },
    {
        prompt_id: 'P016',
        title: 'Architecture Decision Record',
        category: 'Technical',
        prompt_text: `Create an Architecture Decision Record (ADR) for the following decision:

Decision: [WHAT WAS DECIDED]
Context: [WHY THIS DECISION WAS NEEDED]
Options Considered: [LIST ALTERNATIVES]

ADR Structure:
1. Title (ADR-XXX: Decision Title)
2. Status (Proposed/Accepted/Deprecated/Superseded)
3. Context
   - Business driver
   - Technical constraints
   - Non-functional requirements

4. Decision
   - Chosen approach
   - Rationale

5. Options Considered
   - Option A: Description, Pros, Cons
   - Option B: Description, Pros, Cons
   - (etc.)

6. Consequences
   - Positive outcomes
   - Negative outcomes
   - Risks and mitigations

7. References
   - Related ADRs
   - External resources`,
        output_format: 'Markdown',
        complexity_level: 'Expert',
        best_practices: 'Include stakeholder names who approved. Link to relevant design documents.',
        owner: 'Enterprise Architecture',
        tags: ['architecture', 'ADR', 'decision record', 'technical design'],
        ai_tools: ['ChatGPT', 'Claude'],
        version: '1.0.0',
        last_modified: '2026-01-11',
        usage_count: 189,
        rating: 4.7,
        rating_count: 23,
        status: 'approved'
    }
];

// Pending submissions for review queue demo
export const pendingSubmissions: (PromptEntry & { submitter_name: string; submitter_email: string; submitted_at: string })[] = [
    {
        prompt_id: 'SUB001',
        title: 'Interview Question Generator',
        category: 'Internal Productivity',
        prompt_text: 'Generate behavioral interview questions for a [ROLE] position focusing on [COMPETENCIES]...',
        output_format: 'Bullet points',
        complexity_level: 'Beginner',
        best_practices: 'Customize questions based on role level and team culture.',
        owner: 'Human Resources',
        tags: ['HR', 'interview', 'recruitment', 'hiring'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot'],
        version: '1.0.0',
        last_modified: '2026-01-17',
        usage_count: 0,
        rating: 0,
        rating_count: 0,
        status: 'pending',
        submitter_name: 'Sarah Johnson',
        submitter_email: 'sarah.johnson@kpmg.com',
        submitted_at: '2026-01-17T09:30:00Z'
    },
    {
        prompt_id: 'SUB002',
        title: 'Risk Assessment Matrix',
        category: 'Data & Finance',
        prompt_text: 'Create a risk assessment matrix for [PROJECT/INITIATIVE] evaluating probability and impact...',
        output_format: 'Table',
        complexity_level: 'Intermediate',
        best_practices: 'Include mitigation strategies for high-priority risks.',
        owner: 'Risk Advisory',
        tags: ['risk', 'assessment', 'matrix', 'project management'],
        ai_tools: ['ChatGPT', 'Claude'],
        version: '1.0.0',
        last_modified: '2026-01-16',
        usage_count: 0,
        rating: 0,
        rating_count: 0,
        status: 'pending',
        submitter_name: 'Michael Chen',
        submitter_email: 'michael.chen@kpmg.com',
        submitted_at: '2026-01-16T14:15:00Z'
    },
    {
        prompt_id: 'SUB003',
        title: 'Client Onboarding Checklist',
        category: 'Client Deliverables',
        prompt_text: 'Generate a comprehensive client onboarding checklist for [ENGAGEMENT TYPE]...',
        output_format: 'Bullet points',
        complexity_level: 'Beginner',
        owner: 'Client Services',
        tags: ['onboarding', 'checklist', 'client', 'engagement'],
        ai_tools: ['ChatGPT', 'Microsoft Copilot'],
        version: '1.0.0',
        last_modified: '2026-01-15',
        usage_count: 0,
        rating: 0,
        rating_count: 0,
        status: 'pending',
        submitter_name: 'Emily Rodriguez',
        submitter_email: 'emily.rodriguez@kpmg.com',
        submitted_at: '2026-01-15T11:45:00Z'
    }
];

// Analytics data for dashboard
export const analyticsData: AnalyticsData = {
    total_users: 2847,
    total_prompts: 16,
    total_copies: 12543,
    total_submissions: 47,
    average_rating: 4.56,
    daily_usage: [
        { date: '2026-01-12', copies: 423, views: 1256 },
        { date: '2026-01-13', copies: 512, views: 1478 },
        { date: '2026-01-14', copies: 389, views: 1123 },
        { date: '2026-01-15', copies: 567, views: 1634 },
        { date: '2026-01-16', copies: 634, views: 1892 },
        { date: '2026-01-17', copies: 478, views: 1345 },
        { date: '2026-01-18', copies: 245, views: 723 }
    ],
    top_prompts: [
        { prompt_id: 'P004', title: 'Professional Email Composer', copies: 2156 },
        { prompt_id: 'P005', title: 'Meeting Notes Summarizer', copies: 1893 },
        { prompt_id: 'P006', title: 'Status Report Generator', copies: 1432 },
        { prompt_id: 'P001', title: 'Executive Summary Generator', copies: 1247 },
        { prompt_id: 'P002', title: 'Proposal Outline Builder', copies: 892 },
        { prompt_id: 'P012', title: 'Presentation Narrative Builder', copies: 678 },
        { prompt_id: 'P003', title: 'Market Analysis Report', copies: 654 },
        { prompt_id: 'P007', title: 'Competitive Intelligence Analyzer', copies: 567 },
        { prompt_id: 'P013', title: 'Code Documentation Generator', copies: 523 },
        { prompt_id: 'P009', title: 'Financial Summary Narrator', copies: 445 }
    ],
    category_distribution: [
        { category: 'Internal Productivity', count: 3 },
        { category: 'Client Deliverables', count: 3 },
        { category: 'Research & Analysis', count: 2 },
        { category: 'Data & Finance', count: 2 },
        { category: 'Creative & Marketing', count: 2 },
        { category: 'Technical', count: 4 }
    ]
};
