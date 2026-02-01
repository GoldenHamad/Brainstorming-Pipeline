// Ideas Data Model and Mock Data

export type ScoreLevel = 'low' | 'medium' | 'high';

export type IdeaStatus =
    | 'submitted'      // 1. Ideation - Raw idea captured
    | 'screening'      // 2. Screening - Initial review for viability
    | 'assessment'     // 3. Assessment - Detailed value/feasibility scoring
    | 'prioritized'    // 4. Prioritization - Ranked against other ideas
    | 'development'    // 5. Development - Building MVP/prototype
    | 'pilot'          // 6. Pilot - Testing with limited users
    | 'deployed'       // 7. Deployment - Full production rollout
    | 'scaling'        // 8. Scaling - Optimization and expansion
    | 'on_hold'        // Paused for resources/timing
    | 'rejected'       // Did not pass a gate
    | 'archived';      // Completed or deprecated

// Status display info for UI
export const ideaStatusInfo: Record<IdeaStatus, { label: string; color: string; description: string; order: number }> = {
    submitted: {
        label: 'Submitted',
        color: '#6C757D',
        description: 'Raw idea captured, awaiting initial review',
        order: 1
    },
    screening: {
        label: 'Screening',
        color: '#17A2B8',
        description: 'Initial review for strategic alignment and viability',
        order: 2
    },
    assessment: {
        label: 'Assessment',
        color: '#483698',
        description: 'Detailed value and feasibility scoring in progress',
        order: 3
    },
    prioritized: {
        label: 'Prioritized',
        color: '#00A3A1',
        description: 'Ranked and selected for implementation',
        order: 4
    },
    development: {
        label: 'Development',
        color: '#FFC107',
        description: 'Building MVP or prototype solution',
        order: 5
    },
    pilot: {
        label: 'Pilot',
        color: '#FF6B35',
        description: 'Testing with limited users to validate',
        order: 6
    },
    deployed: {
        label: 'Deployed',
        color: '#28A745',
        description: 'Full production rollout complete',
        order: 7
    },
    scaling: {
        label: 'Scaling',
        color: '#00338D',
        description: 'Optimization and organizational expansion',
        order: 8
    },
    on_hold: {
        label: 'On Hold',
        color: '#ADB5BD',
        description: 'Paused due to resources or timing',
        order: 99
    },
    rejected: {
        label: 'Rejected',
        color: '#DC3545',
        description: 'Did not pass a stage gate',
        order: 100
    },
    archived: {
        label: 'Archived',
        color: '#343A40',
        description: 'Completed lifecycle or deprecated',
        order: 101
    }
};

export type Quadrant = 'likely_wins' | 'calculated_risks' | 'marginal_gains' | 'avoid';

export const aiCapabilityAreas = [
    'Generative AI',
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Robotic Process Automation',
    'Predictive Analytics',
    'Conversational AI',
    'Document Intelligence'
] as const;

export type AICapabilityArea = typeof aiCapabilityAreas[number];

export const businessFunctions = [
    'Audit',
    'Tax',
    'Advisory',
    'Deal Advisory',
    'IT',
    'Operations',
    'Human Resources',
    'Finance',
    'Marketing',
    'Legal',
    'Risk & Compliance'
] as const;

export type BusinessFunction = typeof businessFunctions[number];

// Dimension definitions with tooltips
export const valueDimensions = {
    businessGrowth: {
        label: 'Business Growth',
        weight: 0.20,
        tooltip: 'Potential to support market expansion, new products/services, and customer experience enhancements'
    },
    costEfficiency: {
        label: 'Cost & Operational Efficiency',
        weight: 0.20,
        tooltip: 'Potential to realize cost optimization, process automation, and reduced activity times across business and IT'
    },
    businessResilience: {
        label: 'Business Resilience',
        weight: 0.30,
        tooltip: 'Potential to enable organizational and IT resilience, cyber security, and regulatory compliance'
    },
    businessAgility: {
        label: 'Business Agility',
        weight: 0.30,
        tooltip: 'Potential to adapt, transform, and execute at pace in response to changes in strategy and opportunities'
    }
};

export const feasibilityDimensions = {
    technicalFeasibility: {
        label: 'Technical Feasibility',
        weight: 0.50,
        tooltip: 'Maturity and availability of AI capabilities, infrastructure, and integration technologies'
    },
    internalReadiness: {
        label: 'Internal Readiness',
        weight: 0.30,
        tooltip: 'Organizational AI literacy, data readiness, and willingness to adopt AI-driven solutions'
    },
    externalReadiness: {
        label: 'External Readiness',
        weight: 0.20,
        tooltip: 'Alignment with legal, regulatory requirements, and market/vendor ecosystem maturity'
    }
};

export interface IdeaSubmission {
    id: string;
    title: string;
    description: string;
    aiCapabilityArea: AICapabilityArea;
    businessFunction: BusinessFunction;
    expectedBenefits: string;
    submitterName: string;
    submitterEmail: string;
    createdAt: string;
    status: IdeaStatus;
}

export interface IdeaAssessment {
    ideaId: string;
    // Value dimensions
    businessGrowth: ScoreLevel;
    costEfficiency: ScoreLevel;
    businessResilience: ScoreLevel;
    businessAgility: ScoreLevel;
    // Feasibility dimensions
    technicalFeasibility: ScoreLevel;
    internalReadiness: ScoreLevel;
    externalReadiness: ScoreLevel;
    // Rationales
    rationales: {
        businessGrowth?: string;
        costEfficiency?: string;
        businessResilience?: string;
        businessAgility?: string;
        technicalFeasibility?: string;
        internalReadiness?: string;
        externalReadiness?: string;
    };
    // Computed scores
    valueScore: number;
    feasibilityScore: number;
    quadrant: Quadrant;
    // Meta
    assessedBy: string;
    assessedAt: string;
}

export interface Idea extends IdeaSubmission {
    assessment?: IdeaAssessment;
}

// Quadrant info
export const quadrantInfo: Record<Quadrant, { label: string; color: string; description: string }> = {
    likely_wins: {
        label: 'Likely Wins',
        color: '#28A745',
        description: 'High value with high feasibility - prioritize these'
    },
    calculated_risks: {
        label: 'Calculated Risks',
        color: '#FFC107',
        description: 'High value but low feasibility - strategic bets'
    },
    marginal_gains: {
        label: 'Marginal Gains',
        color: '#6C757D',
        description: 'Low value with variable feasibility - selective pursuit'
    },
    avoid: {
        label: 'Avoid',
        color: '#DC3545',
        description: 'Low value and low feasibility - deprioritize'
    }
};

// Mock Ideas Data
export const mockIdeas: Idea[] = [
    {
        id: 'IDEA-001',
        title: 'Automated Audit Evidence Analysis',
        description: 'Use AI to automatically analyze and categorize audit evidence documents, extracting key financial data and flagging anomalies for auditor review.',
        aiCapabilityArea: 'Document Intelligence',
        businessFunction: 'Audit',
        expectedBenefits: 'Reduce manual document review time by 60%, improve consistency in evidence analysis, and enable auditors to focus on higher-value judgment tasks.',
        submitterName: 'Sarah Chen',
        submitterEmail: 'sarah.chen@kpmg.com',
        createdAt: '2026-01-15T09:00:00Z',
        status: 'prioritized',
        assessment: {
            ideaId: 'IDEA-001',
            businessGrowth: 'medium',
            costEfficiency: 'high',
            businessResilience: 'high',
            businessAgility: 'high',
            technicalFeasibility: 'high',
            internalReadiness: 'high',
            externalReadiness: 'medium',
            rationales: {
                costEfficiency: 'Significant time savings in document review process',
                technicalFeasibility: 'Document AI technologies are mature and proven'
            },
            valueScore: 2.6,
            feasibilityScore: 2.6,
            quadrant: 'likely_wins',
            assessedBy: 'Assessment Team',
            assessedAt: '2026-01-17T14:00:00Z'
        }
    },
    {
        id: 'IDEA-002',
        title: 'Tax Regulation Change Detector',
        description: 'Implement an AI system that monitors global tax regulation changes, automatically summarizes updates, and alerts relevant teams about impacts to client portfolios.',
        aiCapabilityArea: 'Natural Language Processing',
        businessFunction: 'Tax',
        expectedBenefits: 'Stay ahead of regulatory changes, reduce compliance risk, and provide proactive client advisory services.',
        submitterName: 'Michael Roberts',
        submitterEmail: 'michael.roberts@kpmg.com',
        createdAt: '2026-01-14T11:30:00Z',
        status: 'prioritized',
        assessment: {
            ideaId: 'IDEA-002',
            businessGrowth: 'high',
            costEfficiency: 'medium',
            businessResilience: 'high',
            businessAgility: 'high',
            technicalFeasibility: 'medium',
            internalReadiness: 'medium',
            externalReadiness: 'high',
            rationales: {
                businessGrowth: 'Can differentiate our tax advisory services',
                technicalFeasibility: 'Requires integration with multiple regulatory data sources'
            },
            valueScore: 2.7,
            feasibilityScore: 2.2,
            quadrant: 'likely_wins',
            assessedBy: 'Assessment Team',
            assessedAt: '2026-01-16T10:00:00Z'
        }
    },
    {
        id: 'IDEA-003',
        title: 'AI-Powered Deal Valuation Assistant',
        description: 'Build a generative AI assistant that helps deal advisory teams quickly generate preliminary valuations by analyzing comparable transactions and market data.',
        aiCapabilityArea: 'Generative AI',
        businessFunction: 'Deal Advisory',
        expectedBenefits: 'Accelerate deal analysis by 40%, improve valuation consistency, and enable faster client turnaround.',
        submitterName: 'Jennifer Park',
        submitterEmail: 'jennifer.park@kpmg.com',
        createdAt: '2026-01-13T08:45:00Z',
        status: 'prioritized',
        assessment: {
            ideaId: 'IDEA-003',
            businessGrowth: 'high',
            costEfficiency: 'high',
            businessResilience: 'medium',
            businessAgility: 'high',
            technicalFeasibility: 'medium',
            internalReadiness: 'low',
            externalReadiness: 'medium',
            rationales: {
                businessGrowth: 'High revenue potential in deal advisory',
                internalReadiness: 'Team needs training on AI-assisted valuation workflows'
            },
            valueScore: 2.6,
            feasibilityScore: 1.8,
            quadrant: 'calculated_risks',
            assessedBy: 'Assessment Team',
            assessedAt: '2026-01-15T16:30:00Z'
        }
    },
    {
        id: 'IDEA-004',
        title: 'Employee Onboarding Chatbot',
        description: 'Deploy a conversational AI chatbot to answer new employee questions about policies, benefits, and IT setup during onboarding.',
        aiCapabilityArea: 'Conversational AI',
        businessFunction: 'Human Resources',
        expectedBenefits: 'Reduce HR support tickets by 50%, provide 24/7 onboarding support, and improve new hire experience.',
        submitterName: 'David Thompson',
        submitterEmail: 'david.thompson@kpmg.com',
        createdAt: '2026-01-12T14:20:00Z',
        status: 'prioritized',
        assessment: {
            ideaId: 'IDEA-004',
            businessGrowth: 'low',
            costEfficiency: 'high',
            businessResilience: 'medium',
            businessAgility: 'medium',
            technicalFeasibility: 'high',
            internalReadiness: 'high',
            externalReadiness: 'high',
            rationales: {
                businessGrowth: 'Internal tool with limited revenue impact',
                technicalFeasibility: 'Chatbot technology is well-established'
            },
            valueScore: 2.0,
            feasibilityScore: 2.8,
            quadrant: 'marginal_gains',
            assessedBy: 'Assessment Team',
            assessedAt: '2026-01-14T09:15:00Z'
        }
    },
    {
        id: 'IDEA-005',
        title: 'Predictive Client Churn Analysis',
        description: 'Use machine learning to analyze client engagement patterns and predict which clients are at risk of churning, enabling proactive relationship management.',
        aiCapabilityArea: 'Predictive Analytics',
        businessFunction: 'Advisory',
        expectedBenefits: 'Improve client retention by 15%, enable data-driven relationship management, and identify upsell opportunities.',
        submitterName: 'Lisa Wang',
        submitterEmail: 'lisa.wang@kpmg.com',
        createdAt: '2026-01-11T10:00:00Z',
        status: 'prioritized',
        assessment: {
            ideaId: 'IDEA-005',
            businessGrowth: 'high',
            costEfficiency: 'medium',
            businessResilience: 'high',
            businessAgility: 'medium',
            technicalFeasibility: 'medium',
            internalReadiness: 'medium',
            externalReadiness: 'low',
            rationales: {
                externalReadiness: 'Data privacy considerations with client behavioral data'
            },
            valueScore: 2.5,
            feasibilityScore: 1.8,
            quadrant: 'calculated_risks',
            assessedBy: 'Assessment Team',
            assessedAt: '2026-01-13T11:45:00Z'
        }
    },
    {
        id: 'IDEA-006',
        title: 'Intelligent Contract Review',
        description: 'Implement AI to review and analyze legal contracts, identifying key terms, obligations, and potential risks.',
        aiCapabilityArea: 'Document Intelligence',
        businessFunction: 'Legal',
        expectedBenefits: 'Speed up contract review by 70%, reduce legal risk, and standardize contract analysis across the firm.',
        submitterName: 'Robert Kim',
        submitterEmail: 'robert.kim@kpmg.com',
        createdAt: '2026-01-18T09:30:00Z',
        status: 'submitted'
    },
    {
        id: 'IDEA-007',
        title: 'Meeting Notes Automation',
        description: 'Use AI to automatically transcribe meetings, generate structured summaries, and extract action items.',
        aiCapabilityArea: 'Generative AI',
        businessFunction: 'Operations',
        expectedBenefits: 'Save 5+ hours per week in meeting follow-up, ensure consistent documentation, and improve accountability.',
        submitterName: 'Amanda Foster',
        submitterEmail: 'amanda.foster@kpmg.com',
        createdAt: '2026-01-19T15:00:00Z',
        status: 'screening'
    },
    {
        id: 'IDEA-008',
        title: 'Financial Fraud Detection System',
        description: 'Deploy machine learning models to detect anomalous financial transactions and potential fraud indicators in client data.',
        aiCapabilityArea: 'Machine Learning',
        businessFunction: 'Risk & Compliance',
        expectedBenefits: 'Improve fraud detection rate by 30%, reduce false positives, and enhance client risk management services.',
        submitterName: 'James Wilson',
        submitterEmail: 'james.wilson@kpmg.com',
        createdAt: '2026-01-20T11:15:00Z',
        status: 'submitted'
    }
];

// Analytics data
export interface IdeasAnalytics {
    totalIdeas: number;
    byStatus: Record<IdeaStatus, number>;
    byQuadrant: Record<Quadrant, number>;
    byBusinessFunction: { function: BusinessFunction; count: number }[];
    byCapabilityArea: { area: AICapabilityArea; count: number }[];
    assessedIdeas: Idea[];
}
