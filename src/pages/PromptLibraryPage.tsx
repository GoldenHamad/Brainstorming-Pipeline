import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Sparkles, Filter, Star, Copy, CheckCircle } from 'lucide-react';
import { promptService } from '../services/promptService';
import { PromptEntry, Category, categoryInfo } from '../data/prompts';
import { useToast } from '../components/Toast';
import './PromptLibraryPage.css';

export function PromptLibraryPage() {
    const { showToast } = useToast();
    const [prompts, setPrompts] = useState<PromptEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchPrompts();
    }, [searchQuery, selectedCategory]);

    const fetchPrompts = async () => {
        setLoading(true);
        const results = await promptService.searchPrompts({
            query: searchQuery || undefined,
            categories: selectedCategory !== 'all' ? [selectedCategory] : undefined
        });
        setPrompts(results);
        setLoading(false);
    };

    const handleCopyPrompt = async (prompt: PromptEntry) => {
        try {
            await navigator.clipboard.writeText(prompt.prompt_text);
            setCopiedId(prompt.prompt_id);
            showToast('Prompt copied to clipboard!', 'success');
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            showToast('Failed to copy prompt', 'error');
        }
    };

    const categories = Object.entries(categoryInfo) as [Category, typeof categoryInfo[Category]][];

    return (
        <div className="prompt-library-page">
            {/* Hero Header */}
            <header className="library-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <BookOpen size={16} />
                            Learning Resources
                        </div>
                        <h1>
                            <Sparkles size={32} />
                            AI Prompt Library
                        </h1>
                        <p>
                            Explore curated prompts to enhance your productivity. Learn best practices
                            and get inspired for your AI use cases.
                        </p>
                    </div>
                </div>
            </header>

            <div className="container">
                {/* Search & Filter */}
                <div className="search-section">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search prompts by keyword, category, or use case..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-section">
                        <Filter size={16} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(([key]) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Category Cards */}
                <section className="category-section">
                    <h2>Browse by Category</h2>
                    <div className="category-grid">
                        {categories.map(([key, info]) => (
                            <button
                                key={key}
                                className={`category-card ${selectedCategory === key ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
                                style={{ '--accent-color': info.color } as React.CSSProperties}
                            >
                                <span className="category-icon">{info.icon}</span>
                                <span className="category-label">{key}</span>
                                <span className="category-count">
                                    {prompts.filter(p => p.category === key).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Prompts List */}
                <section className="prompts-section">
                    <div className="section-header">
                        <h2>
                            {selectedCategory === 'all'
                                ? 'All Prompts'
                                : `${selectedCategory} Prompts`
                            }
                        </h2>
                        <span className="result-count">{prompts.length} prompts</span>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading prompts...</p>
                        </div>
                    ) : prompts.length === 0 ? (
                        <div className="empty-state">
                            <BookOpen size={48} />
                            <h3>No prompts found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <div className="prompts-grid">
                            {prompts.map(prompt => (
                                <article key={prompt.prompt_id} className="prompt-card">
                                    <div className="card-header">
                                        <span
                                            className="category-badge"
                                            style={{
                                                backgroundColor: `${categoryInfo[prompt.category].color}15`,
                                                color: categoryInfo[prompt.category].color
                                            }}
                                        >
                                            {categoryInfo[prompt.category].icon} {prompt.category}
                                        </span>
                                        <div className="rating">
                                            <Star size={14} fill="#FFC107" color="#FFC107" />
                                            <span>{prompt.rating.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <Link to={`/resources/prompts/${prompt.prompt_id}`} className="card-title">
                                        {prompt.title}
                                    </Link>

                                    <p className="card-description">
                                        {prompt.prompt_text.slice(0, 150)}...
                                    </p>

                                    <div className="card-tags">
                                        {prompt.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="card-footer">
                                        <Link to={`/resources/prompts/${prompt.prompt_id}`} className="btn btn-ghost btn-sm">
                                            View Details
                                        </Link>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleCopyPrompt(prompt)}
                                        >
                                            {copiedId === prompt.prompt_id ? (
                                                <><CheckCircle size={14} /> Copied!</>
                                            ) : (
                                                <><Copy size={14} /> Copy</>
                                            )}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Call to Action */}
                <section className="cta-section">
                    <div className="cta-content">
                        <h3>Have a great prompt to share?</h3>
                        <p>Contribute to the library and help your colleagues work smarter with AI.</p>
                        <Link to="/resources/prompts/submit" className="btn btn-primary">
                            Submit a Prompt
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
