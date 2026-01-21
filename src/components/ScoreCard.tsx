import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { ScoreLevel, valueDimensions, feasibilityDimensions } from '../data/ideas';
import './ScoreCard.css';

interface ScoreCardProps {
    onScoreChange: (dimension: string, score: ScoreLevel) => void;
    onRationaleChange: (dimension: string, rationale: string) => void;
    values: Record<string, ScoreLevel>;
    rationales: Record<string, string>;
    readOnly?: boolean;
}

const scoreOptions: { value: ScoreLevel; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

interface DimensionRowProps {
    id: string;
    label: string;
    weight: number;
    tooltip: string;
    value: ScoreLevel | undefined;
    rationale: string;
    onScoreChange: (score: ScoreLevel) => void;
    onRationaleChange: (rationale: string) => void;
    readOnly: boolean;
}

function DimensionRow({
    id, label, weight, tooltip, value, rationale,
    onScoreChange, onRationaleChange, readOnly
}: DimensionRowProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showRationale, setShowRationale] = useState(false);

    return (
        <div className="dimension-row">
            <div className="dimension-header">
                <div className="dimension-label-group">
                    <span className="dimension-label">{label}</span>
                    <span className="dimension-weight">({Math.round(weight * 100)}%)</span>
                    <button
                        className="tooltip-trigger"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        type="button"
                    >
                        <HelpCircle size={14} />
                        {showTooltip && (
                            <div className="tooltip-content">
                                {tooltip}
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <div className="dimension-scores">
                {scoreOptions.map(option => (
                    <label
                        key={option.value}
                        className={`score-option ${value === option.value ? 'selected' : ''} ${readOnly ? 'readonly' : ''}`}
                    >
                        <input
                            type="radio"
                            name={id}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => !readOnly && onScoreChange(option.value)}
                            disabled={readOnly}
                        />
                        <span className={`score-label score-${option.value}`}>
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>

            {!readOnly && (
                <button
                    type="button"
                    className="rationale-toggle"
                    onClick={() => setShowRationale(!showRationale)}
                >
                    {showRationale ? 'Hide rationale' : 'Add rationale'}
                </button>
            )}

            {(showRationale || (readOnly && rationale)) && (
                <textarea
                    className="rationale-input"
                    placeholder="Explain your reasoning..."
                    value={rationale}
                    onChange={(e) => onRationaleChange(e.target.value)}
                    readOnly={readOnly}
                    rows={2}
                />
            )}
        </div>
    );
}

export function ScoreCard({ onScoreChange, onRationaleChange, values, rationales, readOnly = false }: ScoreCardProps) {
    return (
        <div className="scorecard">
            <section className="scorecard-section">
                <h3 className="scorecard-section-title">Business Value</h3>
                {Object.entries(valueDimensions).map(([key, dim]) => (
                    <DimensionRow
                        key={key}
                        id={key}
                        label={dim.label}
                        weight={dim.weight}
                        tooltip={dim.tooltip}
                        value={values[key]}
                        rationale={rationales[key] || ''}
                        onScoreChange={(score) => onScoreChange(key, score)}
                        onRationaleChange={(text) => onRationaleChange(key, text)}
                        readOnly={readOnly}
                    />
                ))}
            </section>

            <section className="scorecard-section">
                <h3 className="scorecard-section-title">Feasibility</h3>
                {Object.entries(feasibilityDimensions).map(([key, dim]) => (
                    <DimensionRow
                        key={key}
                        id={key}
                        label={dim.label}
                        weight={dim.weight}
                        tooltip={dim.tooltip}
                        value={values[key]}
                        rationale={rationales[key] || ''}
                        onScoreChange={(score) => onScoreChange(key, score)}
                        onRationaleChange={(text) => onRationaleChange(key, text)}
                        readOnly={readOnly}
                    />
                ))}
            </section>
        </div>
    );
}
