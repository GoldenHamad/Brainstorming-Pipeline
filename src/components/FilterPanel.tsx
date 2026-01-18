import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Category, ComplexityLevel, AITool } from '../data/prompts';
import './FilterPanel.css';

interface FilterPanelProps {
    selectedCategories: Category[];
    selectedComplexity: ComplexityLevel[];
    selectedTools: AITool[];
    minRating: number;
    onCategoriesChange: (categories: Category[]) => void;
    onComplexityChange: (levels: ComplexityLevel[]) => void;
    onToolsChange: (tools: AITool[]) => void;
    onRatingChange: (rating: number) => void;
    onClearAll: () => void;
}

const allCategories: Category[] = [
    'Client Deliverables',
    'Internal Productivity',
    'Research & Analysis',
    'Data & Finance',
    'Creative & Marketing',
    'Technical'
];

const allComplexityLevels: ComplexityLevel[] = ['Beginner', 'Intermediate', 'Expert'];

const allAITools: AITool[] = ['ChatGPT', 'Microsoft Copilot', 'Google Gemini', 'Claude', 'Internal AI'];

export function FilterPanel({
    selectedCategories,
    selectedComplexity,
    selectedTools,
    minRating,
    onCategoriesChange,
    onComplexityChange,
    onToolsChange,
    onRatingChange,
    onClearAll
}: FilterPanelProps) {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        complexity: true,
        tools: false,
        rating: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCategoryToggle = (category: Category) => {
        if (selectedCategories.includes(category)) {
            onCategoriesChange(selectedCategories.filter(c => c !== category));
        } else {
            onCategoriesChange([...selectedCategories, category]);
        }
    };

    const handleComplexityToggle = (level: ComplexityLevel) => {
        if (selectedComplexity.includes(level)) {
            onComplexityChange(selectedComplexity.filter(l => l !== level));
        } else {
            onComplexityChange([...selectedComplexity, level]);
        }
    };

    const handleToolToggle = (tool: AITool) => {
        if (selectedTools.includes(tool)) {
            onToolsChange(selectedTools.filter(t => t !== tool));
        } else {
            onToolsChange([...selectedTools, tool]);
        }
    };

    const activeFilterCount =
        selectedCategories.length +
        selectedComplexity.length +
        selectedTools.length +
        (minRating > 0 ? 1 : 0);

    return (
        <aside className="filter-panel">
            <div className="filter-header">
                <h3 className="filter-title">Filters</h3>
                {activeFilterCount > 0 && (
                    <button className="filter-clear-all" onClick={onClearAll}>
                        Clear all ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
                <div className="active-filters">
                    {selectedCategories.map(cat => (
                        <span key={cat} className="filter-chip">
                            {cat}
                            <button onClick={() => handleCategoryToggle(cat)} aria-label={`Remove ${cat} filter`}>
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    {selectedComplexity.map(level => (
                        <span key={level} className="filter-chip">
                            {level}
                            <button onClick={() => handleComplexityToggle(level)} aria-label={`Remove ${level} filter`}>
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    {selectedTools.map(tool => (
                        <span key={tool} className="filter-chip">
                            {tool}
                            <button onClick={() => handleToolToggle(tool)} aria-label={`Remove ${tool} filter`}>
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    {minRating > 0 && (
                        <span className="filter-chip">
                            {minRating}+ Stars
                            <button onClick={() => onRatingChange(0)} aria-label="Remove rating filter">
                                <X size={12} />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Category Filter */}
            <div className="filter-section">
                <button
                    className="filter-section-header"
                    onClick={() => toggleSection('category')}
                    aria-expanded={expandedSections.category}
                >
                    <span>Category</span>
                    {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.category && (
                    <div className="filter-options">
                        {allCategories.map(category => (
                            <label key={category} className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryToggle(category)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="filter-option-label">{category}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Complexity Filter */}
            <div className="filter-section">
                <button
                    className="filter-section-header"
                    onClick={() => toggleSection('complexity')}
                    aria-expanded={expandedSections.complexity}
                >
                    <span>Complexity</span>
                    {expandedSections.complexity ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.complexity && (
                    <div className="filter-options">
                        {allComplexityLevels.map(level => (
                            <label key={level} className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={selectedComplexity.includes(level)}
                                    onChange={() => handleComplexityToggle(level)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className={`filter-option-label complexity-${level.toLowerCase()}`}>
                                    {level}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Tools Filter */}
            <div className="filter-section">
                <button
                    className="filter-section-header"
                    onClick={() => toggleSection('tools')}
                    aria-expanded={expandedSections.tools}
                >
                    <span>AI Tools</span>
                    {expandedSections.tools ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.tools && (
                    <div className="filter-options">
                        {allAITools.map(tool => (
                            <label key={tool} className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={selectedTools.includes(tool)}
                                    onChange={() => handleToolToggle(tool)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="filter-option-label">{tool}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
                <button
                    className="filter-section-header"
                    onClick={() => toggleSection('rating')}
                    aria-expanded={expandedSections.rating}
                >
                    <span>Minimum Rating</span>
                    {expandedSections.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.rating && (
                    <div className="filter-options rating-options">
                        {[0, 3, 3.5, 4, 4.5].map(rating => (
                            <label key={rating} className="filter-option radio">
                                <input
                                    type="radio"
                                    name="minRating"
                                    checked={minRating === rating}
                                    onChange={() => onRatingChange(rating)}
                                />
                                <span className="radio-custom"></span>
                                <span className="filter-option-label">
                                    {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
