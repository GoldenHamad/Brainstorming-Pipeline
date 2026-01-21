import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List, Filter } from 'lucide-react';
import { ideaService } from '../services/ideaService';
import { Idea, IdeaStatus, Quadrant, quadrantInfo } from '../data/ideas';
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
    const pendingIdeas = ideas.filter(i => i.status === 'submitted' || i.status === 'under_review');

    return (
        <div className="ideas-dashboard">
            <div className="container">
                <header className="ideas-header">
                    <div className="ideas-header-content">
                        <h1>AI Use Case Ideas</h1>
                        <p>Capture, assess, and prioritize AI use cases for KPMG.</p>
                    </div>
                    <Link to="/ideas/submit" className="btn btn-primary">
                        <Plus size={18} />
                        Submit Idea
                    </Link>
                </header>

                {/* Stats */}
                <div className="ideas-stats">
                    <div className="stat-card">
                        <span className="stat-value">{ideas.length}</span>
                        <span className="stat-label">Total Ideas</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{pendingIdeas.length}</span>
                        <span className="stat-label">Pending Assessment</span>
                    </div>
                    <div className="stat-card stat-likely-wins">
                        <span className="stat-value">
                            {assessedIdeas.filter(i => i.assessment?.quadrant === 'likely_wins').length}
                        </span>
                        <span className="stat-label">Likely Wins</span>
                    </div>
                    <div className="stat-card stat-risks">
                        <span className="stat-value">
                            {assessedIdeas.filter(i => i.assessment?.quadrant === 'calculated_risks').length}
                        </span>
                        <span className="stat-label">Calculated Risks</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="ideas-controls">
                    <div className="view-toggle">
                        <button
                            className={viewMode === 'matrix' ? 'active' : ''}
                            onClick={() => setViewMode('matrix')}
                        >
                            <LayoutGrid size={18} />
                            Matrix
                        </button>
                        <button
                            className={viewMode === 'list' ? 'active' : ''}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                            List
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
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="assessed">Assessed</option>
                            <option value="prioritized">Prioritized</option>
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

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading ideas...</p>
                    </div>
                ) : viewMode === 'matrix' ? (
                    <div className="matrix-view">
                        <PriorityMatrix ideas={filteredIdeas} />
                        <div className="assessed-ideas-list">
                            <h3>Assessed Ideas ({assessedIdeas.length})</h3>
                            <div className="ideas-grid">
                                {assessedIdeas.map(idea => (
                                    <IdeaCard key={idea.id} idea={idea} variant="compact" />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="list-view">
                        <div className="ideas-grid">
                            {filteredIdeas.map(idea => (
                                <IdeaCard key={idea.id} idea={idea} />
                            ))}
                        </div>
                        {filteredIdeas.length === 0 && (
                            <div className="empty-state">
                                <p>No ideas match your filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
