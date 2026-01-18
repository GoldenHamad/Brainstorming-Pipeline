import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { PromptCard } from '../components/PromptCard';
import { promptService, SearchFilters } from '../services/promptService';
import { PromptEntry, Category, ComplexityLevel, AITool, categoryInfo } from '../data/prompts';
import './HomePage.css';

export function HomePage() {
    const [prompts, setPrompts] = useState<PromptEntry[]>([]);
    const [featuredPrompts, setFeaturedPrompts] = useState<PromptEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [selectedComplexity, setSelectedComplexity] = useState<ComplexityLevel[]>([]);
    const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
    const [minRating, setMinRating] = useState(0);

    const hasActiveFilters =
        searchQuery ||
        selectedCategories.length > 0 ||
        selectedComplexity.length > 0 ||
        selectedTools.length > 0 ||
        minRating > 0;

    // Fetch prompts based on filters
    const fetchPrompts = useCallback(async () => {
        setLoading(true);
        const filters: SearchFilters = {
            query: searchQuery || undefined,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            complexityLevels: selectedComplexity.length > 0 ? selectedComplexity : undefined,
            aiTools: selectedTools.length > 0 ? selectedTools : undefined,
            minRating: minRating > 0 ? minRating : undefined
        };
        const results = await promptService.searchPrompts(filters);
        setPrompts(results);
        setLoading(false);
    }, [searchQuery, selectedCategories, selectedComplexity, selectedTools, minRating]);

    // Fetch featured prompts on mount
    useEffect(() => {
        const fetchFeatured = async () => {
            const featured = await promptService.getFeaturedPrompts(4);
            setFeaturedPrompts(featured);
        };
        fetchFeatured();
    }, []);

    // Fetch prompts when filters change
    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) setShowFilters(true);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setSelectedComplexity([]);
        setSelectedTools([]);
        setMinRating(0);
    };

    const categories = Object.entries(categoryInfo) as [Category, typeof categoryInfo[Category]][];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Find the Perfect <span className="text-gradient">AI Prompt</span>
                        </h1>
                        <p className="hero-subtitle">
                            Access KPMG's curated library of high-quality prompts.
                            Boost productivity and ensure consistent AI outputs across the organization.
                        </p>
                        <div className="hero-search">
                            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">16+</span>
                                <span className="stat-label">Prompts</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-value">6</span>
                                <span className="stat-label">Categories</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-value">12k+</span>
                                <span className="stat-label">Copies</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-bg"></div>
            </section>

            {/* Category Quick Links */}
            {!hasActiveFilters && (
                <section className="categories-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Browse by Category</h2>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Hide Filters' : 'Show All Filters'}
                            </button>
                        </div>
                        <div className="categories-grid">
                            {categories.map(([category, info]) => (
                                <button
                                    key={category}
                                    className="category-card"
                                    onClick={() => {
                                        setSelectedCategories([category]);
                                        setShowFilters(true);
                                    }}
                                    style={{ '--category-color': info.color } as React.CSSProperties}
                                >
                                    <span className="category-icon-wrapper">
                                        <span className="category-icon" style={{ backgroundColor: info.color }}></span>
                                    </span>
                                    <span className="category-info">
                                        <span className="category-title">{category}</span>
                                        <span className="category-desc">{info.description.slice(0, 50)}...</span>
                                    </span>
                                    <ArrowRight size={18} className="category-arrow" />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Prompts - Show when no filters */}
            {!hasActiveFilters && (
                <section className="featured-section">
                    <div className="container">
                        <div className="section-header">
                            <div className="section-title-group">
                                <TrendingUp size={24} className="section-icon" />
                                <h2 className="section-title">Trending Prompts</h2>
                            </div>
                            <Link to="/?view=all" className="view-all-link">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="featured-grid">
                            {featuredPrompts.map(prompt => (
                                <PromptCard key={prompt.prompt_id} prompt={prompt} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Search Results / All Prompts */}
            {hasActiveFilters && (
                <section className="results-section">
                    <div className="container">
                        <div className="results-layout">
                            {showFilters && (
                                <FilterPanel
                                    selectedCategories={selectedCategories}
                                    selectedComplexity={selectedComplexity}
                                    selectedTools={selectedTools}
                                    minRating={minRating}
                                    onCategoriesChange={setSelectedCategories}
                                    onComplexityChange={setSelectedComplexity}
                                    onToolsChange={setSelectedTools}
                                    onRatingChange={setMinRating}
                                    onClearAll={handleClearFilters}
                                />
                            )}
                            <div className="results-content">
                                <div className="results-header">
                                    <h2 className="results-title">
                                        {searchQuery ? (
                                            <>Results for "<span className="highlight">{searchQuery}</span>"</>
                                        ) : (
                                            'All Prompts'
                                        )}
                                    </h2>
                                    <span className="results-count">{prompts.length} prompts found</span>
                                </div>

                                {loading ? (
                                    <div className="loading-state">
                                        <Sparkles size={32} className="loading-icon" />
                                        <p>Loading prompts...</p>
                                    </div>
                                ) : prompts.length === 0 ? (
                                    <div className="empty-state">
                                        <Sparkles size={48} className="empty-icon" />
                                        <h3>No prompts found</h3>
                                        <p>Try adjusting your search or filters</p>
                                        <button className="btn btn-primary" onClick={handleClearFilters}>
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="results-grid">
                                        {prompts.map(prompt => (
                                            <PromptCard key={prompt.prompt_id} prompt={prompt} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Prompts when no filters */}
            {!hasActiveFilters && (
                <section className="all-prompts-section">
                    <div className="container">
                        <div className="section-header">
                            <div className="section-title-group">
                                <Sparkles size={24} className="section-icon" />
                                <h2 className="section-title">All Prompts</h2>
                            </div>
                            <span className="results-count">{prompts.length} prompts available</span>
                        </div>
                        <div className="results-grid">
                            {prompts.slice(0, 8).map(prompt => (
                                <PromptCard key={prompt.prompt_id} prompt={prompt} />
                            ))}
                        </div>
                        {prompts.length > 8 && (
                            <div className="view-more-wrapper">
                                <button
                                    className="btn btn-secondary btn-lg"
                                    onClick={() => setShowFilters(true)}
                                >
                                    View All {prompts.length} Prompts
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
