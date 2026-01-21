import { Quadrant, quadrantInfo } from '../data/ideas';
import './QuadrantBadge.css';

interface QuadrantBadgeProps {
    quadrant: Quadrant;
    size?: 'sm' | 'md' | 'lg';
    showDescription?: boolean;
}

export function QuadrantBadge({ quadrant, size = 'md', showDescription = false }: QuadrantBadgeProps) {
    const info = quadrantInfo[quadrant];

    return (
        <div className={`quadrant-badge quadrant-badge-${size}`}>
            <span
                className="quadrant-badge-label"
                style={{ backgroundColor: `${info.color}15`, color: info.color, borderColor: info.color }}
            >
                <span className="quadrant-dot" style={{ backgroundColor: info.color }}></span>
                {info.label}
            </span>
            {showDescription && (
                <span className="quadrant-description">{info.description}</span>
            )}
        </div>
    );
}
