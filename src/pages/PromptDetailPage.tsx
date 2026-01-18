import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, ArrowLeft, Clock, User, Star, Tag, Cpu, BookOpen, MessageSquare } from 'lucide-react';
import { promptService } from '../services/promptService';
import { PromptEntry, categoryInfo } from '../data/prompts';
import { RatingWidget } from '../components/RatingWidget';
import { useToast } from '../components/Toast';
import './PromptDetailPage.css';

export function PromptDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();
    const [prompt, setPrompt] = useState<PromptEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    useEffect(() => {
        const fetchPrompt = async () => {
            if (!id) return;
            setLoading(true);
            const result = await promptService.getPromptById(id);
            setPrompt(result);
            setLoading(false);
        };
        fetchPrompt();
    }, [id]);

    const handleCopy = async () => {
        if (!prompt) return;
        try {
            await navigator.clipboard.writeText(prompt.prompt_text);
            await promptService.recordCopy(prompt.prompt_id);
            showToast('Prompt copied to clipboard!', 'success');
        } catch {
            showToast('Failed to copy prompt', 'error');
        }
    };

    const handleRate = async (rating: number) => {
        if (!prompt) return;
        await promptService.submitRating(prompt.prompt_id, rating, feedback);
        showToast('Thanks for rating this prompt!', 'success');
        // Refetch to get updated rating
        const updated = await promptService.getPromptById(prompt.prompt_id);
        if (updated) setPrompt(updated);
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || !feedback.trim()) return;
        showToast('Feedback submitted successfully!', 'success');
        setFeedback('');
        setShowFeedbackForm(false);
    };

    if (loading) {
        return (
            <div className="prompt-detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading prompt...</p>
            </div>
        );
    }

    if (!prompt) {
        return (
            <div className="prompt-detail-not-found">
                <h2>Prompt not found</h2>
                <p>The prompt you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn btn-primary">
                    <ArrowLeft size={18} />
                    Back to Library
                </Link>
            </div>
        );
    }

    const catInfo = categoryInfo[prompt.category];

    return (
        <div className="prompt-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Library</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to={`/?category=${encodeURIComponent(prompt.category)}`}>{prompt.category}</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{prompt.title}</span>
                </nav>

                <div className="prompt-detail-layout">
                    {/* Main Content */}
                    <main className="prompt-detail-main">
                        <header className="prompt-detail-header">
                            <div className="prompt-meta-row">
                                <span
                                    className="category-badge"
                                    style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color }}
                                >
                                    {prompt.category}
                                </span>
                                <span className={`complexity-badge badge-${prompt.complexity_level.toLowerCase()}`}>
                                    {prompt.complexity_level}
                                </span>
                                <span className="version-badge">v{prompt.version}</span>
                            </div>
                            <h1 className="prompt-detail-title">{prompt.title}</h1>
                            <div className="prompt-rating-row">
                                <RatingWidget
                                    rating={prompt.rating}
                                    ratingCount={prompt.rating_count}
                                    size="lg"
                                />
                                <span className="usage-stat">
                                    {prompt.usage_count.toLocaleString()} copies
                                </span>
                            </div>
                        </header>

                        {/* Prompt Text */}
                        <section className="prompt-text-section card">
                            <div className="prompt-text-header">
                                <h2>Prompt</h2>
                                <button className="btn btn-primary" onClick={handleCopy}>
                                    <Copy size={18} />
                                    Copy to Clipboard
                                </button>
                            </div>
                            <pre className="prompt-text">{prompt.prompt_text}</pre>
                        </section>

                        {/* Example Input/Output */}
                        {(prompt.example_input || prompt.example_output) && (
                            <section className="examples-section">
                                <h2 className="examples-title">
                                    <BookOpen size={20} />
                                    Example Usage
                                </h2>
                                <div className="examples-grid">
                                    {prompt.example_input && (
                                        <div className="example-card card">
                                            <h3>Sample Input</h3>
                                            <p>{prompt.example_input}</p>
                                        </div>
                                    )}
                                    {prompt.example_output && (
                                        <div className="example-card card">
                                            <h3>Expected Output</h3>
                                            <p>{prompt.example_output}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Best Practices */}
                        {prompt.best_practices && (
                            <section className="best-practices-section card">
                                <h2>
                                    <Star size={20} />
                                    Best Practices
                                </h2>
                                <p>{prompt.best_practices}</p>
                            </section>
                        )}

                        {/* Rating & Feedback */}
                        <section className="feedback-section card">
                            <h2>Rate This Prompt</h2>
                            <p className="feedback-description">
                                Help us improve by rating this prompt and providing feedback.
                            </p>
                            <div className="rating-form">
                                <RatingWidget
                                    rating={0}
                                    size="lg"
                                    interactive
                                    onRate={handleRate}
                                    showCount={false}
                                />
                            </div>

                            {!showFeedbackForm ? (
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowFeedbackForm(true)}
                                >
                                    <MessageSquare size={18} />
                                    Add Written Feedback
                                </button>
                            ) : (
                                <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Share your experience with this prompt..."
                                        className="form-textarea"
                                        rows={4}
                                    />
                                    <div className="feedback-actions">
                                        <button type="button" className="btn btn-ghost" onClick={() => setShowFeedbackForm(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={!feedback.trim()}>
                                            Submit Feedback
                                        </button>
                                    </div>
                                </form>
                            )}
                        </section>
                    </main>

                    {/* Sidebar */}
                    <aside className="prompt-detail-sidebar">
                        <div className="sidebar-card card">
                            <h3>Details</h3>
                            <dl className="details-list">
                                <div className="detail-item">
                                    <dt><Cpu size={16} /> AI Tools</dt>
                                    <dd>
                                        <div className="tools-list">
                                            {prompt.ai_tools.map(tool => (
                                                <span key={tool} className="tool-pill">{tool}</span>
                                            ))}
                                        </div>
                                    </dd>
                                </div>
                                <div className="detail-item">
                                    <dt><Tag size={16} /> Output Format</dt>
                                    <dd>{prompt.output_format}</dd>
                                </div>
                                <div className="detail-item">
                                    <dt><User size={16} /> Owner</dt>
                                    <dd>{prompt.owner}</dd>
                                </div>
                                <div className="detail-item">
                                    <dt><Clock size={16} /> Last Updated</dt>
                                    <dd>{new Date(prompt.last_modified).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="sidebar-card card">
                            <h3>Tags</h3>
                            <div className="tags-list">
                                {prompt.tags.map(tag => (
                                    <Link
                                        key={tag}
                                        to={`/?q=${encodeURIComponent(tag)}`}
                                        className="tag-link"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/" className="btn btn-secondary btn-block">
                            <ArrowLeft size={18} />
                            Back to Library
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
