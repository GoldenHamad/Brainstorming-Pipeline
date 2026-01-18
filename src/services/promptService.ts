// Prompt Service - Mock data operations
import {
    PromptEntry,
    Category,
    ComplexityLevel,
    AITool,
    samplePrompts,
    pendingSubmissions,
    analyticsData,
    AnalyticsData
} from '../data/prompts';

export interface SearchFilters {
    query?: string;
    categories?: Category[];
    complexityLevels?: ComplexityLevel[];
    aiTools?: AITool[];
    minRating?: number;
}

// Simulated delay for realistic async behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state for demo
let prompts = [...samplePrompts];
let submissions = [...pendingSubmissions];

export const promptService = {
    // Search and filter prompts
    async searchPrompts(filters: SearchFilters): Promise<PromptEntry[]> {
        await delay(100); // Simulate network delay

        let results = prompts.filter(p => p.status === 'approved');

        if (filters.query) {
            const query = filters.query.toLowerCase();
            results = results.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.prompt_text.toLowerCase().includes(query) ||
                p.tags.some(t => t.toLowerCase().includes(query)) ||
                p.category.toLowerCase().includes(query)
            );
        }

        if (filters.categories?.length) {
            results = results.filter(p => filters.categories!.includes(p.category));
        }

        if (filters.complexityLevels?.length) {
            results = results.filter(p => filters.complexityLevels!.includes(p.complexity_level));
        }

        if (filters.aiTools?.length) {
            results = results.filter(p =>
                p.ai_tools.some(tool => filters.aiTools!.includes(tool))
            );
        }

        if (filters.minRating) {
            results = results.filter(p => p.rating >= filters.minRating!);
        }

        return results;
    },

    // Get prompt by ID
    async getPromptById(id: string): Promise<PromptEntry | null> {
        await delay(50);
        return prompts.find(p => p.prompt_id === id) || null;
    },

    // Get prompts by category
    async getPromptsByCategory(category: Category): Promise<PromptEntry[]> {
        await delay(100);
        return prompts.filter(p => p.category === category && p.status === 'approved');
    },

    // Get all categories with counts
    async getCategoriesWithCounts(): Promise<{ category: Category; count: number }[]> {
        await delay(50);
        const categoryMap = new Map<Category, number>();

        prompts
            .filter(p => p.status === 'approved')
            .forEach(p => {
                categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
            });

        return Array.from(categoryMap.entries())
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);
    },

    // Get featured/trending prompts
    async getFeaturedPrompts(limit: number = 6): Promise<PromptEntry[]> {
        await delay(100);
        return prompts
            .filter(p => p.status === 'approved')
            .sort((a, b) => b.usage_count - a.usage_count)
            .slice(0, limit);
    },

    // Get top rated prompts
    async getTopRatedPrompts(limit: number = 6): Promise<PromptEntry[]> {
        await delay(100);
        return prompts
            .filter(p => p.status === 'approved' && p.rating_count >= 10)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    },

    // Record prompt copy (usage tracking)
    async recordCopy(promptId: string): Promise<void> {
        await delay(50);
        const prompt = prompts.find(p => p.prompt_id === promptId);
        if (prompt) {
            prompt.usage_count++;
        }
    },

    // Submit rating
    async submitRating(promptId: string, rating: number, _feedback?: string): Promise<void> {
        await delay(100);
        const prompt = prompts.find(p => p.prompt_id === promptId);
        if (prompt) {
            const totalRating = prompt.rating * prompt.rating_count + rating;
            prompt.rating_count++;
            prompt.rating = Number((totalRating / prompt.rating_count).toFixed(1));
        }
    },

    // Submit new prompt
    async submitPrompt(submission: Omit<PromptEntry, 'prompt_id' | 'usage_count' | 'rating' | 'rating_count' | 'status' | 'version' | 'last_modified'> & {
        submitter_name: string;
        submitter_email: string;
    }): Promise<string> {
        await delay(200);
        const newId = `SUB${String(submissions.length + 1).padStart(3, '0')}`;
        const newSubmission = {
            ...submission,
            prompt_id: newId,
            usage_count: 0,
            rating: 0,
            rating_count: 0,
            status: 'pending' as const,
            version: '1.0.0',
            last_modified: new Date().toISOString().split('T')[0],
            submitted_at: new Date().toISOString()
        };
        submissions.push(newSubmission);
        return newId;
    },

    // Get pending submissions (for review queue)
    async getPendingSubmissions(): Promise<typeof submissions> {
        await delay(100);
        return submissions.filter(s => s.status === 'pending');
    },

    // Approve submission
    async approveSubmission(submissionId: string): Promise<void> {
        await delay(150);
        const submission = submissions.find(s => s.prompt_id === submissionId);
        if (submission) {
            submission.status = 'approved';
            // Add to main prompts list
            const { submitter_name, submitter_email, submitted_at, ...promptData } = submission;
            prompts.push(promptData);
        }
    },

    // Reject submission
    async rejectSubmission(submissionId: string, _feedback: string): Promise<void> {
        await delay(150);
        const submission = submissions.find(s => s.prompt_id === submissionId);
        if (submission) {
            submission.status = 'rejected';
        }
    },

    // Get analytics data
    async getAnalytics(): Promise<AnalyticsData> {
        await delay(100);
        return {
            ...analyticsData,
            total_prompts: prompts.filter(p => p.status === 'approved').length,
            total_submissions: submissions.length
        };
    },

    // Get search suggestions (for autocomplete)
    async getSearchSuggestions(query: string): Promise<string[]> {
        await delay(30);
        if (!query || query.length < 2) return [];

        const lowerQuery = query.toLowerCase();
        const suggestions = new Set<string>();

        prompts
            .filter(p => p.status === 'approved')
            .forEach(p => {
                if (p.title.toLowerCase().includes(lowerQuery)) {
                    suggestions.add(p.title);
                }
                p.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(lowerQuery)) {
                        suggestions.add(tag);
                    }
                });
            });

        return Array.from(suggestions).slice(0, 8);
    }
};
