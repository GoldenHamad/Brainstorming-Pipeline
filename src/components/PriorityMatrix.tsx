import { useMemo } from 'react';
import { Idea, quadrantInfo } from '../data/ideas';
import './PriorityMatrix.css';

interface PriorityMatrixProps {
    ideas: Idea[];
    onIdeaClick?: (idea: Idea) => void;
    selectedId?: string;
}

export function PriorityMatrix({ ideas, onIdeaClick, selectedId }: PriorityMatrixProps) {
    // Only show assessed ideas
    const assessedIdeas = useMemo(() =>
        ideas.filter(idea => idea.assessment !== undefined),
        [ideas]
    );

    // Convert score (1-3) to percentage position
    const scoreToPosition = (score: number): number => {
        // Map 1-3 to 10-90%
        return ((score - 1) / 2) * 80 + 10;
    };

    return (
        <div className="priority-matrix">
            <div className="matrix-container">
                {/* Y-axis label */}
                <div className="axis-label y-axis-label">
                    <span>Value</span>
                </div>

                {/* Matrix grid */}
                <div className="matrix-grid">
                    {/* Quadrant backgrounds */}
                    <div className="quadrant quadrant-calculated-risks" title="Calculated Risks">
                        <span className="quadrant-label">Calculated Risks</span>
                    </div>
                    <div className="quadrant quadrant-likely-wins" title="Likely Wins">
                        <span className="quadrant-label">Likely Wins</span>
                    </div>
                    <div className="quadrant quadrant-avoid" title="Avoid">
                        <span className="quadrant-label">Avoid</span>
                    </div>
                    <div className="quadrant quadrant-marginal-gains" title="Marginal Gains">
                        <span className="quadrant-label">Marginal Gains</span>
                    </div>

                    {/* Idea dots */}
                    {assessedIdeas.map(idea => {
                        const assessment = idea.assessment!;
                        const x = scoreToPosition(assessment.feasibilityScore);
                        const y = 100 - scoreToPosition(assessment.valueScore); // Invert Y
                        const quadrant = quadrantInfo[assessment.quadrant];

                        return (
                            <button
                                key={idea.id}
                                className={`idea-dot ${selectedId === idea.id ? 'selected' : ''}`}
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    backgroundColor: quadrant.color
                                }}
                                onClick={() => onIdeaClick?.(idea)}
                                title={idea.title}
                            >
                                <span className="idea-dot-tooltip">
                                    <strong>{idea.title}</strong>
                                    <span>Value: {assessment.valueScore.toFixed(1)} | Feasibility: {assessment.feasibilityScore.toFixed(1)}</span>
                                    <span className="tooltip-quadrant">{quadrant.label}</span>
                                </span>
                            </button>
                        );
                    })}

                    {/* Axis indicators */}
                    <span className="axis-indicator low-label x">Low</span>
                    <span className="axis-indicator high-label x">High</span>
                    <span className="axis-indicator low-label y">Low</span>
                    <span className="axis-indicator high-label y">High</span>
                </div>

                {/* X-axis label */}
                <div className="axis-label x-axis-label">
                    <span>Feasibility</span>
                </div>
            </div>

            {/* Legend */}
            <div className="matrix-legend">
                {Object.entries(quadrantInfo).map(([key, info]) => (
                    <div key={key} className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: info.color }}></span>
                        <span className="legend-label">{info.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
