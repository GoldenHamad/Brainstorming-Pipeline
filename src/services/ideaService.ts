// Ideas Service - CRUD operations and scoring logic

import {
    Idea,
    IdeaSubmission,
    IdeaAssessment,
    mockIdeas,
    ScoreLevel,
    Quadrant,
    valueDimensions,
    feasibilityDimensions,
    IdeasAnalytics,
    IdeaStatus
} from '../data/ideas';

// Score values for calculation
const scoreValues: Record<ScoreLevel, number> = {
    low: 1,
    medium: 2,
    high: 3
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate value score (weighted)
export function calculateValueScore(assessment: Partial<IdeaAssessment>): number {
    const { businessGrowth, costEfficiency, businessResilience, businessAgility } = assessment;
    if (!businessGrowth || !costEfficiency || !businessResilience || !businessAgility) return 0;

    return (
        scoreValues[businessGrowth] * valueDimensions.businessGrowth.weight +
        scoreValues[costEfficiency] * valueDimensions.costEfficiency.weight +
        scoreValues[businessResilience] * valueDimensions.businessResilience.weight +
        scoreValues[businessAgility] * valueDimensions.businessAgility.weight
    );
}

// Calculate feasibility score (weighted)
export function calculateFeasibilityScore(assessment: Partial<IdeaAssessment>): number {
    const { technicalFeasibility, internalReadiness, externalReadiness } = assessment;
    if (!technicalFeasibility || !internalReadiness || !externalReadiness) return 0;

    return (
        scoreValues[technicalFeasibility] * feasibilityDimensions.technicalFeasibility.weight +
        scoreValues[internalReadiness] * feasibilityDimensions.internalReadiness.weight +
        scoreValues[externalReadiness] * feasibilityDimensions.externalReadiness.weight
    );
}

// Determine quadrant based on scores
export function determineQuadrant(valueScore: number, feasibilityScore: number): Quadrant {
    const valueThreshold = 2.0; // Above 2 = High
    const feasibilityThreshold = 2.0;

    const highValue = valueScore >= valueThreshold;
    const highFeasibility = feasibilityScore >= feasibilityThreshold;

    if (highValue && highFeasibility) return 'likely_wins';
    if (highValue && !highFeasibility) return 'calculated_risks';
    if (!highValue && highFeasibility) return 'marginal_gains';
    return 'avoid';
}

// Ideas Store (in-memory for MVP)
let ideas: Idea[] = [...mockIdeas];

export const ideaService = {
    // Get all ideas
    async getAllIdeas(): Promise<Idea[]> {
        await delay(200);
        return ideas;
    },

    // Get idea by ID
    async getIdeaById(id: string): Promise<Idea | null> {
        await delay(150);
        return ideas.find(i => i.id === id) || null;
    },

    // Get ideas by status
    async getIdeasByStatus(status: IdeaStatus): Promise<Idea[]> {
        await delay(200);
        return ideas.filter(i => i.status === status);
    },

    // Get assessed ideas (for priority matrix)
    async getAssessedIdeas(): Promise<Idea[]> {
        await delay(200);
        return ideas.filter(i => i.assessment !== undefined);
    },

    // Submit a new idea
    async submitIdea(submission: Omit<IdeaSubmission, 'id' | 'createdAt' | 'status'>): Promise<Idea> {
        await delay(300);
        const newIdea: Idea = {
            ...submission,
            id: `IDEA-${String(ideas.length + 1).padStart(3, '0')}`,
            createdAt: new Date().toISOString(),
            status: 'submitted'
        };
        ideas = [...ideas, newIdea];
        return newIdea;
    },

    // Submit an assessment for an idea
    async submitAssessment(
        ideaId: string,
        assessmentData: Omit<IdeaAssessment, 'ideaId' | 'valueScore' | 'feasibilityScore' | 'quadrant' | 'assessedAt'>
    ): Promise<Idea> {
        await delay(300);

        const valueScore = calculateValueScore(assessmentData);
        const feasibilityScore = calculateFeasibilityScore(assessmentData);
        const quadrant = determineQuadrant(valueScore, feasibilityScore);

        const assessment: IdeaAssessment = {
            ...assessmentData,
            ideaId,
            valueScore,
            feasibilityScore,
            quadrant,
            assessedAt: new Date().toISOString()
        };

        ideas = ideas.map(idea => {
            if (idea.id === ideaId) {
                return {
                    ...idea,
                    status: 'assessed' as IdeaStatus,
                    assessment
                };
            }
            return idea;
        });

        return ideas.find(i => i.id === ideaId)!;
    },

    // Update idea status
    async updateIdeaStatus(id: string, status: IdeaStatus): Promise<Idea | null> {
        await delay(200);
        ideas = ideas.map(idea => {
            if (idea.id === id) {
                return { ...idea, status };
            }
            return idea;
        });
        return ideas.find(i => i.id === id) || null;
    },

    // Get analytics data
    async getAnalytics(): Promise<IdeasAnalytics> {
        await delay(250);

        const assessedIdeas = ideas.filter(i => i.assessment);

        const byStatus: Record<IdeaStatus, number> = {
            submitted: 0,
            under_review: 0,
            assessed: 0,
            prioritized: 0,
            archived: 0
        };

        const byQuadrant: Record<Quadrant, number> = {
            likely_wins: 0,
            calculated_risks: 0,
            marginal_gains: 0,
            avoid: 0
        };

        const functionCounts: Record<string, number> = {};
        const areaCounts: Record<string, number> = {};

        ideas.forEach(idea => {
            byStatus[idea.status]++;

            if (idea.assessment) {
                byQuadrant[idea.assessment.quadrant]++;
            }

            functionCounts[idea.businessFunction] = (functionCounts[idea.businessFunction] || 0) + 1;
            areaCounts[idea.aiCapabilityArea] = (areaCounts[idea.aiCapabilityArea] || 0) + 1;
        });

        return {
            totalIdeas: ideas.length,
            byStatus,
            byQuadrant,
            byBusinessFunction: Object.entries(functionCounts).map(([fn, count]) => ({
                function: fn as any,
                count
            })),
            byCapabilityArea: Object.entries(areaCounts).map(([area, count]) => ({
                area: area as any,
                count
            })),
            assessedIdeas
        };
    },

    // Search ideas
    async searchIdeas(query: string): Promise<Idea[]> {
        await delay(200);
        const lowerQuery = query.toLowerCase();
        return ideas.filter(idea =>
            idea.title.toLowerCase().includes(lowerQuery) ||
            idea.description.toLowerCase().includes(lowerQuery) ||
            idea.businessFunction.toLowerCase().includes(lowerQuery) ||
            idea.aiCapabilityArea.toLowerCase().includes(lowerQuery)
        );
    }
};
