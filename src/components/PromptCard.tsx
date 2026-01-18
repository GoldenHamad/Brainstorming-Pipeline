import { Link } from 'react-router-dom';
import { Copy, Star, ArrowRight } from 'lucide-react';
import { PromptEntry, categoryInfo } from '../data/prompts';
import { promptService } from '../services/promptService';
import { useToast } from './Toast';
import { RatingWidget } from './RatingWidget';
import './PromptCard.css';

interface PromptCardProps {
    prompt: PromptEntry;
    variant?: 'default' | 'compact';
}

export function PromptCard({ prompt, variant = 'default' }: PromptCardProps) {
    const { showToast } = useToast();
    const catInfo = categoryInfo[prompt.category];

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(prompt.prompt_text);
            await promptService.recordCopy(prompt.prompt_id);
            showToast('Prompt copied to clipboard!', 'success');
        } catch {
            showToast('Failed to copy prompt', 'error');
        }
    };

    const getComplexityClass = (level: string) => {
        return `badge badge-${level.toLowerCase()}`;
    };

    if (variant === 'compact') {
        return (
            <Link to={`/prompt/${prompt.prompt_id}`} className="prompt-card-compact card card-clickable">
                <div className="prompt-card-compact-header">
                    <span className="category-dot" style={{ backgroundColor: catInfo.color }}></span>
                    <span className="category-name">{prompt.category}</span>
                </div>
                <h4 className="prompt-card-compact-title">{prompt.title}</h4>
                <div className="prompt-card-compact-footer">
                    <RatingWidget rating={prompt.rating} size="sm" showCount={false} />
                    <span className="usage-count">{prompt.usage_count.toLocaleString()} copies</span>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/prompt/${prompt.prompt_id}`} className="prompt-card card card-clickable">
            <div className="prompt-card-header">
                <div className="prompt-card-category">
                    <span className="category-dot" style={{ backgroundColor: catInfo.color }}></span>
                    <span className="category-name">{prompt.category}</span>
                </div>
                <span className={getComplexityClass(prompt.complexity_level)}>
                    {prompt.complexity_level}
                </span>
            </div>

            <h3 className="prompt-card-title">{prompt.title}</h3>

            <p className="prompt-card-preview">
                {prompt.prompt_text.slice(0, 120)}...
            </p>

            <div className="prompt-card-tags">
                {prompt.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
                {prompt.tags.length > 3 && (
                    <span className="tag tag-more">+{prompt.tags.length - 3}</span>
                )}
            </div>

            <div className="prompt-card-tools">
                {prompt.ai_tools.slice(0, 3).map(tool => (
                    <span key={tool} className="tool-badge">{tool}</span>
                ))}
            </div>

            <div className="prompt-card-footer">
                <div className="prompt-card-rating">
                    <Star size={16} fill="var(--color-star)" color="var(--color-star)" />
                    <span className="rating-value">{prompt.rating.toFixed(1)}</span>
                    <span className="rating-count">({prompt.rating_count})</span>
                </div>

                <div className="prompt-card-actions">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleCopy}
                        aria-label="Copy prompt to clipboard"
                    >
                        <Copy size={14} />
                        Copy
                    </button>
                    <span className="view-link">
                        View <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
