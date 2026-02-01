import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Cpu, Briefcase, Calendar, Target } from 'lucide-react';
import { ideaService } from '../services/ideaService';
import { Idea, valueDimensions, feasibilityDimensions, ideaStatusInfo } from '../data/ideas';
import { QuadrantBadge } from '../components/QuadrantBadge';
import { PriorityMatrix } from '../components/PriorityMatrix';
import './IdeaDetailPage.css';



const scoreLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
};

export function IdeaDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [idea, setIdea] = useState<Idea | null>(null);
    const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            const [ideaData, ideas] = await Promise.all([
                ideaService.getIdeaById(id),
                ideaService.getAssessedIdeas()
            ]);
            setIdea(ideaData);
            setAllIdeas(ideas);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="idea-detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading idea...</p>
            </div>
        );
    }

    if (!idea) {
        return (
            <div className="idea-not-found">
                <h2>Idea not found</h2>
                <p>The idea you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const statusInfo = ideaStatusInfo[idea.status];

    return (
        <div className="idea-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Dashboard</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{idea.title}</span>
                </nav>

                <div className="idea-detail-layout">
                    {/* Main Content */}
                    <main className="idea-detail-main">
                        <header className="idea-detail-header">
                            <div className="header-badges">
                                <span
                                    className="status-badge"
                                    style={{ backgroundColor: `${statusInfo.color}15`, color: statusInfo.color }}
                                >
                                    {statusInfo.label}
                                </span>
                                {idea.assessment && (
                                    <QuadrantBadge quadrant={idea.assessment.quadrant} size="md" />
                                )}
                            </div>
                            <h1>{idea.title}</h1>
                            <div className="idea-meta-row">
                                <span><Cpu size={16} /> {idea.aiCapabilityArea}</span>
                                <span><Briefcase size={16} /> {idea.businessFunction}</span>
                                <span><User size={16} /> {idea.submitterName}</span>
                                <span>
                                    <Calendar size={16} />
                                    {new Date(idea.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </header>

                        <section className="idea-section card">
                            <h2>Description</h2>
                            <p>{idea.description}</p>
                        </section>

                        {idea.expectedBenefits && (
                            <section className="idea-section card">
                                <h2><Target size={20} /> Expected Benefits</h2>
                                <p>{idea.expectedBenefits}</p>
                            </section>
                        )}

                        {idea.assessment && (
                            <>
                                <section className="scorecard-section card">
                                    <h2>Assessment Scorecard</h2>

                                    <div className="scores-summary">
                                        <div className="score-box value-score">
                                            <span className="score-label">Business Value</span>
                                            <span className="score-number">{idea.assessment.valueScore.toFixed(2)}</span>
                                            <span className="score-max">/ 3.0</span>
                                        </div>
                                        <div className="score-box feasibility-score">
                                            <span className="score-label">Feasibility</span>
                                            <span className="score-number">{idea.assessment.feasibilityScore.toFixed(2)}</span>
                                            <span className="score-max">/ 3.0</span>
                                        </div>
                                    </div>

                                    <div className="dimension-grid">
                                        <div className="dimension-group">
                                            <h3>Business Value Dimensions</h3>
                                            {Object.entries(valueDimensions).map(([key, dim]) => {
                                                const score = idea.assessment![key as keyof typeof idea.assessment] as string;
                                                return (
                                                    <div key={key} className="dimension-item">
                                                        <div className="dimension-info">
                                                            <span className="dim-label">{dim.label}</span>
                                                            <span className="dim-weight">{Math.round(dim.weight * 100)}%</span>
                                                        </div>
                                                        <span className={`dim-score score-${score}`}>
                                                            {scoreLabels[score] || '-'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="dimension-group">
                                            <h3>Feasibility Dimensions</h3>
                                            {Object.entries(feasibilityDimensions).map(([key, dim]) => {
                                                const score = idea.assessment![key as keyof typeof idea.assessment] as string;
                                                return (
                                                    <div key={key} className="dimension-item">
                                                        <div className="dimension-info">
                                                            <span className="dim-label">{dim.label}</span>
                                                            <span className="dim-weight">{Math.round(dim.weight * 100)}%</span>
                                                        </div>
                                                        <span className={`dim-score score-${score}`}>
                                                            {scoreLabels[score] || '-'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="assessed-info">
                                        <Clock size={14} />
                                        Assessed by {idea.assessment.assessedBy} on {' '}
                                        {new Date(idea.assessment.assessedAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </div>
                                </section>

                                <section className="matrix-section card">
                                    <h2>Position on Priority Matrix</h2>
                                    <PriorityMatrix ideas={allIdeas} selectedId={idea.id} />
                                </section>
                            </>
                        )}

                        {!idea.assessment && (
                            <section className="pending-assessment card">
                                <Clock size={32} />
                                <h3>Pending Assessment</h3>
                                <p>This idea is awaiting review by the assessment team.</p>
                                <Link to="/pipeline" className="btn btn-primary">
                                    Go to Pipeline
                                </Link>
                            </section>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="idea-detail-sidebar">
                        <Link to="/" className="btn btn-secondary btn-block">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
