import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, ArrowRight, User, Calendar, Cpu, CheckCircle2, XCircle, Pause, ChevronRight } from 'lucide-react';
import { ideaService } from '../services/ideaService';
import { Idea, IdeaStatus, ideaStatusInfo } from '../data/ideas';
import { useToast } from '../components/Toast';
import './PipelinePage.css';

// Pipeline stages to display in Kanban view (main workflow stages)
const pipelineStages: IdeaStatus[] = [
    'submitted',
    'screening',
    'assessment',
    'prioritized',
    'development',
    'pilot',
    'deployed'
];

export function PipelinePage() {
    const { showToast } = useToast();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const [movingIdea, setMovingIdea] = useState<string | null>(null);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        setLoading(true);
        const allIdeas = await ideaService.getAllIdeas();
        setIdeas(allIdeas);
        setLoading(false);
    };

    const getIdeasForStage = (status: IdeaStatus) => {
        return ideas.filter(idea => idea.status === status);
    };

    const getNextStage = (currentStatus: IdeaStatus): IdeaStatus | null => {
        const currentIndex = pipelineStages.indexOf(currentStatus);
        if (currentIndex === -1 || currentIndex >= pipelineStages.length - 1) {
            return null;
        }
        return pipelineStages[currentIndex + 1];
    };

    const handleMoveToNextStage = async (idea: Idea) => {
        const nextStage = getNextStage(idea.status);
        if (!nextStage) {
            showToast('This idea is at the final stage', 'info');
            return;
        }

        setMovingIdea(idea.id);
        try {
            await ideaService.updateIdeaStatus(idea.id, nextStage);
            showToast(`"${idea.title}" moved to ${ideaStatusInfo[nextStage].label}`, 'success');
            fetchIdeas();
        } catch {
            showToast('Failed to move idea', 'error');
        } finally {
            setMovingIdea(null);
        }
    };

    const handleReject = async (idea: Idea) => {
        setMovingIdea(idea.id);
        try {
            await ideaService.updateIdeaStatus(idea.id, 'rejected');
            showToast(`"${idea.title}" has been rejected`, 'warning');
            fetchIdeas();
        } catch {
            showToast('Failed to update idea', 'error');
        } finally {
            setMovingIdea(null);
        }
    };

    const handlePutOnHold = async (idea: Idea) => {
        setMovingIdea(idea.id);
        try {
            await ideaService.updateIdeaStatus(idea.id, 'on_hold');
            showToast(`"${idea.title}" has been put on hold`, 'info');
            fetchIdeas();
        } catch {
            showToast('Failed to update idea', 'error');
        } finally {
            setMovingIdea(null);
        }
    };

    if (loading) {
        return (
            <div className="pipeline-loading">
                <div className="loading-spinner"></div>
                <p>Loading pipeline...</p>
            </div>
        );
    }

    const onHoldIdeas = ideas.filter(i => i.status === 'on_hold');
    const rejectedIdeas = ideas.filter(i => i.status === 'rejected');

    return (
        <div className="pipeline-page">
            <div className="pipeline-container">
                <header className="pipeline-header">
                    <div>
                        <h1><GitBranch size={28} /> Innovation Pipeline</h1>
                        <p>Track ideas through the innovation lifecycle from ideation to deployment.</p>
                    </div>
                    <div className="pipeline-stats">
                        <div className="stat">
                            <span className="stat-value">{ideas.length}</span>
                            <span className="stat-label">Total Ideas</span>
                        </div>
                        <div className="stat stat-active">
                            <span className="stat-value">
                                {ideas.filter(i => !['rejected', 'archived', 'on_hold'].includes(i.status)).length}
                            </span>
                            <span className="stat-label">Active</span>
                        </div>
                    </div>
                </header>

                {/* Kanban Board */}
                <div className="kanban-board">
                    {pipelineStages.map((stage, index) => {
                        const stageInfo = ideaStatusInfo[stage];
                        const stageIdeas = getIdeasForStage(stage);
                        const isLastStage = index === pipelineStages.length - 1;

                        return (
                            <div key={stage} className="kanban-column">
                                <div
                                    className="column-header"
                                    style={{ borderTopColor: stageInfo.color }}
                                >
                                    <div className="column-title">
                                        <span className="stage-number">{index + 1}</span>
                                        <span className="stage-name">{stageInfo.label}</span>
                                    </div>
                                    <span className="column-count">{stageIdeas.length}</span>
                                </div>

                                <div className="column-cards">
                                    {stageIdeas.length === 0 ? (
                                        <div className="empty-column">
                                            <p>No ideas</p>
                                        </div>
                                    ) : (
                                        stageIdeas.map(idea => (
                                            <div
                                                key={idea.id}
                                                className={`pipeline-card ${movingIdea === idea.id ? 'moving' : ''}`}
                                            >
                                                <Link to={`/idea/${idea.id}`} className="card-title">
                                                    {idea.title}
                                                </Link>
                                                <div className="card-meta">
                                                    <span><Cpu size={12} /> {idea.aiCapabilityArea}</span>
                                                </div>
                                                <div className="card-footer">
                                                    <span className="submitter">
                                                        <User size={12} />
                                                        {idea.submitterName.split(' ')[0]}
                                                    </span>
                                                    <span className="date">
                                                        <Calendar size={12} />
                                                        {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="card-actions">
                                                    {!isLastStage && (
                                                        <button
                                                            className="action-btn advance"
                                                            onClick={() => handleMoveToNextStage(idea)}
                                                            disabled={movingIdea === idea.id}
                                                            title={`Move to ${ideaStatusInfo[getNextStage(idea.status)!]?.label}`}
                                                        >
                                                            <ChevronRight size={14} />
                                                            Advance
                                                        </button>
                                                    )}
                                                    {isLastStage && (
                                                        <button
                                                            className="action-btn complete"
                                                            onClick={() => handleMoveToNextStage(idea)}
                                                            disabled={true}
                                                            title="Deployed - Final stage"
                                                        >
                                                            <CheckCircle2 size={14} />
                                                            Deployed
                                                        </button>
                                                    )}
                                                    <button
                                                        className="action-btn hold"
                                                        onClick={() => handlePutOnHold(idea)}
                                                        disabled={movingIdea === idea.id}
                                                        title="Put on hold"
                                                    >
                                                        <Pause size={14} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleReject(idea)}
                                                        disabled={movingIdea === idea.id}
                                                        title="Reject"
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {!isLastStage && (
                                    <div className="column-connector">
                                        <ArrowRight size={16} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* On Hold and Rejected sections */}
                {(onHoldIdeas.length > 0 || rejectedIdeas.length > 0) && (
                    <div className="secondary-sections">
                        {onHoldIdeas.length > 0 && (
                            <section className="secondary-section on-hold-section">
                                <h3>
                                    <Pause size={18} />
                                    On Hold ({onHoldIdeas.length})
                                </h3>
                                <div className="secondary-ideas">
                                    {onHoldIdeas.map(idea => (
                                        <Link key={idea.id} to={`/idea/${idea.id}`} className="secondary-idea-card">
                                            <span className="idea-title">{idea.title}</span>
                                            <span className="idea-submitter">{idea.submitterName}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {rejectedIdeas.length > 0 && (
                            <section className="secondary-section rejected-section">
                                <h3>
                                    <XCircle size={18} />
                                    Rejected ({rejectedIdeas.length})
                                </h3>
                                <div className="secondary-ideas">
                                    {rejectedIdeas.map(idea => (
                                        <Link key={idea.id} to={`/idea/${idea.id}`} className="secondary-idea-card">
                                            <span className="idea-title">{idea.title}</span>
                                            <span className="idea-submitter">{idea.submitterName}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* Legend */}
                <div className="pipeline-legend">
                    <h4>Innovation Lifecycle Stages</h4>
                    <div className="legend-items">
                        {pipelineStages.map((stage, index) => (
                            <div key={stage} className="legend-item">
                                <span
                                    className="legend-dot"
                                    style={{ backgroundColor: ideaStatusInfo[stage].color }}
                                ></span>
                                <span className="legend-number">{index + 1}.</span>
                                <span className="legend-label">{ideaStatusInfo[stage].label}</span>
                                <span className="legend-desc">{ideaStatusInfo[stage].description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
