import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List, Filter, Lightbulb, GitBranch, BarChart3, TrendingUp, Rocket, Clock, Target } from 'lucide-react';
import { ideaService } from '../services/ideaService';
import { Idea, IdeaStatus, Quadrant, quadrantInfo, ideaStatusInfo } from '../data/ideas';
import { PriorityMatrix } from '../components/PriorityMatrix';
import { IdeaCard } from '../components/IdeaCard';
import './IdeasDashboard.css';

type ViewMode = 'matrix' | 'list';

export function IdeasDashboard() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('matrix');
    const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'all'>('all');
    const [quadrantFilter, setQuadrantFilter] = useState<Quadrant | 'all'>('all');

    useEffect(() => {
        const fetchIdeas = async () => {
            setLoading(true);
            const allIdeas = await ideaService.getAllIdeas();
            setIdeas(allIdeas);
            setLoading(false);
        };
        fetchIdeas();
    }, []);

    const filteredIdeas = ideas.filter(idea => {
        if (statusFilter !== 'all' && idea.status !== statusFilter) return false;
        if (quadrantFilter !== 'all' && idea.assessment?.quadrant !== quadrantFilter) return false;
        return true;
    });

    const assessedIdeas = ideas.filter(i => i.assessment);
    const pendingIdeas = ideas.filter(i => i.status === 'submitted' || i.status === 'screening');
    const deployedIdeas = ideas.filter(i => i.status === 'deployed' || i.status === 'scaling');
    const likelyWins = assessedIdeas.filter(i => i.assessment?.quadrant === 'likely_wins');

    return (
        <div className="ideas-dashboard">
            {/* Hero Section */}
            <section className="dashboard-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1>
                                <Lightbulb size={36} />
                                Advisory AI Ideas
                            </h1>
                            <p>Capture, evaluate, and prioritize AI use cases to drive innovation across the organization.</p>
                        </div>
                        <div className="hero-actions">
                            <Link to="/submit" className="btn btn-primary btn-lg">
                                <Plus size={20} />
                                Submit New Idea
                            </Link>
                            <Link to="/pipeline" className="btn btn-secondary btn-lg">
                                <GitBranch size={20} />
                                View Pipeline
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">
                {/* Quick Stats */}
                <section className="quick-stats">
                    <div className="stat-card stat-total">
                        <div className="stat-icon">
                            <Lightbulb size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{ideas.length}</span>
                            <span className="stat-label">Total Ideas</span>
                        </div>
                    </div>
                    <div className="stat-card stat-pending">
                        <div className="stat-icon">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{pendingIdeas.length}</span>
                            <span className="stat-label">Pending Review</span>
                        </div>
                    </div>
                    <div className="stat-card stat-wins">
                        <div className="stat-icon">
                            <Target size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{likelyWins.length}</span>
                            <span className="stat-label">Likely Wins</span>
                        </div>
                    </div>
                    <div className="stat-card stat-deployed">
                        <div className="stat-icon">
                            <Rocket size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{deployedIdeas.length}</span>
                            <span className="stat-label">Deployed</span>
                        </div>
                    </div>
                    <Link to="/analytics" className="stat-card stat-analytics">
                        <div className="stat-icon">
                            <BarChart3 size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">
                                <TrendingUp size={20} />
                            </span>
                            <span className="stat-label">View Analytics</span>
                        </div>
                    </Link>
                </section>

                {/* Priority Matrix Section */}
                <section className="matrix-section">
                    <div className="section-header">
                        <h2>Priority Matrix</h2>
                        <p>Ideas positioned by Value vs. Feasibility assessment</p>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading ideas...</p>
                        </div>
                    ) : (
                        <div className="matrix-wrapper">
                            <PriorityMatrix ideas={assessedIdeas} />
                        </div>
                    )}

                    {/* Quadrant Summary */}
                    <div className="quadrant-summary">
                        {(Object.entries(quadrantInfo) as [Quadrant, typeof quadrantInfo[Quadrant]][]).map(([key, info]) => (
                            <div
                                key={key}
                                className="quadrant-card"
                                style={{ borderLeftColor: info.color }}
                            >
                                <span className="quadrant-count" style={{ color: info.color }}>
                                    {assessedIdeas.filter(i => i.assessment?.quadrant === key).length}
                                </span>
                                <span className="quadrant-name">{info.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ideas List Section */}
                <section className="ideas-list-section">
                    <div className="section-header">
                        <h2>All Ideas</h2>

                        {/* Controls */}
                        <div className="ideas-controls">
                            <div className="view-toggle">
                                <button
                                    className={viewMode === 'matrix' ? 'active' : ''}
                                    onClick={() => setViewMode('matrix')}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <div className="filters">
                                <Filter size={16} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as IdeaStatus | 'all')}
                                    className="filter-select"
                                >
                                    <option value="all">All Statuses</option>
                                    {Object.entries(ideaStatusInfo)
                                        .filter(([_, info]) => info.order <= 8)
                                        .sort((a, b) => a[1].order - b[1].order)
                                        .map(([key, info]) => (
                                            <option key={key} value={key}>{info.label}</option>
                                        ))
                                    }
                                </select>
                                <select
                                    value={quadrantFilter}
                                    onChange={(e) => setQuadrantFilter(e.target.value as Quadrant | 'all')}
                                    className="filter-select"
                                >
                                    <option value="all">All Quadrants</option>
                                    {Object.entries(quadrantInfo).map(([key, info]) => (
                                        <option key={key} value={key}>{info.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading ideas...</p>
                        </div>
                    ) : (
                        <div className={`ideas-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                            {filteredIdeas.map(idea => (
                                <IdeaCard key={idea.id} idea={idea} variant={viewMode === 'list' ? 'compact' : 'default'} />
                            ))}
                        </div>
                    )}

                    {!loading && filteredIdeas.length === 0 && (
                        <div className="empty-state">
                            <Lightbulb size={48} />
                            <h3>No ideas found</h3>
                            <p>No ideas match your current filters. Try adjusting the filters or submit a new idea.</p>
                            <Link to="/submit" className="btn btn-primary">
                                <Plus size={18} />
                                Submit Idea
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
