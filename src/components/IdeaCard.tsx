import { Link } from 'react-router-dom';
import { Calendar, User, Cpu, Briefcase } from 'lucide-react';
import { Idea } from '../data/ideas';
import { QuadrantBadge } from './QuadrantBadge';
import './IdeaCard.css';

interface IdeaCardProps {
    idea: Idea;
    variant?: 'default' | 'compact';
}

const statusLabels: Record<string, { label: string; color: string }> = {
    submitted: { label: 'Submitted', color: '#6C757D' },
    under_review: { label: 'Under Review', color: '#FFC107' },
    assessed: { label: 'Assessed', color: '#28A745' },
    prioritized: { label: 'Prioritized', color: '#00338D' },
    archived: { label: 'Archived', color: '#ADB5BD' }
};

export function IdeaCard({ idea, variant = 'default' }: IdeaCardProps) {
    const statusInfo = statusLabels[idea.status];

    return (
        <Link to={`/ideas/${idea.id}`} className={`idea-card idea-card-${variant}`}>
            <div className="idea-card-header">
                <span
                    className="idea-status-badge"
                    style={{ backgroundColor: `${statusInfo.color}15`, color: statusInfo.color }}
                >
                    {statusInfo.label}
                </span>
                {idea.assessment && (
                    <QuadrantBadge quadrant={idea.assessment.quadrant} size="sm" />
                )}
            </div>

            <h3 className="idea-card-title">{idea.title}</h3>

            {variant === 'default' && (
                <p className="idea-card-description">
                    {idea.description.length > 150
                        ? `${idea.description.slice(0, 150)}...`
                        : idea.description}
                </p>
            )}

            <div className="idea-card-meta">
                <span className="idea-meta-item">
                    <Cpu size={14} />
                    {idea.aiCapabilityArea}
                </span>
                <span className="idea-meta-item">
                    <Briefcase size={14} />
                    {idea.businessFunction}
                </span>
            </div>

            {idea.assessment && variant === 'default' && (
                <div className="idea-card-scores">
                    <div className="score-item">
                        <span className="score-label">Value</span>
                        <span className="score-value">{idea.assessment.valueScore.toFixed(1)}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Feasibility</span>
                        <span className="score-value">{idea.assessment.feasibilityScore.toFixed(1)}</span>
                    </div>
                </div>
            )}

            <div className="idea-card-footer">
                <span className="idea-submitter">
                    <User size={14} />
                    {idea.submitterName}
                </span>
                <span className="idea-date">
                    <Calendar size={14} />
                    {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </Link>
    );
}
